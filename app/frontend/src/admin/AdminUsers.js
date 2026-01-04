import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import UserDetailsModal from './UserDetailsModal';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null); // For Modal
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
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Kullanıcılar yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    // Note: Supabase Auth management (ban/unban) usually requires service role key or specific RPCs.
    // For this demo, we'll assume a 'status' column in 'profiles' or just simulate it.
    // If you want to actually ban users from logging in, you'd need a backend function.
    const handleToggleStatus = async (user) => {
        const newStatus = user.status === 'banned' ? 'active' : 'banned';
        if (!window.confirm(`Bu kullanıcıyı ${newStatus === 'banned' ? 'engellemek' : 'engeli kaldırmak'} istediğinizden emin misiniz?`)) return;

        try {
            console.log(`Attempting to set status to ${newStatus} for user ${user.id}`);

            // Update and select the updated row to verify persistence
            const { data, error } = await supabase
                .from('profiles')
                .update({ status: newStatus })
                .eq('id', user.id)
                .select();

            if (error) throw error;

            // Verify if any row was actually updated
            if (!data || data.length === 0) {
                console.error('Update returned no data. RLS policy might be blocking the update.');
                throw new Error('Durumu değiştirme yetkisi yok (RLS Engeli).');
            }

            console.log('Update successful:', data);
            setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
            alert(`Kullanıcı ${newStatus === 'banned' ? 'engellendi' : 'engeli kaldırıldı'}`);
        } catch (error) {
            console.error('Error updating user status:', error);
            alert(`Hata: ${error.message || 'Durum güncellenemedi.'}`);
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

    // Filter and Search
    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    if (loading) {
        return <div className="p-8 text-center">Kullanıcılar yükleniyor...</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold text-gray-900">Kullanıcı Yönetimi</h2>

                <div className="w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="İsim veya e-posta ile ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Kullanıcı</th>
                            <th className="px-6 py-4">ID'ler</th>
                            <th className="px-6 py-4">Paket</th>
                            <th className="px-6 py-4">Durum</th>
                            <th className="px-6 py-4">Kayıt Tarihi</th>
                            <th className="px-6 py-4 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-gray-500 font-bold">{user.full_name?.charAt(0) || '?'}</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{user.full_name || 'Bilinmiyor'}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-mono font-bold text-gray-900">#{user.user_number || '-'}</span>
                                        <span className="font-mono text-[10px] text-gray-400" title={user.id}>{user.id?.substring(0, 8)}...</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    <div className={`flex flex-col gap-1`}>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] w-fit font-bold uppercase ${user.subscription_tier === 'unlimited' ? 'bg-purple-100 text-purple-700' :
                                            user.subscription_tier === 'pack2' ? 'bg-red-100 text-red-700' :
                                                user.subscription_tier === 'pack1' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-600'
                                            }`}>
                                            {user.subscription_tier || 'free'}
                                        </span>
                                        <span className={`text-[11px] ${user.is_commercial ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
                                            {user.is_commercial ? 'Kurumsal' : 'Bireysel'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === 'banned'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-green-100 text-green-800'
                                        }`}>
                                        {user.status === 'banned' ? 'Engellendi' : 'Aktif'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => setSelectedUser(user)}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                        >
                                            Detaylar
                                        </button>
                                        <button
                                            onClick={() => handleTogglePro(user)}
                                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${user.is_pro
                                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            title={user.is_pro ? 'PRO Statüsünü Kaldır' : 'PRO Yap'}
                                        >
                                            ⭐
                                        </button>
                                        <button
                                            onClick={() => handleToggleStatus(user)}
                                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${user.status === 'banned'
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                }`}
                                        >
                                            {user.status === 'banned' ? 'Engeli Kaldır' : 'Engelle'}
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
                    Gösterilen: {(page - 1) * itemsPerPage + 1} - {Math.min(page * itemsPerPage, filteredUsers.length)} / {filteredUsers.length}
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

            {/* User Details Modal */}
            {selectedUser && (
                <UserDetailsModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
};

export default AdminUsers;
