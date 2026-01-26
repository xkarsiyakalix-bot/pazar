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
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">Satış Raporları</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-500 font-medium tracking-wide">Gelir Özeti ve Canlı Analiz</p>
                        <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-black border border-red-100">
                            SON GÜNCELLEME: {lastUpdated.toLocaleTimeString('tr-TR')}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={playNotification}
                        className="p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-all shadow-sm"
                        title="Ses Testi"
                    >
                        🔊 TEST
                    </button>
                    <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        SESLİ BİLDİRİM AKTİF
                    </div>
                    <button
                        onClick={() => calculateReport(true)}
                        disabled={isRefreshing}
                        className="px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl text-sm font-black text-gray-700 hover:border-red-500 transition-all shadow-xl shadow-gray-200/50 flex items-center gap-3 group active:scale-95 disabled:opacity-50"
                    >
                        <div className="relative">
                            <div className={`w-2.5 h-2.5 bg-green-500 rounded-full ${isRefreshing ? 'animate-spin' : 'group-hover:animate-ping'}`}></div>
                            {!isRefreshing && <div className="w-2.5 h-2.5 bg-green-500 rounded-full absolute inset-0"></div>}
                        </div>
                        {isRefreshing ? 'GÜNCELLENİYOR...' : 'CANLI YENİLE'}
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
                    subtitle="Sistem Başlangıcından Beri"
                />
            </div>

            {/* Minute-by-Minute Live Graph and Package Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                        <div className="flex items-center gap-3 px-4 py-2 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black tracking-[0.2em]">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            CANLI VERİ
                        </div>
                    </div>

                    <div className="mb-10">
                        <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                            <span className="p-3 bg-red-50 rounded-2xl">📈</span>
                            Kazanç Analizi
                        </h3>
                        <p className="text-gray-400 font-bold text-sm ml-16 tracking-tight uppercase opacity-50">Son 60 Dakika Performansı</p>
                    </div>

                    <div className="h-[350px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history.minute}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="time"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                    interval={9}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                    tickFormatter={(value) => `${value}₺`}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '5 5' }}
                                    contentStyle={{
                                        borderRadius: '24px',
                                        border: 'none',
                                        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                                        padding: '20px',
                                        backgroundColor: 'white'
                                    }}
                                    formatter={(value) => [`${value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺`, 'Gelir']}
                                    labelStyle={{ fontWeight: 900, color: '#1e293b', marginBottom: '8px', fontSize: '14px', textTransform: 'uppercase' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#ef4444"
                                    strokeWidth={6}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    animationDuration={2500}
                                    animationEasing="ease-in-out"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center">
                    <h3 className="text-xl font-black text-gray-900 mb-2 w-full">Paket Dağılımı</h3>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-8 w-full opacity-50 text-left">Gelir Kaynağı Analizi</p>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={packageStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {packageStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`${value.toLocaleString('tr-TR')} ₺`, 'Toplam']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="w-full mt-4 space-y-3 overflow-y-auto max-h-[150px] pr-2 custom-scrollbar">
                        {packageStats.map((pkg, idx) => (
                            <div key={pkg.name} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                    <span className="text-xs font-black text-gray-700 uppercase italic opacity-70 group-hover:opacity-100 transition-opacity">{pkg.name}</span>
                                </div>
                                <span className="text-sm font-black text-gray-900 italic">
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
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                            <span className="p-2 bg-emerald-50 rounded-xl text-xl">📅</span> Yıllık Trend
                        </h3>
                    </div>
                    <div className="p-8">
                        <div className="space-y-6">
                            {history.yearly.map((row) => (
                                <div key={row.year} className="group">
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                            {row.year} YILI
                                        </span>
                                        <span className="text-xl font-black text-gray-900 italic">{row.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                                    </div>
                                    <div className="h-4 bg-gray-50 rounded-full overflow-hidden border border-gray-100 shadow-inner">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 transition-all duration-1000 ease-out rounded-full shadow-lg shadow-emerald-500/20"
                                            style={{ width: `${(row.amount / Math.max(...history.yearly.map(m => m.amount))) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                            {history.yearly.length === 0 && (
                                <p className="text-center py-12 text-gray-300 font-bold uppercase text-xs tracking-[0.3em]">VERİ KAYDI YOK</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Monthly Breakdown */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                            <span className="p-2 bg-blue-50 rounded-xl text-xl">📊</span> Aylık Trend
                        </h3>
                    </div>
                    <div className="p-8">
                        <div className="space-y-6">
                            {history.monthly.map((row, idx) => (
                                <div key={row.month} className="group">
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                            {new Date(row.month + '-01').toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <span className="text-xl font-black text-gray-900 italic">{row.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                                    </div>
                                    <div className="h-4 bg-gray-50 rounded-full overflow-hidden border border-gray-100 shadow-inner">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000 ease-out rounded-full shadow-lg shadow-blue-500/20"
                                            style={{ width: `${(row.amount / Math.max(...history.monthly.map(m => m.amount))) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                            {history.monthly.length === 0 && (
                                <p className="text-center py-12 text-gray-300 font-bold uppercase text-xs tracking-[0.3em]">VERİ KAYDI YOK</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Daily Table */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden xl:col-span-1">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                            <span className="p-2 bg-emerald-50 rounded-xl text-xl">📅</span> Günlük Kayıt
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-gray-100">
                                    <th className="px-10 py-6">Zaman Çizgisi</th>
                                    <th className="px-10 py-6">Tip</th>
                                    <th className="px-10 py-6 text-right">Kazanç</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {history.daily.map(row => (
                                    <tr key={row.date} className="hover:bg-gray-50/80 transition-all duration-300 group">
                                        <td className="px-10 py-6">
                                            <div className="font-black text-gray-900 group-hover:text-red-600 transition-colors">
                                                {new Date(row.date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', weekday: 'short' })}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="bg-gray-900 text-white px-3 py-1 rounded-xl text-[10px] font-black tracking-widest italic group-hover:bg-red-600 transition-colors">PROMOSYON</span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="font-black text-gray-900 text-lg italic">{row.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</div>
                                        </td>
                                    </tr>
                                ))}
                                {history.daily.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-10 py-20 text-center text-gray-300 font-bold uppercase text-xs tracking-[0.3em]">BOŞ DEPO</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Detailed Yearly-Monthly Breakdown */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                        <span className="p-2 bg-purple-50 rounded-xl text-xl">🗓️</span> Yıllara Göre Aylık Detay
                    </h3>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Object.entries(history.detailedYearly)
                            .sort(([yearA], [yearB]) => yearB.localeCompare(yearA))
                            .map(([year, months]) => (
                                <div key={year} className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 h-full">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-2xl font-black text-gray-900 italic">{year}</h4>
                                        <span className="bg-emerald-500 text-white px-3 py-1 rounded-xl text-[10px] font-black tracking-widest uppercase">
                                            TOPLAM: {(Object.values(months).reduce((a, b) => a + b, 0)).toLocaleString('tr-TR')} ₺
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(m => {
                                            const amount = months[m] || 0;
                                            const monthName = new Date(2000, parseInt(m) - 1).toLocaleDateString('tr-TR', { month: 'long' });
                                            const maxInYear = Math.max(...Object.values(months));

                                            return (
                                                <div key={m} className="flex flex-col gap-1">
                                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-wider text-gray-500">
                                                        <span>{monthName}</span>
                                                        <span className={amount > 0 ? "text-emerald-600" : "text-gray-300"}>
                                                            {amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-1000 ${amount === 0 ? 'w-0' : ''}`}
                                                            style={{ width: amount > 0 ? `${(amount / maxInYear) * 100}%` : '0%' }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        {Object.keys(history.detailedYearly).length === 0 && (
                            <div className="col-span-full text-center py-20 text-gray-300 font-bold uppercase text-xs tracking-[0.3em]">
                                DETAYLI VERİ KAYDI BULUNAMADI
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Live Sales Feed */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-900 flex justify-between items-center">
                    <h3 className="text-xl font-black text-white flex items-center gap-3">
                        <span className="p-2 bg-red-600 rounded-xl text-xl">🔥</span> Canlı Satış Akışı
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">SİSTEM AKTİF</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-gray-100">
                                <th className="px-10 py-6">Tarih / Saat</th>
                                <th className="px-10 py-6">Kullanıcı</th>
                                <th className="px-10 py-6">İlan / Paket</th>
                                <th className="px-10 py-6">Durum</th>
                                <th className="px-10 py-6 text-right">Tutar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentSales.map(sale => (
                                <tr key={sale.id} className="hover:bg-gray-50/80 transition-all duration-300 group">
                                    <td className="px-10 py-6">
                                        <div className="font-bold text-gray-900">
                                            {new Date(sale.created_at).toLocaleDateString('tr-TR')}
                                        </div>
                                        <div className="text-[10px] text-gray-400 font-black">
                                            {new Date(sale.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <Link to={`/admin/users?search=${sale.profiles?.user_number}`} className="group/user flex flex-col">
                                            <div className="font-bold text-gray-900 group-hover/user:text-red-600 transition-colors uppercase tracking-tight italic">
                                                {sale.profiles?.full_name || 'Bilinmiyor'}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-black">
                                                #{sale.profiles?.user_number}
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col gap-1">
                                            {sale.listings ? (
                                                <Link to={`/product/${sale.listing_id}`} target="_blank" className="font-bold text-xs text-blue-600 hover:underline truncate max-w-[200px]">
                                                    {sale.listings.title}
                                                </Link>
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">İlan Silinmiş</span>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${sale.package_type === 'galerie' ? 'bg-purple-500' : 'bg-red-500'}`}></span>
                                                <span className="font-black text-[10px] text-gray-500 uppercase italic">
                                                    {sale.package_type === 'galerie' ? 'VİTRİN' : sale.package_type === 'z_premium' ? 'PREMIUM' : sale.package_type === 'highlight' ? 'ÖNE ÇIKARILAN' : sale.package_type?.toUpperCase() || 'STANDART'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${sale.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {sale.status === 'active' ? 'AKTİF' : 'ÖDENDİ'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="font-black text-green-600 text-lg">+{parseFloat(sale.price).toLocaleString('tr-TR')} ₺</div>
                                    </td>
                                </tr>
                            ))}
                            {recentSales.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-10 py-20 text-center text-gray-300 font-bold uppercase text-xs tracking-[0.3em]">HENÜZ SATIŞ GERÇEKLEŞMEDİ</td>
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
    <div className="relative group">
        <div className={`absolute inset-0 bg-gradient-to-r ${color} rounded-[2rem] blur-2xl opacity-10 group-hover:opacity-25 transition-opacity duration-500`}></div>
        <div className="relative bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-4 -translate-y-4">
                <span className="text-[120px] font-black">{icon}</span>
            </div>

            <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl text-white shadow-xl shadow-gray-200`}>
                    {icon}
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{title}</p>
                    <p className="text-xs text-gray-500 font-bold italic">{subtitle}</p>
                </div>
            </div>

            <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-gray-900 tracking-tighter italic">
                    {value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xl font-black text-red-500 tracking-widest uppercase">₺</span>
            </div>
        </div>
    </div>
);

export default AdminSalesReport;
