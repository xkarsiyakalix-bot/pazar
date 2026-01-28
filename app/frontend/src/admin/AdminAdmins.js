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


    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 rounded-full border-4 border-neutral-200 border-t-red-500 animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-neutral-900 tracking-tight">Yöneticiler</h1>
                    <p className="text-neutral-500 font-medium mt-1">Sistem yöneticilerini ve yetkilerini düzenleyin</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 hover:shadow-red-300 active:scale-95"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Yeni Yönetici Ekle
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50/50 border-b border-neutral-100 text-neutral-500 font-bold text-[11px] uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Yönetici Profili</th>
                                <th className="px-6 py-4">Yetki Seviyesi</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {admins.map(admin => (
                                <tr key={admin.id} className="hover:bg-neutral-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 border border-neutral-200 p-0.5 flex items-center justify-center overflow-hidden">
                                                {admin.avatar_url ? (
                                                    <img src={admin.avatar_url} alt="" className="w-full h-full object-cover rounded-full" />
                                                ) : (
                                                    <span className="text-sm font-bold text-neutral-500">{admin.email?.[0]?.toUpperCase()}</span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-neutral-900 text-sm">{admin.full_name || 'İsimsiz Yönetici'}</div>
                                                <div className="text-xs text-neutral-400">{admin.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {admin.user_number === 1001 ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                                Süper Yönetici
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-purple-50 text-purple-700 border border-purple-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                                Admin
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {admin.user_number !== 1001 && (
                                            <button
                                                onClick={() => handleToggleAdmin(admin, false)}
                                                className="px-4 py-2 bg-white text-red-600 border border-red-100 hover:bg-red-50 hover:border-red-200 rounded-xl text-xs font-bold transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                            >
                                                Yöneticiliği Kaldır
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {admins.length === 0 && !loading && (
                                <tr><td colSpan="3" className="p-8 text-center text-neutral-400 font-medium">Yönetici bulunamadı.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Admin Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg mx-4 border border-neutral-100 transform transition-all scale-100">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-display font-bold text-neutral-900">Yeni Yönetici Ekle</h3>
                                <p className="text-sm text-neutral-500 mt-1">E-posta adresi ile kullanıcı arayıp yetki verin.</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-full text-neutral-400 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <div className="relative mb-6">
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium"
                                placeholder="kullanici@ornek.com"
                                value={searchQuery}
                                autoFocus
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    searchUsers(e.target.value);
                                }}
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                        </div>

                        <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2 mb-2">
                            {searching && (
                                <div className="text-center py-8">
                                    <div className="inline-block w-6 h-6 border-2 border-neutral-200 border-t-red-500 rounded-full animate-spin"></div>
                                </div>
                            )}
                            {searchResults.map(user => (
                                <div key={user.id} className="flex justify-between items-center p-3 hover:bg-neutral-50 rounded-xl border border-transparent hover:border-neutral-100 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-500">
                                            {user.email?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-neutral-900">{user.email}</div>
                                            <div className="text-xs text-neutral-500">{user.full_name || 'İsimsiz'}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleToggleAdmin(user, true)}
                                        className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors"
                                    >
                                        Ekle
                                    </button>
                                </div>
                            ))}
                            {searchQuery.length > 2 && searchResults.length === 0 && !searching && (
                                <div className="text-center py-8 text-neutral-400 text-sm font-medium">Kriterlere uygun kullanıcı bulunamadı.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAdmins;
