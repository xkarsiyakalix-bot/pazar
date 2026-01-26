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
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatsCard
                    title="Toplam Kullanıcı"
                    value={stats.totalUsers}
                    icon="👥"
                    color="bg-purple-500"
                />
                <StatsCard
                    title="Toplam İlan"
                    value={stats.totalListings}
                    icon="📝"
                    color="bg-blue-500"
                />
                <StatsCard
                    title="Aktif İlanlar"
                    value={stats.activeListings}
                    icon="✅"
                    color="bg-green-500"
                />
                <Link to="/admin/sales-reports" className="block">
                    <StatsCard
                        title="Toplam Gelir"
                        value={`${totalRevenue.toLocaleString('tr-TR')} ₺`}
                        icon="💰"
                        color="bg-yellow-500"
                    />
                </Link>
                <StatsCard
                    title="Çevrimiçi Satıcılar"
                    value={stats.onlineUsers}
                    icon="🟢"
                    color="bg-emerald-500"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Payments Section (Left) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Ödemeler & Promosyonlar</h3>
                        <Link to="/admin/sales-reports" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                            Raporları Gör 📊
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentPromotions.map(promo => (
                            <div key={promo.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-bold text-gray-900">{promo.profiles?.full_name || 'Bilinmiyor'}</div>
                                    <div className="text-red-600 font-bold">{promo.price?.toLocaleString('de-DE')} ₺</div>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded border uppercase font-bold ${promo.status === 'cancelled'
                                            ? 'bg-red-50 text-red-500 border-red-100'
                                            : 'bg-white text-gray-500 border-gray-200'
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
                                            <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter italic">İPTAL</span>
                                        )}
                                    </div>
                                    <span className="text-gray-400">
                                        {new Date(promo.created_at).toLocaleDateString('de-DE')}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {recentPromotions.length === 0 && (
                            <div className="text-center py-8 text-gray-400 italic text-sm">
                                Kayıtlı ödeme yok
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Listings (Middle) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">En Yeni İlanlar</h3>
                        <a href="/admin/listings" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Tümünü göster</a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Başlık</th>
                                    <th className="px-4 py-3 text-right rounded-r-lg">Tarih</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentListings.map(listing => (
                                    <tr key={listing.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-900 truncate max-w-[200px]">{listing.title}</div>
                                            <div className="text-[10px] text-gray-400 font-mono">Nr: {generateListingNumber(listing)}</div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-500 text-right">
                                            {new Date(listing.created_at).toLocaleDateString('de-DE')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions (Right) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Hızlı Erişim</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/admin/promotions" className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 text-left transition-colors">
                            <span className="block text-2xl mb-2">🚀</span>
                            <span className="font-semibold text-gray-900">Öne Çıkar</span>
                        </Link>
                        <Link to="/admin/users" className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 text-left transition-colors">
                            <span className="block text-2xl mb-2">🚫</span>
                            <span className="font-semibold text-gray-900">Engelle</span>
                        </Link>
                        <Link to="/admin/settings" className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 text-left transition-colors">
                            <span className="block text-2xl mb-2">⚙️</span>
                            <span className="font-semibold text-gray-900">Sistem</span>
                        </Link>
                        <button className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 text-left transition-colors">
                            <span className="block text-2xl mb-2">✉️</span>
                            <span className="font-semibold text-gray-900">Bülten</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatsCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl text-white mr-4 shadow-sm ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">{title}</p>
            <p className="text-2xl font-black text-gray-900">{value}</p>
        </div>
    </div>
);

export default AdminDashboard;
