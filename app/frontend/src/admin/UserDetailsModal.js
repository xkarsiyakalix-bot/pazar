import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { generateListingNumber } from '../components';

const UserDetailsModal = ({ user: initialUser, onClose }) => {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-900">Kullanıcı Detayları</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            <div className="w-32 h-32 rounded-full bg-gray-100 mb-4 overflow-hidden border-4 border-white shadow-lg">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                                        {user.full_name?.charAt(0) || '?'}
                                    </div>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">{user.full_name}</h2>
                            <p className="text-gray-500 mb-2">{user.email}</p>
                            <div className="flex flex-wrap justify-center gap-2 mt-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.is_commercial ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {user.is_commercial ? 'Ticari' : 'Şahsi'}
                                </span>
                                {user.is_pro && (
                                    <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-bold shadow-sm">
                                        PRO
                                    </span>
                                )}
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.status === 'banned' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                    {user.status === 'banned' ? 'Engelli' : 'Aktif'}
                                </span>
                            </div>
                        </div>

                        {/* Detailed Stats & Quick Actions */}
                        <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="text-sm text-gray-500 mb-1">Kullanıcı No.</div>
                                    <div className="text-lg font-mono font-bold text-gray-900">{user.user_number || '-'}</div>
                                    <div className="text-xs text-gray-400 font-mono mt-1 break-all" title={user.id}>{user.id}</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="text-sm text-gray-500 mb-1">Kayıt Tarihi</div>
                                    <div className="text-lg font-bold text-gray-900">{new Date(user.created_at).toLocaleDateString('tr-TR')}</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="text-sm text-gray-500 mb-1">Toplam İlan</div>
                                    <div className="text-lg font-bold text-gray-900">{listings.length}</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="text-sm text-gray-500 mb-1">Aktif İlanlar</div>
                                    <div className="text-lg font-bold text-green-600">
                                        {listings.filter(l => l.status === 'active').length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Store Settings Section */}
                    {isCommercialOrPro && (
                        <div className="mb-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                🏪 Mağaza Ayarları & PRO Statüsü
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mağaza Adı</label>
                                        <input
                                            type="text"
                                            value={editData.store_name}
                                            onChange={(e) => setEditData({ ...editData, store_name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Mağaza adını girin"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 py-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={editData.is_pro}
                                                onChange={(e) => setEditData({ ...editData, is_pro: e.target.checked })}
                                                className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                                            />
                                            <span className="font-bold text-gray-900">PRO Üyelik Aktif</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer ml-auto">
                                            <input
                                                type="checkbox"
                                                checked={editData.is_commercial}
                                                onChange={(e) => setEditData({ ...editData, is_commercial: e.target.checked })}
                                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <span className="font-bold text-gray-900">Ticari Hesap</span>
                                        </label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1 font-bold">Abonelik Paketi</label>
                                            <select
                                                value={editData.subscription_tier}
                                                onChange={(e) => setEditData({ ...editData, subscription_tier: e.target.value })}
                                                className="w-full px-4 py-2 border border-blue-200 bg-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="free">Standart (Free)</option>
                                                <option value="pack1">Pack 1 (59 TL)</option>
                                                <option value="pack2">Pack 2 (99 TL)</option>
                                                <option value="unlimited">Unlimited (199 TL)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1 font-bold">Ek İlan Hakkı</label>
                                            <input
                                                type="number"
                                                value={editData.extra_paid_listings}
                                                onChange={(e) => setEditData({ ...editData, extra_paid_listings: parseInt(e.target.value) || 0 })}
                                                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mağaza Açıklaması</label>
                                    <textarea
                                        value={editData.store_description}
                                        onChange={(e) => setEditData({ ...editData, store_description: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={4}
                                        placeholder="Mağaza açıklamasını girin..."
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleSaveStoreInfo}
                                    disabled={saving}
                                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {saving ? 'Kaydediliyor...' : 'Mağaza Bilgilerini Güncelle'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Listings Table */}
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4">Kullanıcının İlanları</h4>
                        {loading ? (
                            <div className="text-center py-8 text-gray-500 italic">İlanlar yükleniyor...</div>
                        ) : listings.length > 0 ? (
                            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
                                        <tr>
                                            <th className="px-4 py-3">Resim</th>
                                            <th className="px-4 py-3">Başlık (No)</th>
                                            <th className="px-4 py-3">Fiyat</th>
                                            <th className="px-4 py-3">Durum</th>
                                            <th className="px-4 py-3">Tarih</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {listings.map(listing => (
                                            <tr key={listing.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                                                        {listing.images && listing.images[0] ? (
                                                            <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">📷</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="font-bold text-gray-900 truncate max-w-[200px]">{listing.title}</div>
                                                    <div className="text-xs text-gray-500 font-mono">No: {generateListingNumber(listing)}</div>
                                                </td>
                                                <td className="px-4 py-3 font-bold text-red-600">
                                                    {listing.price ? `${listing.price.toLocaleString('tr-TR')} ₺` : 'Pazarlıklı'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {listing.status === 'active' ? 'Aktif' : 'İnaktif'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {new Date(listing.created_at).toLocaleDateString('tr-TR')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl text-gray-400 italic">
                                Henüz ilan bulunamadı.
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-900/10"
                    >
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsModal;
