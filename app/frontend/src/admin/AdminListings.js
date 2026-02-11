import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
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

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="medium" />
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-neutral-50 tracking-tight transition-colors duration-300">İlan Yönetimi</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 font-medium mt-1">Platformdaki tüm ilanları inceleyin ve yönetin</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="appearance-none bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 dark:focus:border-red-700 dark:focus:ring-red-900/20 text-sm font-bold shadow-sm cursor-pointer hover:border-neutral-300 dark:hover:border-white/20 transition-all"
                        >
                            <option value="all" className="dark:bg-neutral-900">Tüm Durumlar</option>
                            <option value="active" className="dark:bg-neutral-900">Yayında</option>
                            <option value="sold" className="dark:bg-neutral-900">Satıldı</option>
                            <option value="pending" className="dark:bg-neutral-900">Onay Bekleyen</option>
                            <option value="inactive" className="dark:bg-neutral-900">Pasif</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500 dark:text-neutral-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>

                    <div className="relative group w-full sm:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-neutral-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="İlan başlığı, satıcı veya no ile ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-xl text-sm text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 focus:outline-none focus:border-red-500 dark:focus:border-red-700 focus:ring-4 focus:ring-red-500/10 dark:focus:ring-red-900/20 transition-all shadow-sm group-hover:border-neutral-300 dark:group-hover:border-white/20"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-100 dark:border-white/5 overflow-hidden transition-colors duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50/50 dark:bg-neutral-950/50 border-b border-neutral-100 dark:border-white/5 text-neutral-500 dark:text-neutral-400 font-bold text-[11px] uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">İlan Görseli</th>
                                <th className="px-6 py-4">İlan Detayı</th>
                                <th className="px-6 py-4">Satıcı Bilgisi</th>
                                <th className="px-6 py-4">Fiyat</th>
                                <th className="px-6 py-4 text-center">Durum</th>
                                <th className="px-6 py-4">Yayın Tarihi</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50 dark:divide-white/5">
                            {paginatedListings.map(listing => (
                                <tr key={listing.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div
                                            onClick={() => window.open(`/product/${listing.id}`, '_blank')}
                                            className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden border border-neutral-200 dark:border-white/10 shadow-sm relative group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                            title="İlanı Görüntüle"
                                        >
                                            {listing.images && listing.images[0] ? (
                                                <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-neutral-300 dark:text-neutral-600">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h0.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-[240px]">
                                            <div
                                                onClick={() => window.open(`/product/${listing.id}`, '_blank')}
                                                className="font-bold text-neutral-900 dark:text-neutral-100 truncate mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                title={listing.title}
                                            >
                                                {listing.title}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 px-1.5 py-0.5 rounded font-mono border border-neutral-200 dark:border-white/5">
                                                    #{generateListingNumber(listing)}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center text-xs font-bold text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-white/10">
                                                {listing.profiles?.full_name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-neutral-900 dark:text-neutral-200 text-sm">{listing.profiles?.full_name || 'Bilinmiyor'}</div>
                                                <div className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono tracking-wide">#{listing.profiles?.user_number || '-'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-display font-bold text-neutral-900 dark:text-neutral-100">
                                            {listing.price ? listing.price.toLocaleString('tr-TR') : '0'}
                                            <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400 ml-1"> TL</span>
                                        </span>
                                        {!listing.price && <span className="text-xs text-neutral-400 dark:text-neutral-500 block mt-0.5">Fiyat Belirtilmedi</span>}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${listing.status === 'active' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/30' :
                                            listing.status === 'sold' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-white/10' :
                                                'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/30'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${listing.status === 'active' ? 'bg-green-500' :
                                                listing.status === 'sold' ? 'bg-neutral-500' :
                                                    'bg-amber-500'
                                                }`}></span>
                                            {listing.status === 'active' ? 'Yayında' :
                                                listing.status === 'sold' ? 'Satıldı' : listing.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                                                {new Date(listing.created_at).toLocaleDateString('tr-TR')}
                                            </span>
                                            <span className="text-xs text-neutral-400 dark:text-neutral-500">
                                                {new Date(listing.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                onClick={() => window.open(`/product/${listing.id}`, '_blank')}
                                                className="p-2 text-neutral-400 dark:text-neutral-500 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-100 dark:hover:border-blue-900/30 rounded-xl transition-all shadow-sm"
                                                title="İlanı Görüntüle"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(listing.id)}
                                                className="p-2 text-neutral-400 dark:text-neutral-500 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-100 dark:hover:border-red-900/30 rounded-xl transition-all shadow-sm"
                                                title="İlanı Sil"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-0.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {paginatedListings.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-16 text-center text-neutral-400 dark:text-neutral-500 transition-colors duration-300">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-neutral-300 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                            </div>
                                            <p className="font-medium text-neutral-500 dark:text-neutral-400">Kriterlere uygun ilan bulunamadı.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="p-4 border-t border-neutral-100 dark:border-white/5 flex justify-between items-center bg-neutral-50/30 dark:bg-neutral-950/30 transition-colors duration-300">
                        <div className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide px-2">
                            Gösterilen: {(page - 1) * itemsPerPage + 1} - {Math.min(page * itemsPerPage, filteredListings.length)} / {filteredListings.length}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 rounded-xl text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                Önceki
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 rounded-xl text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                Sonraki
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminListings;
