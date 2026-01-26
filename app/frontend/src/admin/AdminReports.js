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
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Beklemede' },
            reviewed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'İncelendi' },
            resolved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Çözüldü' },
            rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Reddedildi' }
        };
        const badge = badges[status] || badges.pending;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="medium" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Bildirilen İlanlar</h1>
                <p className="text-gray-600">Bildirilen ilanları yönetin ve bildirimleri inceleyin</p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex gap-4 items-center">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duruma göre filtrele:</label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        <option value="all">Tümü</option>
                        <option value="pending">Beklemede</option>
                        <option value="reviewed">İncelendi</option>
                        <option value="resolved">Çözüldü</option>
                        <option value="rejected">Reddedildi</option>
                    </select>
                </div>

                <div className="ml-auto">
                    <button
                        onClick={loadReports}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Güncelle
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-sm text-gray-600">Toplam</div>
                    <div className="text-2xl font-bold text-gray-900">{reports.length}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-sm text-gray-600">Beklemede</div>
                    <div className="text-2xl font-bold text-yellow-600">
                        {reports.filter(r => r.status === 'pending').length}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-sm text-gray-600">İncelendi</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {reports.filter(r => r.status === 'reviewed').length}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-sm text-gray-600">Çözüldü</div>
                    <div className="text-2xl font-bold text-green-600">
                        {reports.filter(r => r.status === 'resolved').length}
                    </div>
                </div>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {sortedReports.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        Bildirim bulunamadı
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        İlan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sebep
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Bildiren
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tarih
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Durum
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedReports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {report.listing?.title || 'İlan silindi'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                ID: {report.listing_id?.substring(0, 8)}...
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{getReasonLabel(report.reason)}</div>
                                            {report.description && (
                                                <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                                                    {report.description}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                User ID: {report.reported_by?.substring(0, 8)}...
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(report.created_at).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(report.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <select
                                                    value={report.status}
                                                    onChange={(e) => handleStatusChange(report.id, e.target.value)}
                                                    className="text-sm px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                                                >
                                                    <option value="pending">Beklemede</option>
                                                    <option value="reviewed">İncelendi</option>
                                                    <option value="resolved">Çözüldü</option>
                                                    <option value="rejected">Reddedildi</option>
                                                </select>
                                                {report.listing && (
                                                    <a
                                                        href={`/product/${report.listing_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        Görüntüle
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(report.id)}
                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                >
                                                    Sil
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReports;
