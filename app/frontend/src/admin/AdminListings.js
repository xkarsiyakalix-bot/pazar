import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { generateListingNumber } from '../components';

const AdminListings = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            setLoading(true);
            const { data: listings, error } = await supabase
                .from('listings')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Manually fetch profiles
            let listingsWithProfiles = [];
            if (listings && listings.length > 0) {
                const userIds = [...new Set(listings.map(l => l.user_id))];
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('id, full_name, email, user_number')
                    .in('id', userIds);

                listingsWithProfiles = listings.map(listing => ({
                    ...listing,
                    profiles: profiles?.find(p => p.id === listing.user_id) || { full_name: 'Bilinmiyor' }
                }));
            }

            setListings(listingsWithProfiles);
        } catch (error) {
            console.error('Error fetching listings:', error);
            alert(`İlanlar yüklenirken hata: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu ilanı silmek istediğinizden emin misiniz?')) return;

        try {
            const { error } = await supabase
                .from('listings')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setListings(listings.filter(l => l.id !== id));
            alert('İlan silindi');
        } catch (error) {
            console.error('Error deleting listing:', error);
            alert('Silinirken hata oluştu');
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const { error } = await supabase
                .from('listings')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            setListings(listings.map(l => l.id === id ? { ...l, status: newStatus } : l));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Durum güncellenirken hata oluştu');
        }
    };

    // Filter and Search
    const filteredListings = listings.filter(listing => {
        const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            listing.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            listing.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || listing.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
    const paginatedListings = filteredListings.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    if (loading) {
        return <div className="p-8 text-center">İlanlar yükleniyor...</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold text-gray-900">İlan Yönetimi</h2>

                <div className="flex gap-4 w-full sm:w-auto">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="all">Tüm Durumlar</option>
                        <option value="active">Aktif</option>
                        <option value="sold">Satıldı</option>
                        <option value="pending">Beklemede</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Resim</th>
                            <th className="px-6 py-4">Başlık (No.)</th>
                            <th className="px-6 py-4">Satıcı (No.)</th>
                            <th className="px-6 py-4">Fiyat</th>
                            <th className="px-6 py-4">Durum</th>
                            <th className="px-6 py-4">Oluşturulma</th>
                            <th className="px-6 py-4 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedListings.map(listing => (
                            <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                        {listing.images && listing.images[0] ? (
                                            <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">📷</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 truncate max-w-xs" title={listing.title}>
                                        {listing.title}
                                    </div>
                                    <div className="text-xs text-gray-500 font-mono">
                                        Nr: {generateListingNumber(listing)}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">{listing.profiles?.full_name || 'Bilinmiyor'}</div>
                                    <div className="text-xs text-gray-500 font-mono">
                                        Nr: {listing.profiles?.user_number || '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium">
                                    {listing.price ? `${listing.price} ₺` : 'VB'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${listing.status === 'active' ? 'bg-green-100 text-green-800' :
                                        listing.status === 'sold' ? 'bg-gray-100 text-gray-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {listing.status === 'active' ? 'Aktif' :
                                            listing.status === 'sold' ? 'Satıldı' : listing.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(listing.created_at).toLocaleDateString('tr-TR')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => window.open(`/product/${listing.id}`, '_blank')}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                            title="Görüntüle"
                                        >
                                            👁️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(listing.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            title="Sil"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                    Gösterilen: {(page - 1) * itemsPerPage + 1} - {Math.min(page * itemsPerPage, filteredListings.length)} / {filteredListings.length}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                    >
                        Geri
                    </button>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                    >
                        İleri
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminListings;
