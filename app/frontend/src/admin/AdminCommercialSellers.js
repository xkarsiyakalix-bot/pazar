import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import UserDetailsModal from './UserDetailsModal';

const AdminCommercialSellers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .or('is_pro.eq.true,is_commercial.eq.true')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching commercial users:', error);
            alert(`Kurumsal satıcılar yüklenirken hata oluştu: ${error.message || error}`);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (user) => {
        const newStatus = user.status === 'banned' ? 'active' : 'banned';
        if (!window.confirm(`Bu mağazayı ${newStatus === 'banned' ? 'engellemek' : 'engeli kaldırmak'} istediğinizden emin misiniz?`)) return;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({ status: newStatus })
                .eq('id', user.id)
                .select();

            if (error) throw error;
            setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
            alert(`Mağaza ${newStatus === 'banned' ? 'engellendi' : 'engeli kaldırıldı'}`);
        } catch (error) {
            console.error('Error updating user status:', error);
            alert(`Hata: ${error.message}`);
        }
    };

    const handleTogglePro = async (user) => {
        const newProStatus = !user.is_pro;
        if (!window.confirm(`Bu kullanıcıyı PRO ${newProStatus ? 'yapmak' : 'statüsünden çıkarmak'} istediğinizden emin misiniz?`)) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_pro: newProStatus })
                .eq('id', user.id);

            if (error) throw error;
            setUsers(users.map(u => u.id === user.id ? { ...u, is_pro: newProStatus } : u));
            alert(`Kullanıcı PRO ${newProStatus ? 'yapıldı' : 'statüsünden çıkarıldı'}`);
        } catch (error) {
            console.error('Error updating PRO status:', error);
            alert(`Hata: ${error.message}`);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (user.store_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 rounded-full border-4 border-neutral-200 border-t-red-500 animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-neutral-900 tracking-tight">Kurumsal Satıcılar</h1>
                    <p className="text-neutral-500 font-medium mt-1">Platformdaki tüm ticari ve mağaza hesaplarını yönetin</p>
                </div>

                <div className="relative group w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-neutral-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Mağaza adı, sahip veya e-posta..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm placeholder-neutral-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all shadow-sm group-hover:border-neutral-300"
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50/50 border-b border-neutral-100 text-neutral-500 font-bold text-[11px] uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Mağaza Bilgileri</th>
                                <th className="px-6 py-4">Üyelik Tipi & Durum</th>
                                <th className="px-6 py-4">Kayıt Tarihi</th>
                                <th className="px-6 py-4 text-right">Hızlı İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {paginatedUsers.map(user => (
                                <tr key={user.id} className="hover:bg-neutral-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200 shadow-sm p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                                                {user.store_logo ? (
                                                    <img src={user.store_logo} alt="" className="w-full h-full object-cover rounded-[10px]" />
                                                ) : (
                                                    <div className="text-xl">🏪</div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-neutral-900 group-hover:text-red-600 transition-colors truncate">
                                                    {user.store_name || user.full_name || 'İsimsiz Mağaza'}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                                                    <span className="flex items-center gap-1 truncate max-w-[120px]" title={user.full_name}>
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                                        {user.full_name}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                                                    <span className="truncate max-w-[150px]" title={user.email}>{user.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-2 items-start">
                                            <div className="flex items-center gap-1.5">
                                                {user.is_pro && (
                                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-bold rounded shadow-sm shadow-red-200">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                        PRO
                                                    </span>
                                                )}
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${user.is_commercial
                                                        ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                        : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                                                    }`}>
                                                    {user.is_commercial ? 'Kurumsal' : 'Şahıs'}
                                                </span>
                                            </div>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${user.status === 'banned'
                                                    ? 'bg-red-50 text-red-700 border-red-100'
                                                    : 'bg-green-50 text-green-700 border-green-100'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.status === 'banned' ? 'bg-red-500' : 'bg-green-500'
                                                    }`}></span>
                                                {user.status === 'banned' ? 'Engelli' : 'Aktif'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-neutral-600">
                                                {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                            </span>
                                            <span className="text-xs text-neutral-400">
                                                {new Date(user.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="p-2 text-neutral-400 bg-white border border-neutral-200 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 rounded-xl transition-all shadow-sm"
                                                title="Detayları Görüntüle"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                            </button>

                                            <button
                                                onClick={() => handleTogglePro(user)}
                                                className={`p-2 rounded-xl transition-all shadow-sm border ${user.is_pro
                                                        ? 'text-amber-500 bg-amber-50 border-amber-100 hover:bg-amber-100'
                                                        : 'text-neutral-400 bg-white border-neutral-200 hover:text-amber-500 hover:bg-amber-50 hover:border-amber-100'
                                                    }`}
                                                title={user.is_pro ? 'PRO Statüsünü Kaldır' : 'PRO Yap'}
                                            >
                                                <svg className="w-4 h-4" fill={user.is_pro ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                                            </button>

                                            <button
                                                onClick={() => handleToggleStatus(user)}
                                                className={`p-2 rounded-xl transition-all shadow-sm border ${user.status === 'banned'
                                                        ? 'text-green-600 bg-green-50 border-green-100 hover:bg-green-100'
                                                        : 'text-neutral-400 bg-white border-neutral-200 hover:text-red-600 hover:bg-red-50 hover:border-red-100'
                                                    }`}
                                                title={user.status === 'banned' ? 'Engeli Kaldır' : 'Mağazayı Engelle'}
                                            >
                                                {user.status === 'banned' ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paginatedUsers.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center text-neutral-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                            </div>
                                            <p className="font-medium">Herhangi bir kurumsal satıcı bulunamadı.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="p-4 border-t border-neutral-100 flex justify-between items-center bg-neutral-50/30">
                        <div className="text-xs font-bold text-neutral-400 uppercase tracking-wide px-2">
                            GÖSTERİLEN: {(page - 1) * itemsPerPage + 1} - {Math.min(page * itemsPerPage, filteredUsers.length)} / {filteredUsers.length}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                Önceki
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                Sonraki
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {selectedUser && (
                <UserDetailsModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
};

export default AdminCommercialSellers;
