import React, { useState, useEffect } from 'react';
import { getListingsNeedingReview, getSpamReports, markAsSpam, markAsSafe, updateSpamReportStatus } from '../api/spam';
import LoadingSpinner from '../components/LoadingSpinner';
import { getSpamRiskLevel, getSpamRiskColor } from '../utils/spamDetection';

const AdminSpamReview = () => {
    const [listings, setListings] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('listings'); // 'listings' or 'reports'

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'listings') {
                const data = await getListingsNeedingReview();
                setListings(data);
            } else {
                const data = await getSpamReports('pending');
                setReports(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsSpam = async (listingId) => {
        if (!window.confirm('Bu ilanı spam olarak işaretlemek istediğinizden emin misiniz?')) return;

        try {
            await markAsSpam(listingId);
            fetchData();
            alert('İlan spam olarak işaretlendi ve gizlendi.');
        } catch (error) {
            alert('Hata: ' + error.message);
        }
    };

    const handleMarkAsSafe = async (listingId) => {
        try {
            await markAsSafe(listingId);
            fetchData();
            alert('İlan güvenli olarak işaretlendi.');
        } catch (error) {
            alert('Hata: ' + error.message);
        }
    };

    const handleResolveReport = async (reportId, action) => {
        try {
            await updateSpamReportStatus(reportId, action === 'spam' ? 'resolved' : 'dismissed');
            fetchData();
        } catch (error) {
            alert('Hata: ' + error.message);
        }
    };

    const getRiskBadge = (score) => {
        const level = getSpamRiskLevel(score);
        const color = getSpamRiskColor(score);

        const colors = {
            red: 'bg-red-100 text-red-800 border-red-300',
            orange: 'bg-orange-100 text-orange-800 border-orange-300',
            green: 'bg-green-100 text-green-800 border-green-300'
        };

        const labels = {
            high: 'Yüksek Risk',
            medium: 'Orta Risk',
            low: 'Düşük Risk'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colors[color]}`}>
                {labels[level]} ({score})
            </span>
        );
    };

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-neutral-50 mb-2 transition-colors duration-300">Spam İnceleme Paneli</h1>
                <p className="text-neutral-500 dark:text-neutral-400 font-medium transition-colors duration-300">Şüpheli ilanları ve kullanıcı raporlarını inceleyin</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl mb-8 w-fit transition-colors duration-300">
                <button
                    onClick={() => setActiveTab('listings')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'listings'
                        ? 'bg-white dark:bg-neutral-900 text-red-600 dark:text-red-500 shadow-sm'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                        }`}
                >
                    Şüpheli İlanlar ({listings.length})
                </button>
                <button
                    onClick={() => setActiveTab('reports')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'reports'
                        ? 'bg-white dark:bg-neutral-900 text-red-600 dark:text-red-500 shadow-sm'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                        }`}
                >
                    Kullanıcı Raporları ({reports.length})
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <LoadingSpinner size="large" />
                </div>
            ) : (
                <>
                    {/* Listings Tab */}
                    {activeTab === 'listings' && (
                        <div className="space-y-4">
                            {listings.length === 0 ? (
                                <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-950 rounded-3xl border border-neutral-200 dark:border-white/5 transition-colors">
                                    <div className="w-16 h-16 bg-white dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                        <svg className="w-8 h-8 text-neutral-300 dark:text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <p className="text-neutral-500 dark:text-neutral-400 font-medium">İnceleme bekleyen ilan yok</p>
                                </div>
                            ) : (
                                listings.map((listing) => (
                                    <div key={listing.id} className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-200 dark:border-white/5 p-8 transition-colors duration-300 hover:shadow-md">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-3">{listing.title}</h3>
                                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 leading-relaxed">{listing.description?.substring(0, 300)}...</p>
                                                <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Fiyat: {listing.price} TL</span>
                                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Kategori: {listing.category}</span>
                                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Kullanıcı: {listing.profiles?.full_name || 'Bilinmiyor'}</span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                {getRiskBadge(listing.spam_score)}
                                            </div>
                                        </div>

                                        {/* Spam Flags */}
                                        {listing.spam_flags && listing.spam_flags.length > 0 && (
                                            <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-950/50 rounded-2xl border border-neutral-100 dark:border-white/5">
                                                <p className="text-[10px] uppercase font-black text-neutral-400 dark:text-neutral-500 mb-3 tracking-widest">Tespit Edilen Sorunlar:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {listing.spam_flags.map((flag, idx) => (
                                                        <span key={idx} className="px-3 py-1 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-bold border border-neutral-200 dark:border-white/10 shadow-sm">
                                                            {flag.replace(/_/g, ' ')}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                onClick={() => handleMarkAsSpam(listing.id)}
                                                className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all text-sm font-bold shadow-lg shadow-red-200 dark:shadow-red-900/20 active:scale-95"
                                            >
                                                Spam Olarak İşaretle
                                            </button>
                                            <button
                                                onClick={() => handleMarkAsSafe(listing.id)}
                                                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all text-sm font-bold shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20 active:scale-95"
                                            >
                                                Güvenli Olarak İşaretle
                                            </button>
                                            <a
                                                href={`/product/${listing.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-6 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all text-sm font-bold border border-neutral-200 dark:border-white/10"
                                            >
                                                İlanı Görüntüle
                                            </a>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Reports Tab */}
                    {activeTab === 'reports' && (
                        <div className="space-y-4">
                            {reports.length === 0 ? (
                                <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-950 rounded-3xl border border-neutral-200 dark:border-white/5 transition-colors">
                                    <div className="w-16 h-16 bg-white dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                        <svg className="w-8 h-8 text-neutral-300 dark:text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8v8m9-8v8m9-8v8M3 5h18a2 2 0 012 2v2a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2z"></path></svg>
                                    </div>
                                    <p className="text-neutral-500 dark:text-neutral-400 font-medium">Bekleyen rapor yok</p>
                                </div>
                            ) : (
                                reports.map((report) => (
                                    <div key={report.id} className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-200 dark:border-white/5 p-8 transition-colors duration-300">
                                        <div className="mb-6">
                                            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-3">
                                                {report.listing?.title || 'İlan Bulunamadı'}
                                            </h3>
                                            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-4">
                                                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Rapor Eden: {report.reporter?.full_name}</span>
                                                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>Tarih: {new Date(report.created_at).toLocaleDateString('tr-TR')}</span>
                                            </div>
                                            <div className="bg-neutral-50 dark:bg-neutral-950/50 rounded-2xl p-5 border border-neutral-100 dark:border-white/5">
                                                <p className="text-sm font-black text-red-600 dark:text-red-500 mb-2 uppercase tracking-tight">Sebep: {report.reason}</p>
                                                {report.details && (
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed italic">"{report.details}"</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                onClick={() => {
                                                    handleMarkAsSpam(report.listing_id);
                                                    handleResolveReport(report.id, 'spam');
                                                }}
                                                className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all text-sm font-bold shadow-lg shadow-red-200 dark:shadow-red-900/20 active:scale-95"
                                            >
                                                Spam Onayla
                                            </button>
                                            <button
                                                onClick={() => handleResolveReport(report.id, 'dismiss')}
                                                className="px-6 py-2.5 bg-neutral-600 text-white rounded-xl hover:bg-neutral-700 transition-all text-sm font-bold shadow-lg shadow-neutral-200 dark:shadow-neutral-900/20 active:scale-95"
                                            >
                                                Reddet
                                            </button>
                                            {report.listing && (
                                                <a
                                                    href={`/product/${report.listing_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-6 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all text-sm font-bold border border-neutral-200 dark:border-white/10"
                                                >
                                                    İlanı Görüntüle
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminSpamReview;
