import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminSalesReport = () => {
    const [stats, setStats] = useState({
        daily: 0,
        monthly: 0,
        yearly: 0,
        total: 0
    });
    const [history, setHistory] = useState({
        daily: [],
        monthly: [],
        minute: []
    });
    const [loading, setLoading] = useState(true);

    const calculateReport = async () => {
        try {
            // Only set loading on initial fetch
            const isInitial = history.minute.length === 0;
            if (isInitial) setLoading(true);

            const { data: promotions, error } = await supabase
                .from('promotions')
                .select('*')
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
                const price = parseFloat(promo.price) || 0;
                const createdDate = new Date(promo.created_at);
                const dateStr = createdDate.toISOString().split('T')[0];
                const monthStr = dateStr.substring(0, 7);
                const yearStr = dateStr.substring(0, 4);

                totalRevenue += price;

                // Stats
                if (dateStr === todayStr) dailyRevenue += price;
                if (monthStr === thisMonthStr) monthlyRevenue += price;
                if (yearStr === thisYearStr) yearlyRevenue += price;

                // History grouping
                dailyGroups[dateStr] = (dailyGroups[dateStr] || 0) + price;
                monthlyGroups[monthStr] = (monthlyGroups[monthStr] || 0) + price;

                // Minute grouping (check if within last 60 mins)
                const diffMs = now.getTime() - createdDate.getTime();
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

            // Format history
            const dailyHistory = Object.entries(dailyGroups)
                .map(([date, amount]) => ({ date, amount }))
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 30);

            const monthlyHistory = Object.entries(monthlyGroups)
                .map(([month, amount]) => ({ month, amount }))
                .sort((a, b) => b.month.localeCompare(a.month))
                .slice(0, 12);

            setHistory({
                daily: dailyHistory,
                monthly: monthlyHistory,
                minute: minuteData
            });

        } catch (error) {
            console.error('Error calculating reports:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        calculateReport();
        // Auto-refresh every 30 seconds for real-time feel
        const interval = setInterval(calculateReport, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">Satış Raporları</h1>
                    <p className="text-gray-500 font-medium tracking-wide">Gelir Özeti ve Canlı Analiz</p>
                </div>
                <button
                    onClick={calculateReport}
                    className="px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl text-sm font-black text-gray-700 hover:border-red-500 transition-all shadow-xl shadow-gray-200/50 flex items-center gap-3 group active:scale-95"
                >
                    <div className="relative">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full group-hover:animate-ping"></div>
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full absolute inset-0"></div>
                    </div>
                    CANLI YENİLE
                </button>
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

            {/* Minute-by-Minute Live Graph */}
            <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                    <div className="flex items-center gap-3 px-4 py-2 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black tracking-[0.2em]">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        GELİR KAYDI
                    </div>
                </div>

                <div className="mb-10">
                    <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                        <span className="p-3 bg-red-50 rounded-2xl">📈</span>
                        Dakika Dakika Kazanç
                    </h3>
                    <p className="text-gray-400 font-bold text-sm ml-16 tracking-tight uppercase opacity-50">Canlı Performans (Son 60 Dakika)</p>
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

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
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
        </div>
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
