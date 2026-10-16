import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchListings } from '../api/listings';
import { supabase } from '../lib/supabase';
import { generateListingNumber } from '../components';
import LoadingSpinner from '../components/LoadingSpinner';
import { getVisitStats } from '../api/analytics';
import { getPackageName } from '../utils/packageNames';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalListings: 0,
        activeListings: 0,
        totalUsers: 0,
        onlineUsers: 0,
        newUsersToday: 0,
        newListingsToday: 0,
        totalVisitorsToday: 0,
        loggedInUsersToday: 0,
        guestsToday: 0
    });
    const [recentListings, setRecentListings] = useState([]);
    const [recentPromotions, setRecentPromotions] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);
    const [realtimeOnlineCount, setRealtimeOnlineCount] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [profile, setProfile] = useState(null);
    const refreshTimerRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('admin_role, email, user_number')
                    .eq('id', user.id)
                    .single();
                setProfile(data);
            }
        };
        fetchProfile();
    }, []);

    const loadDashboardData = async (silent = false) => {
        try {
            // Only set loading on initial load if we haven't successfully loaded data yet
            if (!silent && !hasLoadedInitialData) {
                setLoading(true);
            } else if (silent) {
                setIsRefreshing(true);
            }

            // Execute fetches in parallel for better performance
            const now = new Date().toISOString();
            const startOfToday = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

            const [
                { count: listingsCount },
                { count: activeCount },
                { count: usersCount },
                { count: newUsersCount },
                { count: newListingsCount },
                { data: listings, error: listingsError },
                { data: allPromotions, error: allPromotionsError },
                { data: promotions, error: promotionsError },
                visitStats
            ] = await Promise.all([
                // Total listings count - ALL listings ever created (including deleted, sold, etc.)
                supabase.from('listings').select('*', { count: 'exact', head: true }),
                // Active listings count - only currently active AND not expired listings
                supabase.from('listings')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'active')
                    .or(`expiry_date.gt.${now},expiry_date.is.null`),
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', startOfToday),
                supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active').gte('created_at', startOfToday),
                supabase.from('listings').select('*').order('created_at', { ascending: false }).limit(5),
                supabase.from('promotions').select('price, status'),
                supabase.from('promotions').select(`
                    *,
                    listings (title, listing_number),
                    profiles (full_name, user_number)
                `).order('created_at', { ascending: false }).limit(5),
                getVisitStats()
            ]);

            // We no longer rely on profiles 'last_seen' for total online count
            // but we fetch it as a secondary stat if needed

            if (listingsError) throw listingsError;

            // Update stats - use functional update to preserve real-time values like onlineUsers
            setStats(prev => ({
                totalListings: listingsCount || 0,
                activeListings: activeCount || 0,
                totalUsers: usersCount || 0,
                onlineUsers: prev.onlineUsers, // Keep current real-time count
                newUsersToday: newUsersCount || 0,
                newListingsToday: newListingsCount || 0,
                totalVisitorsToday: visitStats.totalVisitorsToday,
                loggedInUsersToday: visitStats.loggedInUsersToday,
                guestsToday: visitStats.guestsToday
            }));

            // Calculate Revenue
            if (!allPromotionsError && allPromotions) {
                const total = allPromotions
                    .filter(p => p.status === 'active' || p.status === 'paid' || p.status === 'expired')
                    .reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0);
                setTotalRevenue(total);
            }

            // Update Recent Data
            if (!promotionsError) setRecentPromotions(promotions || []);

            // Manually fetch profiles for listings
            if (listings && listings.length > 0) {
                const userIds = [...new Set(listings.map(l => l.user_id))];
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('id, full_name, user_number')
                    .in('id', userIds);

                const listingsWithProfiles = listings.map(listing => ({
                    ...listing,
                    profiles: profiles?.find(p => p.id === listing.user_id) || { full_name: 'Bilinmiyor' }
                }));
                setRecentListings(listingsWithProfiles);
            }

            setHasLoadedInitialData(true);
        } catch (error) {
            console.error('Error loading admin stats:', error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    // Debounced refresh function
    const debouncedRefresh = () => {
        if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = setTimeout(() => {
            loadDashboardData(true);
        }, 2000); // 2 second debounce to prevent rapid-fire refreshes
    };

    useEffect(() => {
        loadDashboardData();

        // 1. Periodic refresh as fallback (every 30 seconds)
        const pollInterval = setInterval(() => {
            loadDashboardData(true);
        }, 30000);

        // 2. Real-time subscriptions
        // Only trigger for significant changes to avoid "flickering"
        const listingsSubscription = supabase
            .channel('admin_listings_changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'listings' }, debouncedRefresh)
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'listings' }, debouncedRefresh)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'listings', filter: 'status=eq.active' }, debouncedRefresh)
            .subscribe();

        const profilesSubscription = supabase
            .channel('admin_profiles_changes')
            // Only care about new registrations or deletions, 
            // NOT every 'last_seen' update which happens constantly
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, debouncedRefresh)
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'profiles' }, debouncedRefresh)
            .subscribe();

        const promotionsSubscription = supabase
            .channel('admin_promotions_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'promotions' }, debouncedRefresh)
            .subscribe();

        const visitsSubscription = supabase
            .channel('admin_visits_changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'page_visits' }, debouncedRefresh)
            .subscribe();

        // 3. Presence Subscription for Real-time Online Count (Whole Site)
        const presenceChannel = supabase.channel('site-presence');

        const updateOnlineCount = () => {
            const state = presenceChannel.presenceState();
            if (!state) return;

            // Count unique keys in presence state
            // Each key is a userId or guestId
            const uniqueKeys = Object.keys(state);
            const count = uniqueKeys.length;
            setRealtimeOnlineCount(count > 0 ? count : 0);
        };

        presenceChannel
            .on('presence', { event: 'sync' }, () => {
                updateOnlineCount();
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                updateOnlineCount();
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                updateOnlineCount();
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    // Force a sync check
                    updateOnlineCount();
                }
            });

        return () => {
            if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
            clearInterval(pollInterval);
            listingsSubscription.unsubscribe();
            profilesSubscription.unsubscribe();
            promotionsSubscription.unsubscribe();
            visitsSubscription.unsubscribe();
            presenceChannel.unsubscribe();
        };
    }, []);

    // Sync stats.onlineUsers with realtimeOnlineCount - immediately reflect in UI
    useEffect(() => {
        setStats(prev => ({ ...prev, onlineUsers: realtimeOnlineCount }));
    }, [realtimeOnlineCount]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                <StatsCard title="Toplam Üye" value={stats.totalUsers} />
                <StatsCard title="Aktif İlanlar" value={stats.activeListings} />
                <StatsCard title="Toplam İlan" value={stats.totalListings} />
                <StatsCard title="Bugünkü İlanlar" value={stats.newListingsToday} />
                <Link to="/admin/sales-reports" className="block cursor-pointer">
                    <StatsCard title="Toplam Gelir" value={`${totalRevenue.toLocaleString('tr-TR')} TL`} />
                </Link>
                <StatsCard title="Çevrimiçi" value={stats.onlineUsers} live />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <StatsCard title="Günlük Toplam Ziyaretçi" value={stats.totalVisitorsToday} />
                <StatsCard title="Kayıtlı Kullanıcı Girişi" value={stats.loggedInUsersToday} />
                <StatsCard title="Misafir Ziyaretçi" value={stats.guestsToday} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-neutral-900 p-5 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                        <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-50">Ödemeler & Promosyonlar</h3>
                        <Link to="/admin/sales-reports" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors duration-200">
                            Raporları gör
                        </Link>
                    </div>
                    <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-md">
                        {recentPromotions.map(promo => (
                            <div key={promo.id} className="p-3.5">
                                <div className="flex justify-between items-start gap-3">
                                    <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{promo.profiles?.full_name || 'Bilinmiyor'}</div>
                                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 tabular-nums whitespace-nowrap">
                                        {promo.price?.toLocaleString('de-DE')} TL
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                            {getPackageName(promo.package_type)}
                                        </span>
                                        {promo.status === 'cancelled' && (
                                            <span className="text-xs text-rose-600 dark:text-rose-400">İptal</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-neutral-400 dark:text-neutral-500">
                                        {new Date(promo.created_at).toLocaleDateString('de-DE')}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {recentPromotions.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-neutral-500 dark:text-neutral-400 text-sm">Henüz ödeme kaydı yok</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 p-5 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                        <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-50">Son İlanlar</h3>
                        <Link to="/admin/listings" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors duration-200">Tümünü incele</Link>
                    </div>
                    <div className="overflow-hidden border border-neutral-200 dark:border-neutral-800 rounded-md">
                        <table className="w-full text-left">
                            <thead className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                                <tr>
                                    <th className="px-4 py-2.5 font-medium">İlan detayı</th>
                                    <th className="px-4 py-2.5 font-medium text-right">Tarih</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {recentListings.map(listing => (
                                    <tr key={listing.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-200">
                                        <td className="px-4 py-3">
                                            <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate max-w-[220px]">{listing.title}</div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    #{generateListingNumber(listing)}
                                                </span>
                                                <span className="text-xs text-neutral-400 dark:text-neutral-500 truncate max-w-[120px]">
                                                    {listing.profiles?.full_name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-neutral-500 dark:text-neutral-400 text-right tabular-nums">
                                            {new Date(listing.created_at).toLocaleDateString('de-DE')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatsCard = ({ title, value, live }) => (
    <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 h-full">
        <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{title}</p>
            {live && <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" aria-hidden="true" />}
        </div>
        <p className="text-xl font-medium text-neutral-900 dark:text-neutral-50 tabular-nums tracking-tight">{value}</p>
    </div>
);

export default AdminDashboard;
