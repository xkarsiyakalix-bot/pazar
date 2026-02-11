import React, { useState, useEffect } from 'react';
import { getAllReports, updateReportStatus, deleteReport } from '../api/reports';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            setLoading(true);
            const data = await getAllReports();
            setReports(data);
        } catch (error) {
            console.error('Error loading reports:', error);
            alert('Bildirimler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (reportId, newStatus) => {
        try {
            await updateReportStatus(reportId, newStatus);
            alert('Durum başarıyla güncellendi');
            loadReports();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Durum güncellenirken hata oluştu');
        }
    };

    const handleDelete = async (reportId) => {
        if (!window.confirm('Bu bildirimi silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            await deleteReport(reportId);
            alert('Bildirim başarıyla silindi');
            loadReports();
        } catch (error) {
            console.error('Error deleting report:', error);
            alert('Bildirim silinirken hata oluştu');
        }
    };

    const getReasonLabel = (reason) => {
        const reasons = {
            spam: 'Spam veya Dolandırıcılık',
            inappropriate: 'Uygunsuz İçerik',
            duplicate: 'Çift İlan',
            wrong_category: 'Yanlış Kategori',
            sold: 'Zaten Satıldı',
            other: 'Diğer'
        };
        return reasons[reason] || reason;
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-400', label: 'Beklemede' },
            reviewed: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-800 dark:text-blue-400', label: 'İncelendi' },
            resolved: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-800 dark:text-green-400', label: 'Çözüldü' },
            rejected: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-800 dark:text-red-400', label: 'Reddedildi' }
        };
        const badge = badges[status] || badges.pending;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border border-transparent dark:border-current/10 ${badge.bg} ${badge.text}`}>
                {badge.label}
            </span>
        );
    };

    const filteredReports = reports.filter(report => {
        if (filter === 'all') return true;
        return report.status === filter;
    });

    const sortedReports = [...filteredReports].sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.created_at) - new Date(a.created_at);
        }
        return 0;
    });

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="medium" />
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-neutral-50 tracking-tight transition-colors duration-300">Rapor Yönetimi</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 font-medium mt-1 transition-colors duration-300">Kullanıcı bildirimlerini ve şikayetleri inceleyin</p>
                </div>

                <div className="bg-white dark:bg-neutral-900 p-1 rounded-xl shadow-sm border border-neutral-200 dark:border-white/10 flex transition-colors duration-300">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'all'
                            ? 'bg-neutral-900 dark:bg-neutral-700 text-white shadow-md'
                            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                            }`}
                    >
                        Tümü
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'pending'
                            ? 'bg-neutral-900 dark:bg-neutral-700 text-white shadow-md'
                            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                            }`}
                    >
                        Bekleyenler
                    </button>
                    <button
                        onClick={() => setFilter('resolved')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'resolved'
                            ? 'bg-neutral-900 dark:bg-neutral-700 text-white shadow-md'
                            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                            }`}
                    >
                        Çözülenler
                    </button>
                    <button
                        onClick={() => setFilter('rejected')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'rejected'
                            ? 'bg-neutral-900 dark:bg-neutral-700 text-white shadow-md'
                            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                            }`}
                    >
                        Reddedilenler
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-100 dark:border-white/5 overflow-hidden transition-colors duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50/50 dark:bg-neutral-950/50 border-b border-neutral-100 dark:border-white/5 text-neutral-500 dark:text-neutral-400 font-bold text-[11px] uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Rapor Detayı</th>
                                <th className="px-6 py-4">İlgili İçerik</th>
                                <th className="px-6 py-4">Durum</th>
                                <th className="px-6 py-4">Tarih</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50 dark:divide-white/5">
                            {sortedReports.map(report => (
                                <tr key={report.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                                                {getReasonLabel(report.reason)}
                                            </span>
                                            <span className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs break-words">
                                                {report.description || 'Açıklama yok'}
                                            </span>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-white/5">
                                                    Raporlayan: {report.reporter_id?.substring(0, 8) || '?'}...
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-500 uppercase tracking-wide">
                                                {report.target_type === 'listing' ? 'İlan' :
                                                    report.target_type === 'user' ? 'Kullanıcı' :
                                                        report.target_type === 'message' ? 'Mesaj' : report.target_type}
                                            </span>
                                            {report.listing_id && (
                                                <a
                                                    href={`/product/${report.listing_id}`}
                                                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline flex items-center gap-1"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    İlanı Görüntüle
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(report.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                                                {new Date(report.created_at).toLocaleDateString('tr-TR')}
                                            </span>
                                            <span className="text-xs text-neutral-400 dark:text-neutral-500">
                                                {new Date(report.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            {report.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(report.id, 'resolved')}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30 rounded-lg text-xs font-bold hover:bg-green-100 dark:hover:bg-green-900/40 transition-all shadow-sm"
                                                    >
                                                        Onayla
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(report.id, 'rejected')}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-white/10 rounded-lg text-xs font-bold hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-red-600 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-900/30 transition-all shadow-sm"
                                                    >
                                                        Reddet
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleDelete(report.id)}
                                                className="p-1.5 text-neutral-400 dark:text-neutral-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                title="Sil"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-0.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {sortedReports.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center text-neutral-400 dark:text-neutral-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-950 rounded-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-neutral-300 dark:text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-0.707.293l-2.414 2.414a1 1 0 01-0.707.293h-3.172a1 1 0 01-0.707-0.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                                            </div>
                                            <p className="font-medium">Bu kriterlerde rapor bulunmamaktadır.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
