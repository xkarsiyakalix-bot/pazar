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

    if (loading) {
        return <div className="p-8 text-center text-gray-500 italic">Kurumsal satıcılar yükleniyor...</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-gray-50 to-white">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span>🏪</span> Kurumsal Satıcı Yönetimi
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">PRO ve Ticari hesap tipindeki tüm mağazalar listelenir.</p>
                </div>

                <div className="w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Mağaza adı, sahip veya e-posta..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 font-bold text-[10px] uppercase tracking-widest border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">Mağaza / Sahibi</th>
                            <th className="px-6 py-4">Durum / Tip</th>
                            <th className="px-6 py-4">Kayıt Tarihi</th>
                            <th className="px-6 py-4 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                                            {user.store_logo ? (
                                                <img src={user.store_logo} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xl">🏪</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 group-hover:text-red-100 transition-colors">
                                                {user.store_name || user.full_name || 'İsimsiz Mağaza'}
                                            </div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                <span>👤</span> {user.full_name}
                                                <span className="text-gray-300">|</span>
                                                <span>✉️</span> {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex gap-2">
                                            {user.is_pro && (
                                                <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-black rounded uppercase tracking-tighter shadow-sm">PRO</span>
                                            )}
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${user.is_commercial ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {user.is_commercial ? 'Ticari' : 'Şahsi'}
                                            </span>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase ${user.status === 'banned' ? 'text-red-500' : 'text-green-500'
                                            }`}>
                                            ● {user.status === 'banned' ? 'Engellendi' : 'Aktif'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => setSelectedUser(user)}
                                            className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-gray-900 hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
                                            title="Detaylar"
                                        >
                                            👁️
                                        </button>
                                        <button
                                            onClick={() => handleTogglePro(user)}
                                            className={`p-2 rounded-lg transition-all border ${user.is_pro
                                                ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                                                : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
                                                }`}
                                            title={user.is_pro ? 'PRO Statüsünü Kaldır' : 'PRO Yap'}
                                        >
                                            ⭐
                                        </button>
                                        <button
                                            onClick={() => handleToggleStatus(user)}
                                            className={`p-2 rounded-lg transition-all border ${user.status === 'banned'
                                                ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'
                                                : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                                                }`}
                                            title={user.status === 'banned' ? 'Engeli Kaldır' : 'Engelle'}
                                        >
                                            {user.status === 'banned' ? '🔓' : '🚫'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {paginatedUsers.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-gray-400 italic">
                                    Herhangi bir kurumsal satıcı bulunamadı.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        SAFA {page} / {totalPages}
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl bg-white disabled:opacity-30 hover:bg-gray-50 transition-all font-bold"
                        >
                            ←
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl bg-white disabled:opacity-30 hover:bg-gray-50 transition-all font-bold"
                        >
                            →
                        </button>
                    </div>
                </div>
            )}

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
