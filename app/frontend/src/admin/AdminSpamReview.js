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
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Spam İnceleme Paneli</h1>
                <p className="text-gray-600">Şüpheli ilanları ve kullanıcı raporlarını inceleyin</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('listings')}
                    className={`px-4 py-2 font-semibold transition-colors border-b-2 ${activeTab === 'listings'
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Şüpheli İlanlar ({listings.length})
                </button>
                <button
                    onClick={() => setActiveTab('reports')}
                    className={`px-4 py-2 font-semibold transition-colors border-b-2 ${activeTab === 'reports'
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
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
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500">İnceleme bekleyen ilan yok</p>
                                </div>
                            ) : (
                                listings.map((listing) => (
                                    <div key={listing.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-gray-900 mb-2">{listing.title}</h3>
                                                <p className="text-sm text-gray-600 mb-2">{listing.description?.substring(0, 200)}...</p>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span>Fiyat: {listing.price}₺</span>
                                                    <span>Kategori: {listing.category}</span>
                                                    <span>Kullanıcı: {listing.profiles?.full_name || 'Bilinmiyor'}</span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                {getRiskBadge(listing.spam_score)}
                                            </div>
                                        </div>

                                        {/* Spam Flags */}
                                        {listing.spam_flags && listing.spam_flags.length > 0 && (
                                            <div className="mb-4">
                                                <p className="text-xs font-semibold text-gray-700 mb-2">Tespit Edilen Sorunlar:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {listing.spam_flags.map((flag, idx) => (
                                                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                                            {flag.replace('_', ' ')}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleMarkAsSpam(listing.id)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                                            >
                                                Spam Olarak İşaretle
                                            </button>
                                            <button
                                                onClick={() => handleMarkAsSafe(listing.id)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                                            >
                                                Güvenli Olarak İşaretle
                                            </button>
                                            <a
                                                href={`/product/${listing.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold"
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
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500">Bekleyen rapor yok</p>
                                </div>
                            ) : (
                                reports.map((report) => (
                                    <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <div className="mb-4">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                {report.listing?.title || 'İlan Bulunamadı'}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                <span>Rapor Eden: {report.reporter?.full_name}</span>
                                                <span>Tarih: {new Date(report.created_at).toLocaleDateString('tr-TR')}</span>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-sm font-semibold text-gray-700 mb-1">Sebep: {report.reason}</p>
                                                {report.details && (
                                                    <p className="text-sm text-gray-600">{report.details}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => {
                                                    handleMarkAsSpam(report.listing_id);
                                                    handleResolveReport(report.id, 'spam');
                                                }}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                                            >
                                                Spam Onayla
                                            </button>
                                            <button
                                                onClick={() => handleResolveReport(report.id, 'dismiss')}
                                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold"
                                            >
                                                Reddet
                                            </button>
                                            {report.listing && (
                                                <a
                                                    href={`/product/${report.listing_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold"
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
