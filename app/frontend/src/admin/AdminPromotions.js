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
    const [filter, setFilter] = useState('all');
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

    const isExpired = (promo) => {
        if (!promo.end_date) return false;
        return new Date(promo.end_date) < new Date();
    };

    const getStatusDisplayName = (promo) => {
        if (isExpired(promo)) return 'Süresi Doldu';

        const s = promo.status?.toLowerCase();
        if (s === 'active' || s === 'paid') return 'Aktif';
        if (s === 'cancelled') return 'İptal Edildi';
        if (s === 'completed') return 'Tamamlandı';
        if (s === 'pending') return 'Beklemede';
        return promo.status || 'Bilinmiyor';
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

    // ... handleSendEmail, handleCancelPromotion, handleRepairFlags implementations remain same ...

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

        if (!matchesSearch) return false;

        if (filter === 'expired') {
            return isExpired(promo);
        }
        if (filter === 'active') {
            // Only show actually active ones (not expired)
            return !isExpired(promo) && (promo.status === 'active' || promo.status === 'paid');
        }

        return true;
    });

    const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
    const paginatedPromotions = filteredPromotions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 rounded-full border-4 border-neutral-200 border-t-red-500 animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-neutral-900 tracking-tight">Ödemeler & Promosyonlar</h1>
                    <p className="text-neutral-500 font-medium mt-1">Sistemdeki tüm satın alımları yönetin</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="bg-white p-1 rounded-xl shadow-sm border border-neutral-200 flex">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'all'
                                ? 'bg-neutral-900 text-white shadow-md'
                                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                                }`}
                        >
                            Tümü
                        </button>
                        <button
                            onClick={() => setFilter('active')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'active'
                                ? 'bg-neutral-900 text-white shadow-md'
                                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                                }`}
                        >
                            Aktif
                        </button>
                        <button
                            onClick={() => setFilter('expired')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'expired'
                                ? 'bg-neutral-900 text-white shadow-md'
                                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                                }`}
                        >
                            Süresi Bitenler
                        </button>
                    </div>

                    <div className="relative group w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-neutral-400">🔍</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm placeholder-neutral-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all shadow-sm group-hover:border-neutral-300"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50/50 border-b border-neutral-100 text-neutral-500 font-bold text-[11px] uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Tarih & Zaman</th>
                                <th className="px-6 py-4">Satıcı Profili</th>
                                <th className="px-6 py-4">İlan Detayı</th>
                                <th className="px-6 py-4">Paket Türü</th>
                                <th className="px-6 py-4 text-right">Tutar</th>
                                <th className="px-6 py-4 text-center">Durum</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {paginatedPromotions.map(promo => (
                                <tr key={promo.id} className="hover:bg-neutral-50/80 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-bold text-neutral-900">
                                                {new Date(promo.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                            </span>
                                            <span className="text-xs text-neutral-400 font-medium">
                                                {new Date(promo.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                    {/* Additional cells code omitted for brevity but preserved via context matching or explicit replacement if needed. For now replacing the main loop structure */}

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-500">
                                                {promo.profiles?.full_name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-neutral-900 text-sm">{promo.profiles?.full_name || 'Bilinmiyor'}</div>
                                                <div className="text-[10px] text-neutral-400 font-mono">#{promo.profiles?.user_number || '-'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-[200px]">
                                            {promo.listings?.id ? (
                                                <a
                                                    href={`/product/${promo.listings.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block font-medium text-sm text-neutral-700 hover:text-red-600 hover:underline truncate transition-colors"
                                                >
                                                    {promo.listings.title}
                                                </a>
                                            ) : (
                                                <span className="text-neutral-400 italic text-sm">İlan Silinmiş / Abonelik</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5 items-start">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${['galerie', 'gallery', 'galeri', 'vitrin'].includes(promo.package_type?.toLowerCase()) ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                ['top', 'premium', 'z_premium'].includes(promo.package_type?.toLowerCase()) ? 'bg-red-50 text-red-700 border-red-100' :
                                                    ['highlight', 'budget'].includes(promo.package_type?.toLowerCase()) ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                        'bg-neutral-100 text-neutral-600 border-neutral-200'
                                                }`}>
                                                {getPackageDisplayName(promo.package_type)}
                                            </span>

                                            {(promo.status === 'active' || promo.status === 'paid') && promo.listings && (
                                                ((['galerie', 'gallery', 'galeri', 'vitrin'].includes(promo.package_type?.toLowerCase())) && !promo.listings.is_gallery) ||
                                                ((['top', 'premium', 'z_premium'].includes(promo.package_type?.toLowerCase())) && !promo.listings.is_top)
                                            ) && (
                                                    <div className="flex items-center gap-1 animate-pulse bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                                                        <span className="text-red-600 text-[9px] font-bold whitespace-nowrap">⚠️ ROZET EKSİK</span>
                                                    </div>
                                                )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-bold text-neutral-900 text-sm">
                                            {promo.price?.toLocaleString('tr-TR')} ₺
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${isExpired(promo) ? 'bg-neutral-100 text-neutral-500 border-neutral-200' :
                                            (promo.status === 'active' || promo.status === 'paid') ? 'bg-green-50 text-green-700 border-green-100' :
                                                promo.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                                                    'bg-neutral-100 text-neutral-600 border-neutral-200'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isExpired(promo) ? 'bg-neutral-400' :
                                                (promo.status === 'active' || promo.status === 'paid') ? 'bg-green-500' :
                                                    promo.status === 'cancelled' ? 'bg-red-500' : 'bg-neutral-500'
                                                }`}></span>
                                            {getStatusDisplayName(promo)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {(promo.status === 'active' || promo.status === 'paid') && promo.listings && (
                                                ((['galerie', 'gallery', 'galeri', 'vitrin'].includes(promo.package_type?.toLowerCase())) && !promo.listings.is_gallery) ||
                                                ((['top', 'premium', 'z_premium'].includes(promo.package_type?.toLowerCase())) && !promo.listings.is_top)
                                            ) && (
                                                    <button
                                                        onClick={() => handleRepairFlags(promo)}
                                                        className="p-2 text-amber-500 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-100"
                                                        title="Rozeti Geri Getir"
                                                    >
                                                        🛠️
                                                    </button>
                                                )}

                                            <button
                                                onClick={() => handleSendEmail(promo)}
                                                className={`p-2 rounded-lg transition-all border ${promo.invoice_sent_at
                                                    ? 'text-green-600 bg-green-50 border-green-100'
                                                    : 'text-neutral-400 bg-white border-neutral-200 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100'
                                                    }`}
                                                title={promo.invoice_sent_at ? `E-posta Gönderildi: ${new Date(promo.invoice_sent_at).toLocaleString('tr-TR')}` : 'Makbuz Gönder'}
                                            >
                                                {promo.invoice_sent_at ? '📩' : '📧'}
                                            </button>

                                            <button
                                                onClick={() => setSelectedInvoice(promo)}
                                                className="p-2 text-neutral-400 bg-white border border-neutral-200 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 rounded-lg transition-all"
                                                title="Fatura Detayı"
                                            >
                                                📄
                                            </button>

                                            {promo.listings?.id && (
                                                <button
                                                    onClick={() => window.open(`/product/${promo.listings.id}`, '_blank')}
                                                    className="p-2 text-neutral-400 bg-white border border-neutral-200 hover:text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 rounded-lg transition-all"
                                                    title="İlanı Görüntüle"
                                                >
                                                    👁️
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleCancelPromotion(promo)}
                                                className="p-2 text-neutral-400 bg-white border border-neutral-200 hover:text-red-600 hover:bg-red-50 hover:border-red-100 rounded-lg transition-all"
                                                title="İptal Et"
                                            >
                                                🚫
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paginatedPromotions.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-neutral-400 font-medium">
                                        Sonuç bulunamadı
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="p-4 border-t border-neutral-100 flex justify-between items-center bg-neutral-50/30">
                        <div className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
                            Sayfa {page} / {totalPages}
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

            {selectedInvoice && (
                <InvoiceModal
                    promotion={selectedInvoice}
                    onClose={() => setSelectedInvoice(null)}
                />
            )}
        </div>
    );
};

export default AdminPromotions;
