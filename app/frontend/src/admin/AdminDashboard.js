import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchListings } from '../api/listings';
import { supabase } from '../lib/supabase';
import { generateListingNumber } from '../components';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalListings: 0,
        activeListings: 0,
        totalUsers: 0,
        onlineUsers: 0,
        newUsersToday: 0,
        newListingsToday: 0
    });
    const [recentListings, setRecentListings] = useState([]);
    const [recentPromotions, setRecentPromotions] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);
    const [realtimeOnlineCount, setRealtimeOnlineCount] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const refreshTimerRef = useRef(null);

    const loadDashboardData = async (silent = false) => {
        try {
            // Only set loading on initial load if we haven't successfully loaded data yet
            if (!silent && !hasLoadedInitialData) {
                setLoading(true);
            } else if (silent) {
                setIsRefreshing(true);
            }

            // Execute fetches in parallel for better performance
            const [
                { count: listingsCount },
                { count: activeCount },
                { count: usersCount },
                { count: newUsersCount },
                { count: newListingsCount },
                { data: listings, error: listingsError },
                { data: allPromotions, error: allPromotionsError },
                { data: promotions, error: promotionsError }
            ] = await Promise.all([
                supabase.from('listings').select('*', { count: 'exact', head: true }),
                supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
                supabase.from('listings').select('*', { count: 'exact', head: true }).gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
                supabase.from('listings').select('*').order('created_at', { ascending: false }).limit(5),
                supabase.from('promotions').select('price, status'),
                supabase.from('promotions').select(`
                    *,
                    listings (title, listing_number),
                    profiles (full_name, user_number)
                `).order('created_at', { ascending: false }).limit(5)
            ]);

            // We no longer rely on profiles 'last_seen' for total online count
            // but we fetch it as a secondary stat if needed

            if (listingsError) throw listingsError;

            // Update stats
            setStats({
                totalListings: listingsCount || 0,
                activeListings: activeCount || 0,
                totalUsers: usersCount || 0,
                onlineUsers: realtimeOnlineCount, // This will be updated by the presence effect
                newUsersToday: newUsersCount || 0,
                newListingsToday: newListingsCount || 0
            });

            // Calculate Revenue
            if (!allPromotionsError && allPromotions) {
                const total = allPromotions
                    .filter(p => p.status === 'active' || p.status === 'paid')
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

        // 1. Polling Fallback (every 2 minutes for baseline stats)
        const intervalId = setInterval(() => {
            debouncedRefresh();
        }, 120000);

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

        // 3. Presence Subscription for Real-time Online Count (Whole Site)
        const presenceChannel = supabase.channel('site-presence');

        const updateOnlineCount = () => {
            const state = presenceChannel.presenceState();
            // Filter out different sessions from same user to count unique users but also count guests
            const count = Object.keys(state).length;
            setRealtimeOnlineCount(count);
        };

        presenceChannel
            .on('presence', { event: 'sync' }, updateOnlineCount)
            .on('presence', { event: 'join' }, updateOnlineCount)
            .on('presence', { event: 'leave' }, updateOnlineCount)
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    // Initial sync after subscription
                    updateOnlineCount();
                }
            });

        return () => {
            if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
            clearInterval(intervalId);
            listingsSubscription.unsubscribe();
            profilesSubscription.unsubscribe();
            promotionsSubscription.unsubscribe();
            presenceChannel.unsubscribe();
        };
    }, []);

    // Sync stats.onlineUsers with realtimeOnlineCount - use a more stable update
    useEffect(() => {
        setStats(prev => {
            if (prev.onlineUsers === realtimeOnlineCount) return prev;
            return { ...prev, onlineUsers: realtimeOnlineCount };
        });
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
            {isRefreshing && (
                <div className="absolute -top-6 right-0 flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full animate-pulse z-10">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    VERİLER GÜNCELLENİYOR
                </div>
            )}
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatsCard
                    title="Toplam Kullanıcı"
                    value={stats.totalUsers}
                    icon="👥"
                    gradient="from-purple-500 to-indigo-600"
                    iconColor="text-white"
                />
                <StatsCard
                    title="Toplam İlan"
                    value={stats.totalListings}
                    icon="📝"
                    gradient="from-blue-500 to-cyan-500"
                    iconColor="text-white"
                />
                <StatsCard
                    title="Aktif İlanlar"
                    value={stats.activeListings}
                    icon="✅"
                    gradient="from-emerald-400 to-green-600"
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

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Payments Section (Left) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-display font-bold text-neutral-900 tracking-tight">Ödemeler & Promosyonlar</h3>
                        <Link to="/admin/sales-reports" className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1">
                            Raporları Gör 📊
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentPromotions.map(promo => (
                            <div key={promo.id} className="group p-4 bg-white rounded-xl border border-neutral-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="font-bold text-neutral-800">{promo.profiles?.full_name || 'Bilinmiyor'}</div>
                                    <div className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">
                                        {promo.price?.toLocaleString('de-DE')} TL
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${promo.status === 'cancelled'
                                            ? 'bg-red-50 text-red-600 ring-1 ring-red-100'
                                            : 'bg-neutral-50 text-neutral-600 ring-1 ring-neutral-200'
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
                                    <span className="text-xs font-medium text-neutral-400">
                                        {new Date(promo.created_at).toLocaleDateString('de-DE')}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {recentPromotions.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-2xl opacity-30">💰</span>
                                </div>
                                <p className="text-neutral-400 font-medium text-sm">Henüz ödeme kaydı yok</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Listings (Middle) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-display font-bold text-neutral-900 tracking-tight">Son İlanlar</h3>
                        <a href="/admin/listings" className="text-sm text-neutral-500 hover:text-red-600 font-medium transition-colors">Tümünü İncele →</a>
                    </div>
                    <div className="overflow-hidden bg-white rounded-xl border border-neutral-100">
                        <table className="w-full text-left">
                            <thead className="text-[10px] uppercase font-bold text-neutral-400 bg-neutral-50/50">
                                <tr>
                                    <th className="px-4 py-3 tracking-wider">İlan Detayı</th>
                                    <th className="px-4 py-3 text-right tracking-wider">Tarih</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {recentListings.map(listing => (
                                    <tr key={listing.id} className="group hover:bg-neutral-50/80 transition-colors cursor-default">
                                        <td className="px-4 py-3.5">
                                            <div className="font-bold text-neutral-800 truncate max-w-[180px] group-hover:text-red-600 transition-colors">{listing.title}</div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-neutral-100 text-neutral-500">
                                                    #{generateListingNumber(listing)}
                                                </span>
                                                <span className="text-[10px] text-neutral-400 font-medium truncate max-w-[100px]">
                                                    {listing.profiles?.full_name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-xs font-medium text-neutral-500 text-right tabular-nums">
                                            {new Date(listing.created_at).toLocaleDateString('de-DE')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions (Right) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-xl font-display font-bold text-neutral-900 mb-6 tracking-tight">Hızlı İşlemler</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/admin/promotions" className="group p-5 bg-gradient-to-br from-neutral-50 to-white rounded-2xl border border-neutral-100 hover:border-purple-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">🚀</div>
                            <span className="font-bold text-neutral-900 group-hover:text-purple-700 transition-colors">Promosyonlar</span>
                        </Link>
                        <Link to="/admin/users" className="group p-5 bg-gradient-to-br from-neutral-50 to-white rounded-2xl border border-neutral-100 hover:border-red-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">🚫</div>
                            <span className="font-bold text-neutral-900 group-hover:text-red-700 transition-colors">Kullanıcılar</span>
                        </Link>
                        <Link to="/admin/settings" className="group p-5 bg-gradient-to-br from-neutral-50 to-white rounded-2xl border border-neutral-100 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">⚙️</div>
                            <span className="font-bold text-neutral-900 group-hover:text-blue-700 transition-colors">Sistem</span>
                        </Link>
                        <button className="group p-5 bg-gradient-to-br from-neutral-50 to-white rounded-2xl border border-neutral-100 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left">
                            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">✉️</div>
                            <span className="font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors">Bülten</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatsCard = ({ title, value, icon, gradient, iconColor, isPremium }) => (
    <div className={`
        relative overflow-hidden bg-white p-6 rounded-2xl border border-neutral-100 
        hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group
        ${isPremium ? 'ring-2 ring-amber-100 hover:ring-amber-300' : ''}
    `}>
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>

        <div className="relative flex items-center">
            <div className={`
                w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg mr-4
                bg-gradient-to-br ${gradient} ${iconColor} transform group-hover:rotate-3 transition-transform
            `}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">{title}</p>
                <p className="text-2xl sm:text-3xl font-display font-black text-neutral-900 tracking-tight">{value}</p>
            </div>
        </div>
    </div>
);

export default AdminDashboard;
