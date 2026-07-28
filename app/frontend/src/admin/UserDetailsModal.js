import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { generateListingNumber } from '../components';
import LoadingSpinner from '../components/LoadingSpinner';
import { getSellerUrl } from '../utils/slug';

const UserDetailsModal = ({ user: initialUser, onClose }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(initialUser);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Store state for editing
    const [editData, setEditData] = useState({
        store_name: initialUser?.store_name || '',
        store_description: initialUser?.store_description || '',
        is_pro: initialUser?.is_pro || false,
        is_commercial: initialUser?.is_commercial || false,
        subscription_tier: initialUser?.subscription_tier || 'free',
        extra_paid_listings: initialUser?.extra_paid_listings || 0
    });

    useEffect(() => {
        if (initialUser) {
            setUser(initialUser);
            setEditData({
                store_name: initialUser.store_name || '',
                store_description: initialUser.store_description || '',
                is_pro: initialUser.is_pro || false,
                is_commercial: initialUser.is_commercial || false,
                subscription_tier: initialUser.subscription_tier || 'free',
                extra_paid_listings: initialUser.extra_paid_listings || 0
            });
            fetchUserListings();
        }
    }, [initialUser]);

    const fetchUserListings = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('listings')
                .select('*')
                .eq('user_id', initialUser.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setListings(data || []);
        } catch (error) {
            console.error('Error fetching user listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveStoreInfo = async () => {
        setSaving(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(editData)
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;
            setUser(data);
            alert('Kullanıcı bilgileri başarıyla güncellendi');
        } catch (error) {
            console.error('Error saving user info:', error);
            alert('Hata: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (!user) return null;

    const isCommercialOrPro = editData.is_commercial || editData.is_pro;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-neutral-100 dark:border-white/5">
                {/* Header */}
                <div className="p-6 border-b border-neutral-100 dark:border-white/5 flex justify-between items-center bg-neutral-50 dark:bg-neutral-950/50 transition-colors duration-300">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">Kullanıcı Detayları</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full transition-colors text-neutral-500 dark:text-neutral-400"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* User Profile Info */}
                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                        {/* Avatar & Basic Info */}
                        <div className="flex flex-col items-center text-center md:w-1/3">
                            <div className="relative group/profile">
                                {/* Main Profile Image (Store Logo or Avatar) */}
                                <div
                                    onClick={() => navigate(getSellerUrl(user), { state: { seller: user } })}
                                    className="w-32 h-32 rounded-full bg-neutral-50 dark:bg-neutral-800 mb-4 overflow-hidden border-4 border-white dark:border-neutral-800 shadow-xl cursor-pointer hover:ring-4 hover:ring-blue-100 dark:hover:ring-blue-900/30 transition-all relative"
                                    title={(user.is_pro || user.is_commercial || user.store_slug) ? "Mağazayı Gör" : "Profili Gör"}
                                >
                                    {user.store_logo || user.avatar_url ? (
                                        <img
                                            src={user.store_logo || user.avatar_url}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl font-black text-slate-300">
                                            {user.full_name?.charAt(0) || '?'}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/profile:opacity-100 transition-opacity">
                                        <span className="text-white text-xs font-bold">
                                            {(user.is_pro || user.is_commercial || user.store_slug) ? 'Mağazayı Gör' : 'Profili Gör'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-2 flex flex-col items-center">
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{user.full_name}</h2>
                                {user.store_name && (
                                    <p className="text-blue-600 dark:text-blue-400 font-bold text-sm">🏪 {user.store_name}</p>
                                )}
                                <p className="text-neutral-500 dark:text-neutral-400 mb-2">{user.email}</p>
                                <button
                                    onClick={() => navigate(getSellerUrl(user), { state: { seller: user } })}
                                    className="mt-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center gap-2 border border-blue-100 dark:border-blue-900/30"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    {(user.is_pro || user.is_commercial || user.store_slug) ? 'Mağazayı Gör' : 'Profili Gör'}
                                </button>
                            </div>
                            <div className="flex flex-wrap justify-center gap-2 mt-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.is_commercial ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300'}`}>
                                    {user.is_commercial ? 'Ticari' : 'Şahsi'}
                                </span>
                                {user.is_pro && (
                                    <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-bold shadow-sm">
                                        PRO
                                    </span>
                                )}
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.status === 'banned' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'}`}>
                                    {user.status === 'banned' ? 'Engelli' : 'Aktif'}
                                </span>
                            </div>
                        </div>

                        {/* Detailed Stats & Quick Actions */}
                        <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-neutral-50 dark:bg-neutral-950/50 p-4 rounded-xl border border-neutral-100 dark:border-white/5">
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Kullanıcı No.</div>
                                    <div className="text-lg font-mono font-bold text-neutral-900 dark:text-neutral-200">{user.user_number || '-'}</div>
                                    <div className="text-xs text-neutral-400 dark:text-neutral-600 font-mono mt-1 break-all" title={user.id}>{user.id}</div>
                                </div>
                                <div className="bg-neutral-50 dark:bg-neutral-950/50 p-4 rounded-xl border border-neutral-100 dark:border-white/5">
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Kayıt Tarihi</div>
                                    <div className="text-lg font-bold text-neutral-900 dark:text-neutral-200">{new Date(user.created_at).toLocaleDateString('tr-TR')}</div>
                                </div>
                                <div className="bg-neutral-50 dark:bg-neutral-950/50 p-4 rounded-xl border border-neutral-100 dark:border-white/5">
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Toplam İlan</div>
                                    <div className="text-lg font-bold text-neutral-900 dark:text-neutral-200">{listings.length}</div>
                                </div>
                                <div className="bg-neutral-50 dark:bg-neutral-950/50 p-4 rounded-xl border border-neutral-100 dark:border-white/5">
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Aktif İlanlar</div>
                                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                        {listings.filter(l => l.status === 'active').length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subscription & Quota Section - Available for All Users */}
                    <div className="mb-8 p-6 bg-neutral-50/50 dark:bg-neutral-950/20 rounded-2xl border border-neutral-200 dark:border-white/10 transition-colors duration-300">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <h4 className="text-lg font-black text-neutral-900 dark:text-neutral-50 flex items-center gap-2 uppercase tracking-tight">
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Abonelik & Kontenjan Yönetimi
                            </h4>
                            <div className="flex items-center gap-4 py-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editData.is_pro}
                                        onChange={(e) => setEditData({ ...editData, is_pro: e.target.checked })}
                                        className="w-5 h-5 text-red-600 rounded bg-white dark:bg-neutral-800 border-neutral-300 dark:border-white/10 focus:ring-red-500"
                                    />
                                    <span className="font-bold text-neutral-900 dark:text-neutral-200">PRO Üyelik</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editData.is_commercial}
                                        onChange={(e) => setEditData({ ...editData, is_commercial: e.target.checked })}
                                        className="w-5 h-5 text-blue-600 rounded bg-white dark:bg-neutral-800 border-neutral-300 dark:border-white/10 focus:ring-blue-500"
                                    />
                                    <span className="font-bold text-neutral-900 dark:text-neutral-200">Ticari Hesap</span>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-widest leading-none">Abonelik Paketi</label>
                                <select
                                    value={editData.subscription_tier}
                                    onChange={(e) => setEditData({ ...editData, subscription_tier: e.target.value })}
                                    className="w-full px-4 py-3 border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-bold appearance-none"
                                >
                                    <option value="free">Standart (Ücretsiz)</option>
                                    <option value="pack1">Başlangıç (Pack 1)</option>
                                    <option value="pack2">Pro (Pack 2)</option>
                                    <option value="unlimited">Sınırsız (Unlimited)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-widest leading-none">Ek İlan Hakkı (+)</label>
                                <div className="relative flex items-center">
                                    <input
                                        type="number"
                                        value={editData.extra_paid_listings}
                                        onChange={(e) => setEditData({ ...editData, extra_paid_listings: parseInt(e.target.value) || 0 })}
                                        className="w-full pl-4 pr-12 py-3 border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-bold"
                                    />
                                    <div className="absolute right-3 text-neutral-400 font-bold text-xs uppercase">Ilan</div>
                                </div>
                            </div>
                            <div className="flex items-end flex-1">
                                <button
                                    onClick={handleSaveStoreInfo}
                                    disabled={saving}
                                    className="w-full py-3 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 font-black rounded-xl hover:bg-black dark:hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-neutral-900/10 uppercase tracking-tighter text-sm"
                                >
                                    {saving ? 'Kaydediliyor...' : 'Değişiklikleri Uygula'}
                                </button>
                            </div>
                        </div>

                        {/* Mağaza Bilgileri (Sadece Pro/Ticari ise gösterilebilir veya hep olabilir) */}
                        {(editData.is_pro || editData.is_commercial) && (
                            <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                                <div>
                                    <label className="block text-[10px] font-black text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-widest leading-none">Mağaza Adı</label>
                                    <input
                                        type="text"
                                        value={editData.store_name}
                                        onChange={(e) => setEditData({ ...editData, store_name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-neutral-900 dark:text-neutral-50 font-bold"
                                        placeholder="Mağaza adını girin"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-widest leading-none">Mağaza Açıklaması</label>
                                    <textarea
                                        value={editData.store_description}
                                        onChange={(e) => setEditData({ ...editData, store_description: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 font-medium"
                                        rows={2}
                                        placeholder="Mağaza açıklamasını girin..."
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Listings Table */}
                    <div>
                        <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-4">Kullanıcının İlanları</h4>
                        {loading ? (
                            <div className="text-center py-8">
                                <LoadingSpinner size="medium" />
                            </div>
                        ) : listings.length > 0 ? (
                            <div className="border border-neutral-200 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-neutral-50 dark:bg-neutral-950 text-xs uppercase text-neutral-500 dark:text-neutral-400 font-bold">
                                        <tr>
                                            <th className="px-4 py-3">Resim</th>
                                            <th className="px-4 py-3">Başlık (No)</th>
                                            <th className="px-4 py-3">Fiyat</th>
                                            <th className="px-4 py-3">Durum</th>
                                            <th className="px-4 py-3">Tarih</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                                        {listings.map(listing => (
                                            <tr key={listing.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden border border-neutral-100 dark:border-white/5">
                                                        {listing.images && listing.images[0] ? (
                                                            <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-neutral-400 dark:text-neutral-600 font-mono">📷</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="font-bold text-neutral-900 dark:text-neutral-200 truncate max-w-[200px]">{listing.title}</div>
                                                    <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">No: {generateListingNumber(listing)}</div>
                                                </td>
                                                <td className="px-4 py-3 font-bold text-red-600 dark:text-red-400">
                                                    {listing.price ? `${listing.price.toLocaleString('tr-TR')} TL` : 'Pazarlıklı'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${listing.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-400'
                                                        }`}>
                                                        {listing.status === 'active' ? 'Aktif' : 'İnaktif'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">
                                                    {new Date(listing.created_at).toLocaleDateString('tr-TR')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-950 rounded-xl text-neutral-400 dark:text-neutral-500 italic border border-neutral-100 dark:border-white/5 transition-colors">
                                Henüz ilan bulunamadı.
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-neutral-100 dark:border-white/5 bg-neutral-50 dark:bg-neutral-950/50 flex justify-end transition-colors duration-300">
                    <button
                        onClick={onClose}
                        className="px-8 py-2 bg-neutral-900 dark:bg-neutral-800 text-white dark:text-neutral-50 font-bold rounded-xl hover:bg-black dark:hover:bg-black transition-all shadow-lg shadow-neutral-900/10"
                    >
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsModal;
