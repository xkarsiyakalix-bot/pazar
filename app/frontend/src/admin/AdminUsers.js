import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { supabase } from '../lib/supabase';
import UserDetailsModal from './UserDetailsModal';
import { getSellerUrl } from '../utils/slug';

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null); // For Modal
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'verified', 'admin', 'pro', 'banned'
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

    const handleToggleVerified = async (user) => {
        const newVerifiedStatus = !user.is_verified;
        if (!window.confirm(`Bu satıcıyı ${newVerifiedStatus ? 'doğrulanmış olarak işaretlemek' : 'doğrulanmış statüsünden çıkarmak'} istediğinizden emin misiniz?`)) return;

        try {
            const updateData = {
                is_verified: newVerifiedStatus,
                verification_date: newVerifiedStatus ? new Date().toISOString() : null,
                verification_notes: newVerifiedStatus ? 'Admin tarafından doğrulandı' : null
            };

            const { error } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', user.id);

            if (error) throw error;
            setUsers(users.map(u => u.id === user.id ? { ...u, ...updateData } : u));
            alert(`Satıcı ${newVerifiedStatus ? 'doğrulandı (Mavi Tik Eklendi)' : 'doğrulanmış statüsünden çıkarıldı'}`);
        } catch (error) {
            console.error('Error updating verified status:', error);
            alert(`Hata: ${error.message}`);
        }
    };

    // Filter and Search
    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        // Apply active filter
        let matchesFilter = true;
        if (activeFilter === 'verified') {
            matchesFilter = user.is_verified === true;
        } else if (activeFilter === 'admin') {
            matchesFilter = user.is_admin === true;
        } else if (activeFilter === 'pro') {
            matchesFilter = user.is_pro === true;
        } else if (activeFilter === 'banned') {
            matchesFilter = user.status === 'banned';
        } else if (activeFilter === 'commercial') {
            matchesFilter = user.is_commercial === true;
        }

        return matchesSearch && matchesFilter;
    });

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="medium" />
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-neutral-50 tracking-tight transition-colors duration-300">Kullanıcı Yönetimi</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 font-medium mt-1">Sistemdeki tüm kullanıcıları görüntüleyin ve yönetin</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="bg-white dark:bg-neutral-900 p-1 rounded-xl shadow-sm border border-neutral-200 dark:border-white/10 flex transition-colors duration-300">
                        <button
                            onClick={() => setActiveFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeFilter === 'all'
                                ? 'bg-neutral-900 dark:bg-neutral-700 text-white shadow-md'
                                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                                }`}
                        >
                            Tümü
                        </button>
                        <button
                            onClick={() => setActiveFilter('active')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeFilter === 'active'
                                ? 'bg-neutral-900 dark:bg-neutral-700 text-white shadow-md'
                                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                                }`}
                        >
                            Aktif
                        </button>
                        <button
                            onClick={() => setActiveFilter('banned')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeFilter === 'banned'
                                ? 'bg-neutral-900 dark:bg-neutral-700 text-white shadow-md'
                                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                                }`}
                        >
                            Yasaklı
                        </button>
                    </div>

                    <div className="relative group flex-1 md:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-neutral-400 group-focus-within:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="İsim veya e-posta ile ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-xl text-sm placeholder-neutral-400 focus:outline-none focus:border-red-500 dark:focus:border-red-700 focus:ring-4 focus:ring-red-500/10 dark:focus:ring-red-900/20 transition-all shadow-sm group-hover:border-neutral-300 dark:group-hover:border-white/20 text-neutral-900 dark:text-neutral-50"
                        />
                    </div>
                </div>
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm border ${activeFilter === 'all'
                        ? 'bg-neutral-900 dark:bg-neutral-700 text-white border-neutral-900 dark:border-neutral-600 shadow-md'
                        : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Tüm Kullanıcılar ({users.length})
                    </span>
                </button>

                <button
                    onClick={() => setActiveFilter('verified')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm border ${activeFilter === 'verified'
                        ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                        : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-900/30 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Doğrulanmış ({users.filter(u => u.is_verified).length})
                    </span>
                </button>

                <button
                    onClick={() => setActiveFilter('admin')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm border ${activeFilter === 'admin'
                        ? 'bg-purple-500 text-white border-purple-500 shadow-md'
                        : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-900/30 hover:bg-purple-50 dark:hover:bg-purple-950/30'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Yöneticiler ({users.filter(u => u.is_admin).length})
                    </span>
                </button>

                <button
                    onClick={() => setActiveFilter('pro')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm border ${activeFilter === 'pro'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                        : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-white/10 hover:border-amber-300 dark:hover:border-amber-900/30 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.049 2.927c.3-0.921 1.603-0.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-0.363 1.118l1.518 4.674c.3.922-0.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-0.783.57-1.838-0.197-1.538-1.118l1.518-4.674a1 1 0 00-0.363-1.118l-3.976-2.888c-0.784-0.57-0.38-1.81.588-1.81h4.914a1 1 0 00.951-0.69l1.519-4.674z" />
                        </svg>
                        PRO Kullanıcılar ({users.filter(u => u.is_pro).length})
                    </span>
                </button>

                <button
                    onClick={() => setActiveFilter('commercial')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm border ${activeFilter === 'commercial'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-900/30 hover:bg-indigo-50 dark:hover:bg-indigo-950/30'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        🏢 Kurumsal ({users.filter(u => u.is_commercial).length})
                    </span>
                </button>

                <button
                    onClick={() => setActiveFilter('banned')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm border ${activeFilter === 'banned'
                        ? 'bg-red-600 text-white border-red-600 shadow-md'
                        : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-white/10 hover:border-red-300 dark:hover:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/30'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        Engelliler ({users.filter(u => u.status === 'banned').length})
                    </span>
                </button>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-100 dark:border-white/5 overflow-hidden transition-colors duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50/50 dark:bg-neutral-950/50 border-b border-neutral-100 dark:border-white/5 text-neutral-500 dark:text-neutral-400 font-bold text-[11px] uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Kullanıcı Profili</th>
                                <th className="px-6 py-4">Sistem ID'leri</th>
                                <th className="px-6 py-4">Abonelik & Tür</th>
                                <th className="px-6 py-4 text-center">Hesap Durumu</th>
                                <th className="px-6 py-4">Kayıt Tarihi</th>
                                <th className="px-6 py-4">Son Görülme</th>
                                <th className="px-6 py-4 text-right">Hızlı İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50 dark:divide-white/5">
                            {paginatedUsers.map(user => (
                                <tr key={user.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                onClick={() => navigate(getSellerUrl(user))}
                                                className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200 dark:border-white/10 p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                                                title="Profile Git"
                                            >
                                                {user.store_logo || user.avatar_url ? (
                                                    <img src={user.store_logo || user.avatar_url} alt="" className="w-full h-full object-cover rounded-full" />
                                                ) : (
                                                    <span className="text-sm font-bold text-neutral-500 dark:text-neutral-400">{user.full_name?.charAt(0) || '?'}</span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div
                                                    onClick={() => navigate(getSellerUrl(user))}
                                                    className="font-bold text-neutral-900 dark:text-neutral-100 text-sm truncate cursor-pointer hover:text-blue-600 transition-colors"
                                                >
                                                    {user.full_name || 'İsimsiz Kullanıcı'}
                                                </div>
                                                <div className="text-xs text-neutral-400 dark:text-neutral-500 truncate">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">NO:</span>
                                                <span className="font-mono text-sm font-medium text-neutral-700 dark:text-neutral-300">{user.user_number || '-'}</span>
                                            </div>
                                            <span className="font-mono text-[10px] text-neutral-300 dark:text-neutral-600" title={user.id}>ID: {user.id?.substring(0, 8)}...</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5 items-start">
                                            {(() => {
                                                // Abonelik aktif mi kontrol et
                                                const isSubscriptionActive = user.subscription_expiry
                                                    ? new Date(user.subscription_expiry) > new Date()
                                                    : false;

                                                // Paket bitmiş ise tier'ı gösterme, standart göster
                                                const displayTier = isSubscriptionActive ? user.subscription_tier : 'free';

                                                return (
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-colors duration-300 ${displayTier === 'unlimited' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-900/30' :
                                                            displayTier === 'pack2' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/30' :
                                                                displayTier === 'pack1' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/30' :
                                                                    'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-white/10'
                                                        }`}>
                                                        {displayTier === 'unlimited' ? 'Sınırsız' :
                                                            displayTier === 'pack2' ? 'Pro Paket' :
                                                                displayTier === 'pack1' ? 'Başlangıç' : 'Standart'}
                                                    </span>
                                                );
                                            })()}
                                            {user.subscription_expiry && (
                                                <span className={`text-[10px] font-medium ${new Date(user.subscription_expiry) > new Date()
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-red-600 dark:text-red-400'
                                                    }`}>
                                                    {new Date(user.subscription_expiry) > new Date() ? '✓' : '✗'} Bitiş: {new Date(user.subscription_expiry).toLocaleDateString('tr-TR')}
                                                </span>
                                            )}
                                            <div className="flex items-center gap-1.5">
                                                {(() => {
                                                    // Abonelik aktif mi kontrol et
                                                    const isSubscriptionActive = user.subscription_expiry
                                                        ? new Date(user.subscription_expiry) > new Date()
                                                        : false;

                                                    return (
                                                        <>
                                                            {user.is_commercial && isSubscriptionActive ? (
                                                                <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-900/30">
                                                                    🏢 Kurumsal
                                                                </span>
                                                            ) : !user.is_commercial ? (
                                                                <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 px-1.5">Bireysel</span>
                                                            ) : null}
                                                            {user.is_pro && isSubscriptionActive && <span className="text-[10px] font-bold text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded border border-amber-100 dark:border-amber-900/30">⭐ PRO</span>}
                                                            {user.is_verified && (
                                                                <span className="flex items-center gap-1 text-[10px] font-bold text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-900/30" title="Doğrulanmış Satıcı">
                                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                                    </svg>
                                                                    Doğrulanmış
                                                                </span>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                                {user.is_admin && (
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-1.5 py-0.5 rounded border border-purple-100 dark:border-purple-900/30" title="Yönetici">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                        </svg>
                                                        Yönetici
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-colors duration-300 ${user.status === 'banned'
                                            ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/30'
                                            : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/30'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.status === 'banned' ? 'bg-red-500' : 'bg-green-500'
                                                }`}></span>
                                            {user.status === 'banned' ? 'Engelli' : 'Aktif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                                                {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                            </span>
                                            <span className="text-xs text-neutral-400 dark:text-neutral-500">
                                                {new Date(user.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            {user.last_seen ? (
                                                <>
                                                    <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                                                        {new Date(user.last_seen).toLocaleDateString('tr-TR')}
                                                    </span>
                                                    <span className="text-xs text-neutral-400 dark:text-neutral-500">
                                                        {new Date(user.last_seen).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500">-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 transition-opacity duration-200">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="p-2 text-neutral-400 dark:text-neutral-500 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-100 dark:hover:border-blue-900/30 rounded-xl transition-all shadow-sm"
                                                title="Detayları Görüntüle"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                            </button>

                                            <button
                                                onClick={() => handleTogglePro(user)}
                                                className={`p-2 rounded-xl transition-all shadow-sm border ${user.is_pro
                                                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                                                    : 'text-neutral-400 dark:text-neutral-500 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:border-amber-100 dark:hover:border-amber-900/30'
                                                    }`}
                                                title={user.is_pro ? 'PRO Statüsünü Kaldır' : 'PRO Yap'}
                                            >
                                                <svg className="w-4 h-4" fill={user.is_pro ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-0.921 1.603-0.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-0.363 1.118l1.518 4.674c.3.922-0.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-0.783.57-1.838-0.197-1.538-1.118l1.518-4.674a1 1 0 00-0.363-1.118l-3.976-2.888c-0.784-0.57-0.38-1.81.588-1.81h4.914a1 1 0 00.951-0.69l1.519-4.674z"></path></svg>
                                            </button>

                                            <button
                                                onClick={() => handleToggleVerified(user)}
                                                className={`p-2 rounded-xl transition-all shadow-sm border ${user.is_verified
                                                    ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/40'
                                                    : 'text-neutral-400 dark:text-neutral-500 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-100 dark:hover:border-blue-900/30'
                                                    }`}
                                                title={user.is_verified ? 'Doğrulanmış Statüsünü Kaldır' : 'Doğrulanmış Olarak İşaretle (Mavi Tik)'}
                                            >
                                                <svg className="w-4 h-4" fill={user.is_verified ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </button>

                                            <button
                                                onClick={() => handleToggleStatus(user)}
                                                className={`p-2 rounded-xl transition-all shadow-sm border ${user.status === 'banned'
                                                    ? 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/40'
                                                    : 'text-neutral-400 dark:text-neutral-500 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-100 dark:hover:border-red-900/30'
                                                    }`}
                                                title={user.status === 'banned' ? 'Engeli Kaldır' : 'Kullanıcıyı Engelle'}
                                            >
                                                {user.status === 'banned' ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                                                )}
                                            </button>

                                            <button
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm(`${user.full_name} kullanıcısına +1 ek ilan hakkı vermek istiyor musunuz?`)) {
                                                        try {
                                                            const currentExtra = user.extra_paid_listings || 0;
                                                            const { error } = await supabase
                                                                .from('profiles')
                                                                .update({ extra_paid_listings: currentExtra + 1 })
                                                                .eq('id', user.id);
                                                            if (error) throw error;
                                                            setUsers(users.map(u => u.id === user.id ? { ...u, extra_paid_listings: currentExtra + 1 } : u));
                                                            alert('Başarıyla +1 ilan hakkı eklendi!');
                                                        } catch (err) {
                                                            alert('Hata: ' + err.message);
                                                        }
                                                    }
                                                }}
                                                className="p-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-all shadow-sm"
                                                title="+1 İlan Hakkı Ekle"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </button>

                                            {!user.is_admin && user.user_number !== 1001 && (
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm(`${user.email} kullanıcısını yönetici yapmak istiyor musunuz?`)) {
                                                            try {
                                                                const { error } = await supabase.from('profiles').update({ is_admin: true }).eq('id', user.id);
                                                                if (error) throw error;
                                                                alert('Kullanıcı yönetici yapıldı! Yöneticiler sayfasından yönetebilirsiniz.');
                                                                setUsers(users.map(u => u.id === user.id ? { ...u, is_admin: true } : u));
                                                            } catch (error) {
                                                                console.error('Error making admin:', error);
                                                                alert('Hata: ' + error.message);
                                                            }
                                                        }
                                                    }}
                                                    className="p-2 text-neutral-400 dark:text-neutral-500 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:border-purple-100 dark:hover:border-purple-900/30 rounded-xl transition-all shadow-sm"
                                                    title="Yönetici Yap"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-0.133-2.052-0.382-3.016z"></path></svg>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paginatedUsers.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-16 text-center text-neutral-400 dark:text-neutral-500 transition-colors duration-300">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-neutral-300 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                            </div>
                                            <p className="font-medium text-neutral-500 dark:text-neutral-400">Kriterlere uygun kullanıcı bulunamadı.</p>
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
                            Gösterilen: {(page - 1) * itemsPerPage + 1} - {Math.min(page * itemsPerPage, filteredUsers.length)} / {filteredUsers.length}
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
