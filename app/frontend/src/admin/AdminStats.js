import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';

const AdminStats = () => {
    const [stats, setStats] = useState({
        totalListings: 0,
        activeListings: 0,
        totalUsers: 0,
        onlineUsers: 0,
        daily: { registrations: 0, guests: 0, users: 0, sales: 0, revenue: 0 },
        monthly: { registrations: 0, guests: 0, users: 0, sales: 0, revenue: 0 },
        yearly: { registrations: 0, guests: 0, users: 0, sales: 0, revenue: 0 }
    });
    const [charts, setCharts] = useState({
        revenueTrend: [],
        listingTrend: []
    });
    const [loading, setLoading] = useState(true);
    const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);
    const [realtimeOnlineCount, setRealtimeOnlineCount] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const refreshTimerRef = useRef(null);

    const loadDashboardData = async (silent = false) => {
        try {
            if (!silent && !hasLoadedInitialData) {
                setLoading(true);
            } else if (silent) {
                setIsRefreshing(true);
            }

            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();

            // Last 7 days for charts
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

            const [
                listingsResult,
                usersResult,
                dailyProfilesResult,
                monthlyProfilesResult,
                yearlyProfilesResult,
                dailyPromosResult,
                monthlyPromosResult,
                yearlyPromosResult,
                dailyVisitsResult,
                monthlyVisitsResult,
                yearlyVisitsResult,
                trendPromosResult,
                trendListingsResult
            ] = await Promise.all([
                supabase.from('listings')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'active')
                    .or(`expiry_date.gt.${now.toISOString()},expiry_date.is.null`),
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('profiles').select('id').gte('created_at', startOfDay),
                supabase.from('profiles').select('id').gte('created_at', startOfMonth),
                supabase.from('profiles').select('id').gte('created_at', startOfYear),
                supabase.from('promotions').select('price, status').gte('created_at', startOfDay),
                supabase.from('promotions').select('price, status').gte('created_at', startOfMonth),
                supabase.from('promotions').select('price, status').gte('created_at', startOfYear),
                supabase.from('page_visits').select('user_id, session_id').gte('created_at', startOfDay),
                supabase.from('page_visits').select('user_id, session_id').gte('created_at', startOfMonth),
                supabase.from('page_visits').select('user_id, session_id').gte('created_at', startOfYear),
                supabase.from('promotions').select('price, created_at, status').gte('created_at', sevenDaysAgo),
                supabase.from('listings').select('created_at').gte('created_at', sevenDaysAgo)
            ]);

            const activeListingsCount = listingsResult.count || 0;
            const usersCount = usersResult.count || 0;
            const dailyProfiles = dailyProfilesResult.data;
            const monthlyProfiles = monthlyProfilesResult.data;
            const yearlyProfiles = yearlyProfilesResult.data;
            const dailyPromos = dailyPromosResult.data;
            const monthlyPromos = monthlyPromosResult.data;
            const yearlyPromos = yearlyPromosResult.data;
            const dailyVisits = dailyVisitsResult.data;
            const monthlyVisits = monthlyVisitsResult.data;
            const yearlyVisits = yearlyVisitsResult.data;
            const trendPromos = trendPromosResult.data;
            const trendListings = trendListingsResult.data;

            // Calculate trends for charts
            const formatTrendData = (data, dateKey, valueKey = null) => {
                const groups = {};
                // Pre-fill last 7 days
                for (let i = 6; i >= 0; i--) {
                    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                    const label = d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
                    groups[label] = 0;
                }

                data?.forEach(item => {
                    const label = new Date(item[dateKey]).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
                    if (groups[label] !== undefined) {
                        if (valueKey) {
                            if (item.status === 'active' || item.status === 'paid') {
                                groups[label] += parseFloat(item[valueKey]) || 0;
                            }
                        } else {
                            groups[label] += 1;
                        }
                    }
                });

                return Object.entries(groups).map(([name, value]) => ({ name, value }));
            };

            setCharts({
                revenueTrend: formatTrendData(trendPromos, 'created_at', 'price'),
                listingTrend: formatTrendData(trendListings, 'created_at')
            });

            const calculatePeriodStats = (profiles, promos, visits) => {
                const regs = profiles?.length || 0;
                const paidPromos = promos?.filter(p => p.status === 'active' || p.status === 'paid' || p.status === 'expired') || [];
                const salesCount = paidPromos.length;
                const revenue = paidPromos.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0);

                const uniqueSessions = new Set(visits?.map(v => v.session_id) || []);
                const loggedInUsers = new Set(visits?.filter(v => v.user_id).map(v => v.user_id) || []);
                const guestsCount = new Set(visits?.filter(v => !v.user_id).map(v => v.session_id) || []).size;

                return {
                    registrations: regs,
                    guests: guestsCount,
                    users: loggedInUsers.size,
                    sales: salesCount,
                    revenue: revenue
                };
            };

            setStats({
                totalListings: activeListingsCount,
                activeListings: activeListingsCount,
                totalUsers: usersCount,
                onlineUsers: realtimeOnlineCount,
                daily: calculatePeriodStats(dailyProfiles, dailyPromos, dailyVisits),
                monthly: calculatePeriodStats(monthlyProfiles, monthlyPromos, monthlyVisits),
                yearly: calculatePeriodStats(yearlyProfiles, yearlyPromos, yearlyVisits)
            });

            setHasLoadedInitialData(true);
        } catch (error) {
            console.error('Error loading admin stats:', error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const debouncedRefresh = () => {
        if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = setTimeout(() => {
            loadDashboardData(true);
        }, 2000);
    };

    useEffect(() => {
        loadDashboardData();
        const pollInterval = setInterval(() => loadDashboardData(true), 60000);

        const presenceChannel = supabase.channel('site-presence');
        const updateOnlineCount = () => {
            const state = presenceChannel.presenceState();
            if (!state) return;
            setRealtimeOnlineCount(Object.keys(state).length);
        };

        presenceChannel
            .on('presence', { event: 'sync' }, updateOnlineCount)
            .on('presence', { event: 'join' }, updateOnlineCount)
            .on('presence', { event: 'leave' }, updateOnlineCount)
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') updateOnlineCount();
            });

        return () => {
            if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
            clearInterval(pollInterval);
            presenceChannel.unsubscribe();
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
        <div className="space-y-10 animate-fade-in pb-10">
            <div className="flex justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">İş Analitiği</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">Görsel performans takibi ve büyüme metrikleri</p>
                </div>
                <button
                    onClick={() => loadDashboardData(true)}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/5 rounded-xl text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-red-600 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                    <span className={isRefreshing ? 'animate-spin' : ''}>🔄</span>
                    {isRefreshing ? 'Yenileniyor...' : 'Verileri Yenile'}
                </button>
            </div>

            {/* Main Stats Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatsCard title="Toplam Üye" value={stats.totalUsers} icon="👥" gradient="from-indigo-500 to-purple-600" />
                <StatsCard title="Aktif İlanlar" value={stats.activeListings} icon="✅" gradient="from-emerald-400 to-teal-600" />
                <StatsCard title="Toplam İlan" value={stats.totalListings} icon="📦" gradient="from-blue-500 to-blue-700" />
                <StatsCard title="Aylık Kazanç" value={`${stats.monthly.revenue.toLocaleString('tr-TR')} TL`} icon="💎" gradient="from-amber-400 to-orange-500" />
                <StatsCard title="Çevrimiçi" value={realtimeOnlineCount} icon="⚡" gradient="from-rose-500 to-pink-600" />
            </div>

            {/* Period Summaries */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <PeriodStatsCol title="Bugün" data={stats.daily} color="blue" />
                <PeriodStatsCol title="Bu Ay" data={stats.monthly} color="purple" />
                <PeriodStatsCol title="Bu Yıl" data={stats.yearly} color="emerald" />
            </div>

            {/* Visual Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Trend Chart */}
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl shadow-sm border border-neutral-100 dark:border-white/5">
                    <div className="mb-6">
                        <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">Satış Trendi (7 Gün)</h3>
                        <p className="text-xs text-neutral-400 mt-1 uppercase font-bold tracking-widest">Günlük Kazanç Performansı</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={charts.revenueTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className="dark:opacity-5" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} tickFormatter={(val) => `${val}₺`} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc', opacity: 0.1 }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white dark:bg-neutral-800 p-3 rounded-xl shadow-xl border border-neutral-100 dark:border-white/5">
                                                    <p className="text-[10px] font-bold text-neutral-400 mb-1">{payload[0].payload.name}</p>
                                                    <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">{payload[0].value.toLocaleString('tr-TR')} TL</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    {charts.revenueTrend.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 6 ? '#4f46e5' : '#e2e8f0'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Listing Activity Chart */}
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl shadow-sm border border-neutral-100 dark:border-white/5">
                    <div className="mb-6">
                        <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">İlan Aktivitesi (7 Gün)</h3>
                        <p className="text-xs text-neutral-400 mt-1 uppercase font-bold tracking-widest">Yeni Eklenen İlan Sayıları</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={charts.listingTrend}>
                                <defs>
                                    <linearGradient id="colorListing" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className="dark:opacity-5" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white dark:bg-neutral-800 p-3 rounded-xl shadow-xl border border-neutral-100 dark:border-white/5">
                                                    <p className="text-[10px] font-bold text-neutral-400 mb-1">{payload[0].payload.name}</p>
                                                    <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">{payload[0].value} Yeni İlan</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorListing)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PeriodStatsCol = ({ title, data, color }) => {
    const colorMap = {
        blue: { text: 'text-blue-600', dot: 'bg-blue-600' },
        purple: { text: 'text-purple-600', dot: 'bg-purple-600' },
        emerald: { text: 'text-emerald-600', dot: 'bg-emerald-600' }
    };
    const c = colorMap[color];

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-100 dark:border-white/5 shadow-sm">
            <h4 className={`text-xs font-black uppercase tracking-widest ${c.text} mb-6 flex items-center gap-2`}>
                <span className={`w-2 h-2 rounded-full ${c.dot}`}></span>{title}
            </h4>
            <div className="space-y-4">
                <MiniStat label="Yeni Üye" value={data.registrations} />
                <MiniStat label="Misafir Trafiği" value={data.guests} />
                <MiniStat label="Üye Girişi" value={data.users} />
                <div className="pt-2 border-t border-neutral-50 dark:border-white/5">
                    <MiniStat label="Promosyon Satışı" value={data.sales} />
                    <MiniStat label="Dönemlik Kazanç" value={`${data.revenue.toLocaleString('tr-TR')} TL`} isHighlight={true} />
                </div>
            </div>
        </div>
    );
};

const MiniStat = ({ label, value, isHighlight }) => (
    <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-tight">{label}</span>
        <span className={`font-display font-black tracking-tight ${isHighlight ? 'text-lg text-emerald-600 dark:text-emerald-400' : 'text-neutral-900 dark:text-white'}`}>
            {value}
        </span>
    </div>
);

const StatsCard = ({ title, value, icon, gradient }) => (
    <div className="relative overflow-hidden bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-300">
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-full -mr-4 -mt-4`}></div>
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg bg-gradient-to-br ${gradient} text-white`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">{title}</p>
                <p className="text-2xl font-display font-black text-neutral-900 dark:text-white tracking-tight">{value}</p>
            </div>
        </div>
    </div>
);

export default AdminStats;

