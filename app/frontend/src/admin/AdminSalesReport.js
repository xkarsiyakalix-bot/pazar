import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminSalesReport = () => {
    const [stats, setStats] = useState({
        daily: 0,
        monthly: 0,
        yearly: 0,
        total: 0
    });
    const [packageStats, setPackageStats] = useState([]);
    const [history, setHistory] = useState({
        daily: [],
        monthly: [],
        yearly: [],
        detailedYearly: {}, // { '2025': { '01': 100, '02': 150 ... } }
        minute: []
    });
    const [recentSales, setRecentSales] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const hasLoadedOnce = useRef(false);
    const playedPromos = useRef(new Set());
    const audioRef = useRef(new Audio('/cha-ching.mp3'));

    const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

    const playNotification = () => {
        console.log('Attempting to play cha-ching sound...');
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => {
            console.warn('Audio play failed (maybe autoplay block):', e);
        });
    };

    const calculateReport = async (isManual = false) => {
        try {
            if (isManual) setIsRefreshing(true);

            // ONLY set loading to true if we've NEVER loaded before
            if (!hasLoadedOnce.current) {
                setLoading(true);
            }

            const { data: promotions, error } = await supabase
                .from('promotions')
                .select(`
                    *,
                    listings (title, listing_number),
                    profiles (full_name, user_number)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];
            const thisMonthStr = todayStr.substring(0, 7); // YYYY-MM
            const thisYearStr = todayStr.substring(0, 4); // YYYY

            let dailyRevenue = 0;
            let monthlyRevenue = 0;
            let yearlyRevenue = 0;
            let totalRevenue = 0;

            const dailyGroups = {};
            const monthlyGroups = {};
            const yearlyGroups = {};
            const detailedYearly = {}; // { '2025': { '01': amount, '02': amount } }
            const packageGroups = {};

            // Generate minute-by-minute slots for the last 60 minutes
            const minuteData = [];
            for (let i = 59; i >= 0; i--) {
                const time = new Date(now.getTime() - i * 60000);
                minuteData.push({
                    time: time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                    amount: 0,
                    fullTime: time.getTime()
                });
            }

            promotions.forEach(promo => {
                // Sadece AKTİF veya ÖDENMİŞ promosyonları kazanca dahil et (Aktüel veri için kritik)
                if (promo.status !== 'active' && promo.status !== 'paid') return;

                const price = parseFloat(promo.price) || 0;
                const createdDate = new Date(promo.created_at);
                const dateStr = createdDate.toISOString().split('T')[0];
                const monthStr = dateStr.substring(0, 7);
                const yearStr = dateStr.substring(0, 4);

                totalRevenue += price;

                // Stats - Bugünü 24 saatlik pencere olarak hesapla (Takvim günü yerine)
                const diffMs = now.getTime() - createdDate.getTime();
                const diffHours = diffMs / (1000 * 60 * 60);

                if (diffHours >= 0 && diffHours <= 24) dailyRevenue += price;
                if (monthStr === thisMonthStr) monthlyRevenue += price;
                if (yearStr === thisYearStr) yearlyRevenue += price;

                // History grouping
                dailyGroups[dateStr] = (dailyGroups[dateStr] || 0) + price;
                monthlyGroups[monthStr] = (monthlyGroups[monthStr] || 0) + price;
                yearlyGroups[yearStr] = (yearlyGroups[yearStr] || 0) + price;

                // Package grouping
                const type = promo.package_type || 'Diğer';
                packageGroups[type] = (packageGroups[type] || 0) + price;

                // Detailed yearly-monthly grouping
                const monthOnly = dateStr.substring(5, 7); // MM
                if (!detailedYearly[yearStr]) detailedYearly[yearStr] = {};
                detailedYearly[yearStr][monthOnly] = (detailedYearly[yearStr][monthOnly] || 0) + price;

                // Minute grouping (check if within last 60 mins)
                const diffMin = Math.floor(diffMs / 60000);
                if (diffMin >= 0 && diffMin < 60) {
                    minuteData[59 - diffMin].amount += price;
                }
            });

            setStats({
                daily: dailyRevenue,
                monthly: monthlyRevenue,
                yearly: yearlyRevenue,
                total: totalRevenue
            });

            const formattedPackageStats = Object.entries(packageGroups)
                .map(([name, value]) => ({
                    name: name === 'galerie' ? 'Vitrin' : name === 'z_premium' ? 'Premium' : name === 'highlight' ? 'Öne Çıkarılan' : name,
                    value
                }))
                .sort((a, b) => b.value - a.value);
            setPackageStats(formattedPackageStats);

            // Format history
            const dailyHistory = Object.entries(dailyGroups)
                .map(([date, amount]) => ({ date, amount }))
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 30);

            const monthlyHistory = Object.entries(monthlyGroups)
                .map(([month, amount]) => ({ month, amount }))
                .sort((a, b) => b.month.localeCompare(a.month))
                .slice(0, 12);

            const yearlyHistory = Object.entries(yearlyGroups)
                .map(([year, amount]) => ({ year, amount }))
                .sort((a, b) => b.year.localeCompare(a.year));

            setHistory({
                daily: dailyHistory,
                monthly: monthlyHistory,
                yearly: yearlyHistory,
                detailedYearly: detailedYearly,
                minute: minuteData
            });
            setRecentSales(promotions.filter(p => p.status === 'active' || p.status === 'paid').slice(0, 15));
            setLastUpdated(new Date());

            // Initialize playedPromos on first load to prevent sound for old data
            if (!hasLoadedOnce.current) {
                promotions.forEach(p => {
                    if (p.status === 'active' || p.status === 'paid') {
                        playedPromos.current.add(p.id);
                    }
                });
            }

        } catch (error) {
            console.error('Error calculating reports:', error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
            hasLoadedOnce.current = true;
        }
    };

    useEffect(() => {
        calculateReport();

        // Supabase Real-time Subscription
        const channel = supabase
            .channel('admin_sales_realtime')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'promotions' },
                (payload) => {
                    const newPromo = payload.new;
                    // Play sound if it's a new paid/active promotion we haven't played for yet
                    if (newPromo && (newPromo.status === 'active' || newPromo.status === 'paid')) {
                        if (!playedPromos.current.has(newPromo.id)) {
                            console.log('New sale detected! Playing sound for:', newPromo.id);
                            playNotification();
                            playedPromos.current.add(newPromo.id);
                        }
                    }
                    // Refresh stats
                    calculateReport();
                }
            )
            .subscribe();

        // Periodic refresh every 30 seconds to update charts and "now" relative data
        const refreshInterval = setInterval(() => {
            console.log('Automated periodic refresh...');
            calculateReport();
        }, 30000);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(refreshInterval);
        };
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-neutral-900 tracking-tight">Satış Raporları</h1>
                    <div className="flex items-center gap-3 mt-1.5">
                        <p className="text-neutral-500 font-medium tracking-wide">Gelir Özeti ve Canlı Analiz</p>
                        <span className="flex items-center gap-1.5 text-[10px] bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full font-bold border border-neutral-200">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            {lastUpdated.toLocaleTimeString('tr-TR')}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={playNotification}
                        className="p-3 bg-white border border-neutral-200 text-neutral-500 rounded-xl hover:bg-neutral-50 hover:text-neutral-900 transition-all shadow-sm active:scale-95"
                        title="Ses Testi"
                    >
                        🔊
                    </button>
                    <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-wider bg-white px-3 py-2 rounded-xl border border-neutral-200 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        CANLI AKIŞ
                    </div>
                    <button
                        onClick={() => calculateReport(true)}
                        disabled={isRefreshing}
                        className="px-5 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-bold text-neutral-700 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                        <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-blue-500 animate-spin' : 'bg-blue-500'}`}></div>
                        {isRefreshing ? 'Yenileniyor...' : 'Yenile'}
                    </button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ReportCard
                    title="Bugün Gelir"
                    value={stats.daily}
                    icon="☀️"
                    color="from-orange-500 to-red-500"
                    subtitle="Son 24 saatte"
                />
                <ReportCard
                    title="Bu Ay"
                    value={stats.monthly}
                    icon="📅"
                    color="from-blue-500 to-indigo-600"
                    subtitle={new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                />
                <ReportCard
                    title="Bu Yıl"
                    value={stats.yearly}
                    icon="🏦"
                    color="from-emerald-500 to-teal-600"
                    subtitle={`İş Yılı ${new Date().getFullYear()}`}
                />
                <ReportCard
                    title="Toplam Gelir"
                    value={stats.total}
                    icon="💰"
                    color="from-purple-500 to-pink-600"
                    subtitle="Tüm Zamanlar"
                />
            </div>

            {/* Minute-by-Minute Live Graph and Package Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-neutral-100 relative overflow-hidden">
                    <div className="absolute top-6 right-8">
                        <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold tracking-wider border border-red-100">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                            CANLI
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-display font-bold text-neutral-900 flex items-center gap-2">
                            Kazanç Analizi
                        </h3>
                        <p className="text-neutral-400 font-medium text-xs mt-1">Son 60 Dakika Performansı</p>
                    </div>

                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history.minute}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="time"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                                    interval={9}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                                    tickFormatter={(value) => `${value}₺`}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#ef4444', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: '1px solid #e5e7eb',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        padding: '12px',
                                        backgroundColor: 'white'
                                    }}
                                    formatter={(value) => [`${value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺`, 'Gelir']}
                                    labelStyle={{ fontWeight: 700, color: '#1e293b', marginBottom: '4px', fontSize: '12px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-neutral-100 flex flex-col">
                    <h3 className="text-xl font-display font-bold text-neutral-900 mb-1">Paket Dağılımı</h3>
                    <p className="text-neutral-400 font-medium text-xs mb-6">Gelir Kaynağı Analizi</p>

                    <div className="h-[220px] w-full flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={packageStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={75}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {packageStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`${value.toLocaleString('tr-TR')} ₺`, 'Toplam']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex-1 mt-4 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                        {packageStats.map((pkg, idx) => (
                            <div key={pkg.name} className="flex items-center justify-between group py-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                    <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">{pkg.name}</span>
                                </div>
                                <span className="text-sm font-bold text-neutral-900">
                                    {pkg.value.toLocaleString('tr-TR')} ₺
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Yearly and Monthly Breakdown Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Yearly Breakdown */}
                <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
                    <div className="p-6 border-b border-neutral-50 bg-neutral-50/30">
                        <h3 className="text-lg font-display font-bold text-neutral-900 flex items-center gap-2">
                            Yıllık Trend
                        </h3>
                    </div>
                    <div className="p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                        <div className="space-y-5">
                            {history.yearly.map((row) => (
                                <div key={row.year} className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                                            {row.year}
                                        </span>
                                        <span className="text-lg font-bold text-neutral-900">{row.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                                    </div>
                                    <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                                            style={{ width: `${(row.amount / Math.max(...history.yearly.map(m => m.amount))) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                            {history.yearly.length === 0 && (
                                <p className="text-center py-8 text-neutral-300 text-xs uppercase tracking-widest font-bold">Veri Yok</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Monthly Breakdown */}
                <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
                    <div className="p-6 border-b border-neutral-50 bg-neutral-50/30">
                        <h3 className="text-lg font-display font-bold text-neutral-900 flex items-center gap-2">
                            Aylık Trend
                        </h3>
                    </div>
                    <div className="p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                        <div className="space-y-5">
                            {history.monthly.map((row) => (
                                <div key={row.month} className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                                            {new Date(row.month + '-01').toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <span className="text-lg font-bold text-neutral-900">{row.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                                    </div>
                                    <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                            style={{ width: `${(row.amount / Math.max(...history.monthly.map(m => m.amount))) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                            {history.monthly.length === 0 && (
                                <p className="text-center py-8 text-neutral-300 text-xs uppercase tracking-widest font-bold">Veri Yok</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Daily Table */}
                <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden xl:col-span-1 flex flex-col">
                    <div className="p-6 border-b border-neutral-50 bg-neutral-50/30">
                        <h3 className="text-lg font-display font-bold text-neutral-900 flex items-center gap-2">
                            Günlük Kayıt
                        </h3>
                    </div>
                    <div className="flex-1 overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider bg-neutral-50/30">
                                    <th className="px-6 py-3">Tarih</th>
                                    <th className="px-6 py-3">Tip</th>
                                    <th className="px-6 py-3 text-right">Kazanç</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {history.daily.map(row => (
                                    <tr key={row.date} className="hover:bg-neutral-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-neutral-800 text-sm">
                                                {new Date(row.date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </div>
                                            <div className="text-[10px] text-neutral-400 font-medium">
                                                {new Date(row.date).toLocaleDateString('tr-TR', { weekday: 'long' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">SATIŞ</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="font-bold text-neutral-900">{row.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</div>
                                        </td>
                                    </tr>
                                ))}
                                {history.daily.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-neutral-300 font-bold uppercase text-xs tracking-widest">Kayıt Bulunamadı</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Live Sales Feed */}
            <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
                <div className="p-6 border-b border-neutral-50 bg-neutral-900 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="flex items-center justify-center w-8 h-8 bg-neutral-800 rounded-lg text-lg">⚡</span> Canlı Satış Akışı
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">CANLI</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100 bg-neutral-50/50">
                                <th className="px-8 py-4">Zaman</th>
                                <th className="px-8 py-4">Kullanıcı</th>
                                <th className="px-8 py-4">Paket Detayı</th>
                                <th className="px-8 py-4">Durum</th>
                                <th className="px-8 py-4 text-right">Tutar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {recentSales.map(sale => (
                                <tr key={sale.id} className="group hover:bg-neutral-50/80 transition-colors">
                                    <td className="px-8 py-4">
                                        <div className="font-medium text-neutral-900 text-sm">
                                            {new Date(sale.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="text-[10px] text-neutral-400">
                                            {new Date(sale.created_at).toLocaleDateString('tr-TR')}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <Link to={`/admin/users?search=${sale.profiles?.user_number}`} className="flex flex-col group/link">
                                            <div className="font-bold text-neutral-800 group-hover/link:text-blue-600 transition-colors text-sm">
                                                {sale.profiles?.full_name || 'Bilinmiyor'}
                                            </div>
                                            <div className="text-[10px] text-neutral-400 font-mono">
                                                ID: {sale.profiles?.user_number}
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex flex-col gap-1">
                                            {sale.listings ? (
                                                <Link to={`/product/${sale.listing_id}`} target="_blank" className="font-medium text-xs text-neutral-600 hover:text-neutral-900 hover:underline truncate max-w-[200px]">
                                                    {sale.listings.title}
                                                </Link>
                                            ) : (
                                                <span className="text-neutral-400 text-xs italic">İlan Silinmiş</span>
                                            )}
                                            <div className="flex items-center gap-1.5">
                                                <span className={`w-1.5 h-1.5 rounded-full ${['galerie', 'vitrin'].includes(sale.package_type?.toLowerCase()) ? 'bg-purple-500' : 'bg-red-500'}`}></span>
                                                <span className="font-bold text-[10px] text-neutral-500 uppercase tracking-wide">
                                                    {['galerie', 'vitrin'].includes(sale.package_type?.toLowerCase()) ? 'VİTRİN' : sale.package_type === 'z_premium' ? 'PREMIUM' : sale.package_type === 'highlight' ? 'ÖNE ÇIKARILAN' : sale.package_type?.toUpperCase() || 'STANDART'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase border ${sale.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                            {sale.status === 'active' ? 'AKTİF' : 'ÖDENDİ'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="font-black text-neutral-900 text-base">+{parseFloat(sale.price).toLocaleString('tr-TR')} ₺</div>
                                    </td>
                                </tr>
                            ))}
                            {recentSales.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-8 py-16 text-center text-neutral-400 font-medium text-sm">Henüz satış verisi yok</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div >
        </div >
    );
};

const ReportCard = ({ title, value, icon, color, subtitle }) => (
    <div className="relative group bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-5 rounded-bl-[100px] -mr-6 -mt-6 transition-transform group-hover:scale-110`}></div>

        <div className="relative flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl text-white shadow-lg`}>
                {icon}
            </div>
            <div className="text-right">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">{title}</p>
                <div className="flex items-baseline justify-end gap-1">
                    <span className="text-2xl font-display font-black text-neutral-900 tracking-tight">
                        {value.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-sm font-bold text-neutral-400">₺</span>
                </div>
            </div>
        </div>

        <div className="relative">
            <p className="text-xs text-neutral-500 font-medium flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                {subtitle}
            </p>
        </div>
    </div>
);

export default AdminSalesReport;
