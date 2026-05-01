import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchListings } from '../api/listings';
import { supabase } from '../lib/supabase';
import { generateListingNumber } from '../components';
import LoadingSpinner from '../components/LoadingSpinner';
import { getVisitStats } from '../api/analytics';

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
        <div className="space-y-8 animate-fade-in relative">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatsCard
                    title="Toplam Üye"
                    value={stats.totalUsers}
                    icon="👥"
                    gradient="from-purple-500 to-indigo-600"
                    iconColor="text-white"
                />
                <StatsCard
                    title="Aktif İlanlar"
                    value={stats.activeListings}
                    icon="✅"
                    gradient="from-emerald-400 to-green-600"
                    iconColor="text-white"
                />
                <StatsCard
                    title="Toplam İlan"
                    value={stats.totalListings}
                    icon="📊"
                    gradient="from-blue-500 to-blue-700"
                    iconColor="text-white"
                />
                <StatsCard
                    title="Bugünkü İlanlar"
                    value={stats.newListingsToday}
                    icon="📝"
                    gradient="from-cyan-400 to-cyan-600"
                    iconColor="text-white"
                />
                <Link to="/admin/sales-reports" className="block transform transition-transform hover:scale-[1.02]">
                    <StatsCard
                        title="Toplam Gelir"
                        value={`${totalRevenue.toLocaleString('tr-TR')} TL`}
                        icon="💰"
                        gradient="from-amber-400 to-orange-500"
                        iconColor="text-white"
                        isPremium={true}
                    />
                </Link>
                <StatsCard
                    title="Çevrimiçi"
                    value={stats.onlineUsers}
                    icon="🟢"
                    gradient="from-teal-400 to-emerald-500"
                    iconColor="text-white"
                />
            </div>

            {/* Daily Traffic Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Günlük Toplam Ziyaretçi"
                    value={stats.totalVisitorsToday}
                    icon="📊"
                    gradient="from-blue-600 to-blue-800"
                    iconColor="text-white"
                />
                <StatsCard
                    title="Kayıtlı Kullanıcı Girişi"
                    value={stats.loggedInUsersToday}
                    icon="👤"
                    gradient="from-indigo-500 to-purple-600"
                    iconColor="text-white"
                />
                <StatsCard
                    title="Misafir Ziyaretçi"
                    value={stats.guestsToday}
                    icon="👻"
                    gradient="from-slate-400 to-slate-600"
                    iconColor="text-white"
                />
            </div>



            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Payments Section (Left) */}
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-neutral-100 dark:border-white/5 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">Ödemeler & Promosyonlar</h3>
                        <Link to="/admin/sales-reports" className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center gap-1">
                            Raporları Gör 📊
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentPromotions.map(promo => (
                            <div key={promo.id} className="group p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-sm transition-all duration-200">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="font-bold text-neutral-800 dark:text-neutral-200">{promo.profiles?.full_name || 'Bilinmiyor'}</div>
                                    <div className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">
                                        {promo.price?.toLocaleString('de-DE')} TL
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${promo.status === 'cancelled'
                                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 ring-1 ring-red-100 dark:ring-red-900/30'
                                            : 'bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 ring-1 ring-neutral-200 dark:ring-white/5'
                                            }`}>
                                            {promo.package_type === 'highlight' ? 'Öne Çıkarılan' :
                                                ['galerie', 'gallery', 'galeri', 'vitrin'].includes(promo.package_type?.toLowerCase()) ? 'Vitrin' :
                                                    promo.package_type === 'top' ? 'Top' :
                                                        promo.package_type === 'budget' ? 'Budget' :
                                                            promo.package_type === 'premium' ? 'Premium' :
                                                                promo.package_type === 'plus' ? 'Plus' :
                                                                    promo.package_type}
                                        </span>
                                        {promo.status === 'cancelled' && (
                                            <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter">İPTAL</span>
                                        )}
                                    </div>
                                    <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
                                        {new Date(promo.created_at).toLocaleDateString('de-DE')}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {recentPromotions.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-2xl opacity-30">💰</span>
                                </div>
                                <p className="text-neutral-400 dark:text-neutral-500 font-medium text-sm">Henüz ödeme kaydı yok</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Listings (Middle) */}
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-neutral-100 dark:border-white/5 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">Son İlanlar</h3>
                        <a href="/admin/listings" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-500 font-medium transition-colors">Tümünü İncele →</a>
                    </div>
                    <div className="overflow-hidden bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-white/5">
                        <table className="w-full text-left">
                            <thead className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 bg-neutral-50/50 dark:bg-neutral-950/50">
                                <tr>
                                    <th className="px-4 py-3 tracking-wider">İlan Detayı</th>
                                    <th className="px-4 py-3 text-right tracking-wider">Tarih</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50 dark:divide-white/5">
                                {recentListings.map(listing => (
                                    <tr key={listing.id} className="group hover:bg-neutral-50/80 dark:hover:bg-neutral-700/50 transition-colors cursor-default">
                                        <td className="px-4 py-3.5">
                                            <div className="font-bold text-neutral-800 dark:text-neutral-200 truncate max-w-[180px] group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">{listing.title}</div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400">
                                                    #{generateListingNumber(listing)}
                                                </span>
                                                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium truncate max-w-[100px]">
                                                    {listing.profiles?.full_name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 text-right tabular-nums">
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

const QuickActionCard = ({ to, icon, title, color, description }) => {
    const colorClasses = {
        blue: 'from-blue-50 to-white border-blue-100 text-blue-600 hover:border-blue-300 group-hover:from-blue-600 group-hover:to-blue-700',
        amber: 'from-amber-50 to-white border-amber-100 text-amber-600 hover:border-amber-300 group-hover:from-amber-600 group-hover:to-amber-700',
        indigo: 'from-indigo-50 to-white border-indigo-100 text-indigo-600 hover:border-indigo-300 group-hover:from-indigo-600 group-hover:to-indigo-700',
        emerald: 'from-emerald-50 to-white border-emerald-100 text-emerald-600 hover:border-emerald-300 group-hover:from-emerald-600 group-hover:to-emerald-700',
        purple: 'from-purple-50 to-white border-purple-100 text-purple-600 hover:border-purple-300 group-hover:from-purple-600 group-hover:to-purple-700',
        rose: 'from-rose-50 to-white border-rose-100 text-rose-600 hover:border-rose-300 group-hover:from-rose-600 group-hover:to-rose-700',
        cyan: 'from-cyan-50 to-white border-cyan-100 text-cyan-600 hover:border-cyan-300 group-hover:from-cyan-600 group-hover:to-cyan-700',
        orange: 'from-orange-50 to-white border-orange-100 text-orange-600 hover:border-orange-300 group-hover:from-orange-600 group-hover:to-orange-700',
        slate: 'from-slate-50 to-white border-slate-100 text-slate-600 hover:border-slate-300 group-hover:from-slate-600 group-hover:to-slate-700',
        neutral: 'from-neutral-50 to-white border-neutral-100 text-neutral-600 hover:border-neutral-300 group-hover:from-neutral-600 group-hover:to-neutral-700',
    };

    const iconBgClasses = {
        blue: 'bg-blue-100/50 text-blue-600 group-hover:bg-white group-hover:text-blue-600',
        amber: 'bg-amber-100/50 text-amber-600 group-hover:bg-white group-hover:text-amber-600',
        indigo: 'bg-indigo-100/50 text-indigo-600 group-hover:bg-white group-hover:text-indigo-600',
        emerald: 'bg-emerald-100/50 text-emerald-600 group-hover:bg-white group-hover:text-emerald-600',
        purple: 'bg-purple-100/50 text-purple-600 group-hover:bg-white group-hover:text-purple-600',
        rose: 'bg-rose-100/50 text-rose-600 group-hover:bg-white group-hover:text-rose-600',
        cyan: 'bg-cyan-100/50 text-cyan-600 group-hover:bg-white group-hover:text-cyan-600',
        orange: 'bg-orange-100/50 text-orange-600 group-hover:bg-white group-hover:text-orange-600',
        slate: 'bg-slate-100/50 text-slate-600 group-hover:bg-white group-hover:text-slate-600',
        neutral: 'bg-neutral-100/50 text-neutral-600 group-hover:bg-white group-hover:text-neutral-600',
    };

    const baseClasses = colorClasses[color];

    return (
        <Link
            to={to}
            className={`flex flex-col p-5 bg-gradient-to-br ${baseClasses} dark:from-neutral-900 dark:to-neutral-900 rounded-3xl border dark:border-white/5 transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden`}
        >
            <div className={`w-12 h-12 ${iconBgClasses[color]} dark:bg-neutral-800/50 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:rotate-6`}>
                {icon}
            </div>
            <div className="relative z-10 transition-colors duration-300 group-hover:text-white">
                <span className="font-black text-neutral-900 dark:text-neutral-50 group-hover:text-white transition-colors duration-300 block mb-0.5 tracking-tight group-hover:scale-[1.02] origin-left">
                    {title}
                </span>
                <span className="text-[10px] uppercase font-black tracking-widest opacity-40 dark:opacity-60 group-hover:opacity-100 group-hover:text-white/80 transition-all duration-300">
                    {description}
                </span>
            </div>

            {/* Subtle background ornament */}
            <div className={`absolute -bottom-4 -right-4 w-20 h-20 bg-current opacity-[0.03] dark:opacity-[0.05] rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
        </Link>
    );
};

const StatsCard = ({ title, value, icon, gradient, iconColor, isPremium }) => (
    <div className={`
        relative overflow-hidden bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-white/5 
        hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group
        ${isPremium ? 'ring-2 ring-amber-100 dark:ring-amber-900/20 hover:ring-amber-300 dark:hover:ring-amber-900/40' : ''}
    `}>
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 dark:opacity-20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>

        <div className="relative flex items-center">
            <div className={`
                w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg mr-4
                bg-gradient-to-br ${gradient} ${iconColor} transform group-hover:rotate-3 transition-transform
            `}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">{title}</p>
                <p className="text-2xl sm:text-3xl font-display font-black text-neutral-900 dark:text-neutral-50 tracking-tight">{value}</p>
            </div>
        </div>
    </div>
);

export default AdminDashboard;
