import React, { useState, useEffect } from 'react';
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

    const loadDashboardData = async () => {
        try {
            // Only set loading on initial load
            if (stats.totalListings === 0) setLoading(true);

            // Fetch listings stats
            const { count: listingsCount } = await supabase
                .from('listings')
                .select('*', { count: 'exact', head: true });

            const { count: activeCount } = await supabase
                .from('listings')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'active');

            // Fetch users stats
            const { count: usersCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            // Fetch online users (active in last 15 minutes)
            // Note: profiles must have 'last_seen' column updated regularly
            const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
            const { count: onlineCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .gte('last_seen', fifteenMinsAgo);

            // New users today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const { count: newUsersCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', today.toISOString());

            // New listings today
            const { count: newListingsCount } = await supabase
                .from('listings')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', today.toISOString());

            setStats({
                totalListings: listingsCount || 0,
                activeListings: activeCount || 0,
                totalUsers: usersCount || 0,
                onlineUsers: onlineCount || 0,
                newUsersToday: newUsersCount || 0,
                newListingsToday: newListingsCount || 0
            });

            // Fetch recent listings
            const { data: listings, error: listingsError } = await supabase
                .from('listings')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (listingsError) throw listingsError;

            // Fetch all promotions for accurate revenue calculation (filtering by status)
            const { data: allPromotions, error: allPromotionsError } = await supabase
                .from('promotions')
                .select('price, status');

            if (!allPromotionsError && allPromotions) {
                const total = allPromotions
                    .filter(p => p.status === 'active' || p.status === 'paid')
                    .reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0);
                setTotalRevenue(total);
            }

            // Fetch recent promotions for display
            const { data: promotions, error: promotionsError } = await supabase
                .from('promotions')
                .select(`
                    *,
                    listings (title, listing_number),
                    profiles (full_name, user_number)
                `)
                .order('created_at', { ascending: false })
                .limit(5);

            if (promotionsError) {
                console.warn('Promotions error:', promotionsError);
            } else {
                setRecentPromotions(promotions || []);
            }

            // Manually fetch profiles for these listings
            let listingsWithProfiles = [];
            if (listings && listings.length > 0) {
                const userIds = [...new Set(listings.map(l => l.user_id))];
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('id, full_name, user_number')
                    .in('id', userIds);

                listingsWithProfiles = listings.map(listing => ({
                    ...listing,
                    profiles: profiles?.find(p => p.id === listing.user_id) || { full_name: 'Bilinmiyor' }
                }));
            }

            setRecentListings(listingsWithProfiles);

        } catch (error) {
            console.error('Error loading admin stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();

        // 1. Polling Fallback to 60 seconds
        const intervalId = setInterval(() => {
            console.log('Auto-refreshing dashboard...');
            loadDashboardData();
        }, 60000);

        // 2. Real-time subscriptions (Instant updates)
        const listingsSubscription = supabase
            .channel('admin_listings_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, () => {
                loadDashboardData();
            })
            .subscribe();

        const profilesSubscription = supabase
            .channel('admin_profiles_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
                loadDashboardData();
            })
            .subscribe();

        const promotionsSubscription = supabase
            .channel('admin_promotions_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'promotions' }, () => {
                console.log('Promotions changed, reloading dashboard...');
                loadDashboardData();
            })
            .subscribe();

        return () => {
            clearInterval(intervalId);
            listingsSubscription.unsubscribe();
            profilesSubscription.unsubscribe();
            promotionsSubscription.unsubscribe();
        };
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
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
                        value={`${totalRevenue.toLocaleString('tr-TR')} ₺`}
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
                                        {promo.price?.toLocaleString('de-DE')} ₺
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
