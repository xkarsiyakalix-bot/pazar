import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminTraffic = () => {
    const [gaData, setGaData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchAnalytics = async (isManual = false) => {
        try {
            if (isManual) setRefreshing(true);
            else setLoading(true);

            const res = await fetch('/api/analytics');
            const data = await res.json();
            if (!data.error) {
                setGaData(data);
                setLastUpdated(new Date());
            }
        } catch (err) {
            console.error('Analytics load error:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
        const interval = setInterval(() => fetchAnalytics(true), 300000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[450px]">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xl shadow-lg shadow-orange-500/20">
                            🌐
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
                                Site Trafiği & Analiz
                            </h1>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                                Google Analytics 4 (GA4) verileriyle gerçek zamanlı ziyaretçi ve oturum metrikleri
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        GA4 Bağlı
                    </span>

                    <button
                        onClick={() => fetchAnalytics(true)}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 rounded-xl text-sm font-bold text-neutral-700 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-400 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                        <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
                        {refreshing ? 'Yenileniyor...' : 'Verileri Yenile'}
                    </button>
                </div>
            </div>

            {/* Main KPI Cards */}
            {gaData ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Bugün */}
                        <div className="relative overflow-hidden bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-white/5 shadow-sm">
                            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-5 rounded-bl-full -mr-4 -mt-4" />
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Bugün</span>
                                <span className="text-xl">📅</span>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Oturum Sayısı</p>
                                    <p className="text-3xl font-display font-black text-neutral-900 dark:text-white tracking-tight mt-0.5">
                                        {(gaData.today?.sessions || 0).toLocaleString('tr-TR')}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-100 dark:border-white/5">
                                    <div>
                                        <p className="text-[10px] font-bold text-neutral-400">Sayfa Görüntüleme</p>
                                        <p className="text-base font-bold text-neutral-800 dark:text-neutral-200">{(gaData.today?.pageviews || 0).toLocaleString('tr-TR')}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-neutral-400">Aktif Kullanıcı</p>
                                        <p className="text-base font-bold text-neutral-800 dark:text-neutral-200">{(gaData.today?.users || 0).toLocaleString('tr-TR')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Son 7 Gün */}
                        <div className="relative overflow-hidden bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-white/5 shadow-sm">
                            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-purple-500 to-pink-600 opacity-5 rounded-bl-full -mr-4 -mt-4" />
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">Son 7 Gün</span>
                                <span className="text-xl">📊</span>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Haftalık Oturum</p>
                                    <p className="text-3xl font-display font-black text-neutral-900 dark:text-white tracking-tight mt-0.5">
                                        {(gaData.week?.sessions || 0).toLocaleString('tr-TR')}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-100 dark:border-white/5">
                                    <div>
                                        <p className="text-[10px] font-bold text-neutral-400">Sayfa Görüntüleme</p>
                                        <p className="text-base font-bold text-neutral-800 dark:text-neutral-200">{(gaData.week?.pageviews || 0).toLocaleString('tr-TR')}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-neutral-400">Tekil Kullanıcı</p>
                                        <p className="text-base font-bold text-neutral-800 dark:text-neutral-200">{(gaData.week?.users || 0).toLocaleString('tr-TR')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Son 30 Gün */}
                        <div className="relative overflow-hidden bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-white/5 shadow-sm">
                            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-5 rounded-bl-full -mr-4 -mt-4" />
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Son 30 Gün</span>
                                <span className="text-xl">📈</span>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Aylık Oturum</p>
                                    <p className="text-3xl font-display font-black text-neutral-900 dark:text-white tracking-tight mt-0.5">
                                        {(gaData.month?.sessions || 0).toLocaleString('tr-TR')}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-100 dark:border-white/5">
                                    <div>
                                        <p className="text-[10px] font-bold text-neutral-400">Sayfa Görüntüleme</p>
                                        <p className="text-base font-bold text-neutral-800 dark:text-neutral-200">{(gaData.month?.pageviews || 0).toLocaleString('tr-TR')}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-neutral-400">Tekil Kullanıcı</p>
                                        <p className="text-base font-bold text-neutral-800 dark:text-neutral-200">{(gaData.month?.users || 0).toLocaleString('tr-TR')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Sections: Top Pages & Traffic Sources */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* En Çok Ziyaret Edilen Sayfalar */}
                        <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-white/5 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-display font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
                                        🔥 En Çok Ziyaret Edilen Sayfalar
                                    </h3>
                                    <p className="text-xs text-neutral-400 uppercase font-bold tracking-widest mt-0.5">
                                        Son 7 Günlük Performans
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {(!gaData.topPages || gaData.topPages.length === 0) ? (
                                    <div className="py-12 text-center text-neutral-400">
                                        <p className="text-2xl mb-2">⏳</p>
                                        <p className="text-sm font-semibold">Veriler henüz derleniyor...</p>
                                        <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                                            Google Analytics yeni sitelerde ilk ziyaret verilerini 24-48 saat içinde işleyip buraya yansıtır.
                                        </p>
                                    </div>
                                ) : (
                                    gaData.topPages.map((page, idx) => {
                                        const maxViews = gaData.topPages[0]?.views || 1;
                                        const percent = Math.round((page.views / maxViews) * 100);
                                        return (
                                            <div key={idx} className="group p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                                <div className="flex items-center justify-between gap-4 mb-2">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <span className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-500">
                                                            {idx + 1}
                                                        </span>
                                                        <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200 truncate">
                                                            {page.path}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-black text-blue-600 dark:text-blue-400 shrink-0">
                                                        {page.views.toLocaleString('tr-TR')} <span className="text-xs font-normal text-neutral-400">görüntüleme</span>
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-neutral-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                                                        style={{ width: `${percent}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Trafik Kaynakları */}
                        <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-white/5 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-display font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
                                        🌐 Trafik Kanalları
                                    </h3>
                                    <p className="text-xs text-neutral-400 uppercase font-bold tracking-widest mt-0.5">
                                        Ziyaretçilerin Geliş Kaynakları (7 Gün)
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {(!gaData.sources || gaData.sources.length === 0) ? (
                                    <div className="py-12 text-center text-neutral-400">
                                        <p className="text-2xl mb-2">📊</p>
                                        <p className="text-sm font-semibold">Trafik kaynakları analiz ediliyor...</p>
                                        <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                                            Sosyal medya (Facebook, Instagram), organik arama (Google) ve doğrudan gelen ziyaretçiler tespit edildikçe burada listelenecektir.
                                        </p>
                                    </div>
                                ) : (
                                    gaData.sources.map((src, idx) => {
                                        const totalSessions = gaData.sources.reduce((sum, s) => sum + s.sessions, 0) || 1;
                                        const percent = Math.round((src.sessions / totalSessions) * 100);
                                        const colors = [
                                            { bg: 'bg-emerald-500', bar: 'from-emerald-500 to-teal-600', text: 'text-emerald-600 dark:text-emerald-400' },
                                            { bg: 'bg-blue-500', bar: 'from-blue-500 to-indigo-600', text: 'text-blue-600 dark:text-blue-400' },
                                            { bg: 'bg-purple-500', bar: 'from-purple-500 to-pink-600', text: 'text-purple-600 dark:text-purple-400' },
                                            { bg: 'bg-amber-500', bar: 'from-amber-500 to-orange-600', text: 'text-amber-600 dark:text-amber-400' },
                                            { bg: 'bg-rose-500', bar: 'from-rose-500 to-red-600', text: 'text-rose-600 dark:text-rose-400' },
                                        ];
                                        const color = colors[idx % colors.length];

                                        const channelNames = {
                                            'Organic Search': '🔍 Organik Arama (Google vb.)',
                                            'Direct': '🔗 Doğrudan (Direkt Giriş)',
                                            'Organic Social': '📱 Sosyal Medya (Facebook vb.)',
                                            'Referral': '🌐 Yönlendirme (Başka Siteler)',
                                            'Paid Search': '💰 Ücretli Reklam',
                                            'Email': '✉️ E-posta'
                                        };

                                        return (
                                            <div key={idx} className="p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                                <div className="flex items-center justify-between gap-4 mb-2">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <div className={`w-2.5 h-2.5 rounded-full ${color.bg} shrink-0`} />
                                                        <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200 truncate">
                                                            {channelNames[src.channel] || src.channel}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <span className="text-sm font-black text-neutral-800 dark:text-neutral-200">
                                                            {src.sessions.toLocaleString('tr-TR')}
                                                        </span>
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-white/5 ${color.text}`}>
                                                            %{percent}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="h-2 bg-neutral-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full bg-gradient-to-r ${color.bar} rounded-full transition-all duration-500`}
                                                        style={{ width: `${percent}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info Card / External link */}
                    <div className="p-6 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                                📈
                            </div>
                            <div>
                                <h4 className="font-display font-bold text-base">Daha Fazla Ayrıntı ve Gerçek Zamanlı Raporlar</h4>
                                <p className="text-xs text-neutral-300 mt-0.5">
                                    Canlı anlık kullanıcı haritası ve derinlemesine etkinlikler için Google Analytics panelini açabilirsiniz.
                                </p>
                            </div>
                        </div>
                        <a
                            href="https://analytics.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 bg-white text-neutral-900 hover:bg-neutral-100 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 shadow-md flex items-center gap-1.5"
                        >
                            Google Analytics Paneli
                            <span>↗</span>
                        </a>
                    </div>
                </>
            ) : (
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 rounded-3xl p-8 text-center">
                    <p className="text-amber-800 dark:text-amber-400 font-bold text-base">⚠️ Google Analytics Verisi Alınamadı</p>
                    <p className="text-amber-600 dark:text-amber-500 text-xs mt-1">Lütfen Vercel ortam değişkenlerini kontrol edin.</p>
                </div>
            )}
        </div>
    );
};

export default AdminTraffic;
