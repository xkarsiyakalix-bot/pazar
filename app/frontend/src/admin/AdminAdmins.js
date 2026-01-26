import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import UserDetailsModal from './UserDetailsModal';

const AdminAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // For searching users to add
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            // Simplify query to avoid schema cache errors
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Filter locally
            const adminUsers = (data || []).filter(u =>
                (u.user_number === 1001) || (u.is_admin === true)
            );

            setAdmins(adminUsers);
        } catch (error) {
            console.error('Error fetching admins:', error);
            // Fallback for safety
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_number', 1001);
            setAdmins(data || []);
        } finally {
            setLoading(false);
        }
    };

    const searchUsers = async (query) => {
        if (!query || query.length < 2) return;
        setSearching(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .ilike('email', `%${query}%`)
                .limit(5);

            if (error) throw error;
            // Filter out existing admins from results
            const nonAdmins = data.filter(u => !u.is_admin && u.user_number !== 1001);
            setSearchResults(nonAdmins);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setSearching(false);
        }
    };

    const handleToggleAdmin = async (user, isPromoting) => {
        const action = isPromoting ? 'Yönetici Yap' : 'Yöneticilikten Çıkar';
        if (!window.confirm(`${user.email} adlı kullanıcıyı ${action}mak istediğinizden emin misiniz?`)) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_admin: isPromoting })
                .eq('id', user.id);

            if (error) throw error;

            if (isPromoting) {
                setAdmins([...admins, { ...user, is_admin: true }]);
                setShowAddModal(false);
                setSearchQuery('');
                setSearchResults([]);
            } else {
                setAdmins(admins.filter(a => a.id !== user.id));
            }
            alert(`İşlem başarılı: ${user.email} ${isPromoting ? 'artık yönetici.' : 'artık yönetici değil.'}`);
        } catch (error) {
            console.error('Error updating admin status:', error);
            alert('Hata oluştu: ' + error.message);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Yöneticiler</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                    + Yeni Yönetici Ekle
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4">Kullanıcı</th>
                            <th className="px-6 py-4">Durum</th>
                            <th className="px-6 py-4 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {admins.map(admin => (
                            <tr key={admin.id}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                            {admin.email?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{admin.full_name}</div>
                                            <div className="text-gray-500 text-sm">{admin.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-bold">Admin</span>
                                    {admin.user_number === 1001 && <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">Süper Admin</span>}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {admin.user_number !== 1001 && (
                                        <button
                                            onClick={() => handleToggleAdmin(admin, false)}
                                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                                        >
                                            Yöneticilikten Çıkar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {admins.length === 0 && !loading && (
                            <tr><td colSpan="3" className="p-8 text-center text-gray-500">Yönetici bulunamadı.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Admin Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Yeni Yönetici Ekle</h3>
                        <p className="text-sm text-gray-500 mb-4">E-posta adresi ile kullanıcı arayın.</p>

                        <input
                            type="text"
                            className="w-full border p-2 rounded mb-4"
                            placeholder="ornek@email.com"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                searchUsers(e.target.value);
                            }}
                        />

                        <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
                            {searching && <div className="text-center text-gray-400">Aranıyor...</div>}
                            {searchResults.map(user => (
                                <div key={user.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200">
                                    <div className="text-sm">
                                        <div className="font-bold">{user.email}</div>
                                        <div className="text-gray-500">{user.full_name}</div>
                                    </div>
                                    <button
                                        onClick={() => handleToggleAdmin(user, true)}
                                        className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700"
                                    >
                                        Ekle
                                    </button>
                                </div>
                            ))}
                            {searchQuery.length > 2 && searchResults.length === 0 && !searching && (
                                <div className="text-center text-gray-500 text-sm">Kullanıcı bulunamadı.</div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">Kapat</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAdmins;
