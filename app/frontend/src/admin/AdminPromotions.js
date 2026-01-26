import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../lib/supabase';
import { generateListingNumber } from '../components';
import emailNotifications from '../emailNotifications';
import InvoiceModal from '../components/InvoiceModal';
import { clearCache } from '../utils/cache';

const AdminPromotions = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const itemsPerPage = 50;

    const getPackageDisplayName = (type) => {
        const pkg = type?.toLowerCase();
        if (['galerie', 'gallery', 'galeri', 'vitrin'].includes(pkg)) return 'Vitrin';
        if (['top', 'premium', 'z_premium'].includes(pkg)) return 'Premium';
        if (['highlight', 'budget'].includes(pkg)) return 'Öne Çıkan';
        if (['multi-bump', 'z_multi_bump'].includes(pkg)) return 'Tekrarlı Yukarı Çıkar';
        if (pkg === 'bump') return 'Yukarı Çıkar';
        return type || 'Bilinmiyor';
    };

    const getStatusDisplayName = (status) => {
        const s = status?.toLowerCase();
        if (s === 'active' || s === 'paid') return 'Aktif';
        if (s === 'cancelled') return 'İptal Edildi';
        if (s === 'completed') return 'Tamamlandı';
        if (s === 'pending') return 'Beklemede';
        return status || 'Bilinmiyor';
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: profile } = await supabase.from('profiles').select('user_number').eq('id', user.id).single();
                if (profile?.user_number !== 1001) {
                    console.warn('User is NOT admin (1001)');
                }
            }

            let query = supabase
                .from('promotions')
                .select(`
                    *,
                    listings (id, title, listing_number, package_type, is_gallery, is_top, is_highlighted, is_multi_bump, promotion_expiry, created_at),
                    profiles (full_name, user_number, email)
                `)
                .order('created_at', { ascending: false });

            const { data, error } = await query;

            if (error) {
                console.error('Full query failed:', error);
                const { data: simpleData, error: simpleError } = await supabase
                    .from('promotions')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (simpleError) throw simpleError;
                setPromotions(simpleData || []);
            } else {
                setPromotions(data || []);
            }

        } catch (error) {
            console.error('Error fetching promotions:', error);
            alert(`HATA: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSendEmail = async (promo) => {
        try {
            const email = promo.profiles?.email;
            const customerName = promo.profiles?.full_name;

            if (!email) {
                alert('Hata: Müşteri e-posta adresi bulunamadı.');
                return;
            }

            const invoiceNumber = `RE-${new Date(promo.created_at).getFullYear()}-${promo.id.slice(0, 4).toUpperCase()}`;

            const payload = {
                email: email,
                customerName: customerName || 'Değerli Müşterimiz',
                invoiceNumber: invoiceNumber,
                amount: promo.price,
                packageType: promo.package_type,
                listingTitle: promo.listings?.title,
                invoiceUrl: `${window.location.origin}/admin/promotions`
            };

            const { data, error: functionError } = await supabase.functions.invoke('send-invoice', {
                body: payload
            });

            if (functionError) throw functionError;

            await supabase
                .from('promotions')
                .update({ invoice_sent_at: new Date().toISOString() })
                .eq('id', promo.id);

            setPromotions(prev => prev.map(p =>
                p.id === promo.id ? { ...p, invoice_sent_at: new Date().toISOString() } : p
            ));

            alert('E-posta başarıyla gönderildi.');
        } catch (error) {
            console.error('Error sending email:', error);
            alert(`E-posta gönderilirken hata oluştu: ${error.message}`);
        }
    };

    const handleCancelPromotion = async (promo) => {
        if (!window.confirm(`DİKKAT: "${promo.package_type}" satışını iptal etmek istediğinize emin misiniz?`)) {
            return;
        }

        try {
            const { error: promoError } = await supabase
                .from('promotions')
                .update({ status: 'cancelled' })
                .eq('id', promo.id);

            if (promoError) throw promoError;

            const listingId = promo.listing_id || promo.listings?.id;

            if (listingId) {
                const currentListing = promo.listings;
                const resetUpdates = {};

                const pkg = promo.package_type?.toLowerCase();
                if (['galerie', 'gallery', 'galeri', 'vitrin'].includes(pkg)) {
                    resetUpdates.is_gallery = false;
                } else if (pkg === 'top' || pkg === 'premium' || pkg === 'z_premium') {
                    resetUpdates.is_top = false;
                } else if (pkg === 'highlight' || pkg === 'budget') {
                    resetUpdates.is_highlighted = false;
                } else if (pkg === 'multi-bump' || pkg === 'z_multi_bump') {
                    resetUpdates.is_multi_bump = false;
                }

                if (currentListing?.package_type === promo.package_type) {
                    resetUpdates.package_type = 'basic';
                    resetUpdates.promotion_expiry = null;
                }

                if (Object.keys(resetUpdates).length === 0) {
                    resetUpdates.package_type = 'basic';
                    resetUpdates.is_top = false;
                    resetUpdates.is_gallery = false;
                }

                const { error: listingError } = await supabase
                    .from('listings')
                    .update(resetUpdates)
                    .eq('id', listingId);

                if (listingError) {
                    alert(`UYARI: Satış iptal edildi ancak ilan özellikleri sıfırlanamadı: ${listingError.message}`);
                }
            } else if (promo.user_id) {
                await supabase.from('profiles').update({ is_pro: false }).eq('id', promo.user_id);
            }

            clearCache();
            setPromotions(prev => prev.map(p => p.id === promo.id ? { ...p, status: 'cancelled' } : p));
            alert('Satış iptal edildi.');
        } catch (error) {
            console.error('Error cancelling promotion:', error);
            alert(`İPTAL HATASI: ${error.message}`);
        }
    };

    const handleRepairFlags = async (promo) => {
        try {
            const listingId = promo.listing_id || promo.listings?.id;
            if (!listingId) return;

            const updates = {};
            const pkg = promo.package_type?.toLowerCase();

            if (['galerie', 'gallery', 'galeri', 'vitrin'].includes(pkg)) {
                updates.is_gallery = true;
                updates.package_type = 'galerie';
            } else if (pkg === 'top' || pkg === 'premium' || pkg === 'z_premium') {
                updates.is_top = true;
                updates.package_type = pkg;
            } else if (pkg === 'highlight' || pkg === 'budget') {
                updates.is_highlighted = true;
                updates.package_type = pkg;
            } else if (pkg === 'multi-bump' || pkg === 'z_multi_bump') {
                updates.is_multi_bump = true;
                updates.package_type = pkg;
            }

            // Set expiry to promo.end_date, but if that is also past, default to 30 days from now for "repair"
            let expiryDate = promo.end_date ? new Date(promo.end_date) : new Date();
            if (isNaN(expiryDate.getTime()) || expiryDate < new Date()) {
                console.log('Promotion end_date is missing or in the past, setting repair expiry to +30 days');
                expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 30);
            }
            updates.promotion_expiry = expiryDate.toISOString();

            const { error } = await supabase
                .from('listings')
                .update(updates)
                .eq('id', listingId);

            if (error) throw error;

            alert('İlan özellikleri başarıyla onarıldı.');
            clearCache();
            fetchPromotions();
        } catch (error) {
            console.error('Error repairing flags:', error);
            alert(`ONARIM HATASI: ${error.message}`);
        }
    };

    const filteredPromotions = promotions.filter(promo => {
        const matchesSearch =
            promo.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            promo.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            promo.listings?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            promo.package_type?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
    const paginatedPromotions = filteredPromotions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    if (loading) return <div className="p-8 text-center">Ödemeler yükleniyor...</div>;

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-900">Ödemeler & Promosyonlar</h2>
                    <div className="flex gap-4 w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Satıcı, İlan veya Paket ara..."
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
                                <th className="px-6 py-4">Tarih</th>
                                <th className="px-6 py-4">Satıcı</th>
                                <th className="px-6 py-4">İlan</th>
                                <th className="px-6 py-4">Paket</th>
                                <th className="px-6 py-4">Fiyat</th>
                                <th className="px-6 py-4">Durum</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedPromotions.map(promo => (
                                <tr key={promo.id} className="hover:bg-gray-50 transition-colors text-sm">
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-[10px]">
                                        <div>
                                            <span className='font-bold text-gray-700'>Satın Alma:</span><br />
                                            {new Date(promo.created_at).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="mt-1">
                                            <span className='font-bold text-red-500'>Bitiş:</span><br />
                                            {new Date(promo.end_date).toLocaleDateString('tr-TR')}
                                        </div>
                                        {promo.package_type?.includes('multi-bump') && promo.listings?.created_at && (
                                            <div className="mt-1 bg-blue-50 p-1 rounded border border-blue-100">
                                                <span className='font-bold text-blue-600'>Son İşlem:</span><br />
                                                {new Date(promo.listings.created_at).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                                <br />
                                                <span className='font-bold text-blue-600'>Tahmini Sonraki:</span><br />
                                                {(() => {
                                                    const lastBump = new Date(promo.listings.created_at);
                                                    lastBump.setDate(lastBump.getDate() + 1); // Daily interval
                                                    return lastBump.toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
                                                })()}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{promo.profiles?.full_name || 'Bilinmiyor'}</div>
                                        <div className="text-[10px] text-gray-500">Nr: {promo.profiles?.user_number || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900 truncate max-w-[200px]" title={promo.listings?.title}>
                                            {promo.listings?.id ? (
                                                <a
                                                    href={`/product/${promo.listings.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-red-600 hover:underline font-medium"
                                                >
                                                    {promo.listings.title}
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 italic">Abonelik</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tight ${['galerie', 'gallery', 'galeri', 'vitrin'].includes(promo.package_type?.toLowerCase()) ? 'bg-purple-100 text-purple-700' :
                                            ['top', 'premium', 'z_premium'].includes(promo.package_type?.toLowerCase()) ? 'bg-red-100 text-red-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {getPackageDisplayName(promo.package_type)}
                                        </span>
                                        {(promo.status === 'active' || promo.status === 'paid') && promo.listings && (
                                            ((['galerie', 'gallery', 'galeri', 'vitrin'].includes(promo.package_type?.toLowerCase())) && !promo.listings.is_gallery) ||
                                            ((['top', 'premium', 'z_premium'].includes(promo.package_type?.toLowerCase())) && !promo.listings.is_top)
                                        ) && (
                                                <div className="flex items-center gap-1 mt-1 animate-pulse">
                                                    <span className="text-red-500 text-[9px] font-bold whitespace-nowrap">⚠️ ROZET EKSİK!</span>
                                                </div>
                                            )}
                                    </td>
                                    <td className="px-6 py-4 font-black text-red-600 whitespace-nowrap">
                                        {promo.price?.toLocaleString('tr-TR')} ₺
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${promo.status === 'active' || promo.status === 'paid' ? 'bg-green-100 text-green-800' :
                                            promo.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {getStatusDisplayName(promo.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            {(promo.status === 'active' || promo.status === 'paid') && promo.listings && (
                                                ((['galerie', 'gallery', 'galeri', 'vitrin'].includes(promo.package_type?.toLowerCase())) && !promo.listings.is_gallery) ||
                                                ((['top', 'premium', 'z_premium'].includes(promo.package_type?.toLowerCase())) && !promo.listings.is_top)
                                            ) && (
                                                    <button
                                                        onClick={() => handleRepairFlags(promo)}
                                                        className="px-2 py-1 text-xs bg-yellow-400 text-white rounded hover:bg-yellow-500 transition-colors shadow-sm"
                                                        title="Rozeti Geri Getir"
                                                    >
                                                        🛠️ Onar
                                                    </button>
                                                )}
                                            <button
                                                onClick={() => handleSendEmail(promo)}
                                                className={`p-1.5 rounded transition-all ${promo.invoice_sent_at ? 'text-green-500 bg-green-50' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
                                                title={promo.invoice_sent_at ? `E-posta Gönderildi: ${new Date(promo.invoice_sent_at).toLocaleString('tr-TR')}` : 'E-posta İle Gönder'}
                                            >
                                                {promo.invoice_sent_at ? '📧 ✅' : '📧'}
                                            </button>
                                            <button
                                                onClick={() => handleCancelPromotion(promo)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                title="İptal Et"
                                            >
                                                🚫
                                            </button>
                                            <button
                                                onClick={() => setSelectedInvoice(promo)}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                title="Faturayı Görüntüle"
                                            >
                                                📄
                                            </button>
                                            {promo.listings?.id && (
                                                <button
                                                    onClick={() => window.open(`/product/${promo.listings.id}`, '_blank')}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                    title="İlanı Görüntüle"
                                                >
                                                    👁️
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            Sayfa {page} / {totalPages}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50">Geri</button>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50">İleri</button>
                        </div>
                    </div>
                )}
            </div>

            {selectedInvoice && (
                <InvoiceModal
                    promotion={selectedInvoice}
                    onClose={() => setSelectedInvoice(null)}
                />
            )}
        </>
    );
};

export default AdminPromotions;
