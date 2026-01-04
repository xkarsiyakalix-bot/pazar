import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../lib/supabase';
import { generateListingNumber } from '../components';
import emailNotifications from '../emailNotifications';
import InvoiceModal from '../components/InvoiceModal';

const AdminPromotions = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            console.log('Current User:', user);

            if (user) {
                const { data: profile } = await supabase.from('profiles').select('user_number').eq('id', user.id).single();
                console.log('Current Profile:', profile);
                if (profile?.user_number !== 1001) {
                    console.warn('User is NOT admin (1001)');
                }
            }

            // SIMPLIFIED QUERY FOR DEBUGGING
            // We first try with relations. If it fails, we try without.

            let query = supabase
                .from('promotions')
                .select(`
                    *,
                    listings (title, listing_number),
                    profiles (full_name, user_number, email)
                `)
                .order('created_at', { ascending: false });

            const { data, error } = await query;

            if (error) {
                console.error('Full query failed:', error);
                // Fallback to simple query
                const { data: simpleData, error: simpleError } = await supabase
                    .from('promotions')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (simpleError) throw simpleError;
                console.log('Simple query access:', simpleData);
                setPromotions(simpleData || []);
                alert(`DEBUG: Relation fetch failed. Loaded raw data. Error: ${error.message}`);
            } else {
                setPromotions(data || []);
            }

        } catch (error) {
            console.error('Error fetching promotions:', error);
            alert(`DEBUG ERROR: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSendEmail = async (promo) => {
        try {
            // Update the timestamp in Supabase
            const { error } = await supabase
                .from('promotions')
                .update({ invoice_sent_at: new Date().toISOString() })
                .eq('id', promo.id);

            if (error) throw error;

            // Trigger mock email notification
            emailNotifications.sendInvoiceNotification({
                email: promo.profiles?.email,
                customerName: promo.profiles?.full_name,
                invoiceNumber: `RE-${new Date(promo.created_at).getFullYear()}-${promo.id.slice(0, 4).toUpperCase()}`,
                amount: promo.price,
                packageType: promo.package_type,
                listingTitle: promo.listings?.title,
                invoiceUrl: '#' // Mock URL
            });

            // Update local state
            setPromotions(prev => prev.map(p =>
                p.id === promo.id ? { ...p, invoice_sent_at: new Date().toISOString() } : p
            ));
        } catch (error) {
            console.error('Error sending email:', error);
            // alert('Fehler beim Senden der Email.');
        }
    };

    // Filter and Search
    const filteredPromotions = promotions.filter(promo => {
        const matchesSearch =
            promo.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            promo.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            promo.listings?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            promo.package_type?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
    const paginatedPromotions = filteredPromotions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    if (loading) {
        return <div className="p-8 text-center">Ödemeler yükleniyor...</div>;
    }

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
                                <th className="px-6 py-4">Satıcı (No.)</th>
                                <th className="px-6 py-4">İlan (No.)</th>
                                <th className="px-6 py-4">Paket</th>
                                <th className="px-6 py-4">Fiyat</th>
                                <th className="px-6 py-4">Ödeme Yöntemi</th>
                                <th className="px-6 py-4">Durum</th>
                                <th className="px-6 py-4 text-right">Fatura</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedPromotions.map(promo => (
                                <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(promo.created_at).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{promo.profiles?.full_name || 'Bilinmiyor'}</div>
                                        <div className="text-xs text-gray-500 font-mono">
                                            Nr: {promo.profiles?.user_number || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 truncate max-w-xs" title={promo.listings?.title}>
                                            {promo.listings?.title || <span className="text-gray-400 italic">Abonelik Paketi</span>}
                                        </div>
                                        <div className="text-xs text-gray-400 font-mono">
                                            {promo.listings ? `ID: ${generateListingNumber(promo.listings)}` : '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tight ${promo.package_type === 'galerie' ? 'bg-purple-100 text-purple-700' :
                                            promo.package_type === 'top' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {promo.package_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-black text-red-600 whitespace-nowrap">
                                        {promo.price?.toLocaleString('tr-TR')} ₺
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <span className="text-lg">💳</span>
                                            <span className="font-medium">Kredi Kartı</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${promo.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {promo.status === 'active' ? 'Ödendi' : promo.status === 'expired' ? 'Süresi Doldu' : promo.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <button
                                                onClick={() => handleSendEmail(promo)}
                                                className={`p-2 rounded-lg transition-all flex items-center gap-1 ${promo.invoice_sent_at
                                                    ? 'text-green-600 bg-green-50 border border-green-100 italic font-medium'
                                                    : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                                                    }`}
                                                title={promo.invoice_sent_at ? `Gönderildi: ${new Date(promo.invoice_sent_at).toLocaleDateString('tr-TR')}` : "E-posta ile gönder"}
                                            >
                                                {promo.invoice_sent_at ? (
                                                    <>
                                                        <span className="text-[10px]">Gönderildi</span>
                                                        <span>✔️</span>
                                                    </>
                                                ) : (
                                                    <span>✉️</span>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setSelectedInvoice(promo)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Faturayı göster"
                                            >
                                                📄
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paginatedPromotions.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="px-6 py-8 text-center text-gray-400 italic">
                                        Promosyon bulunamadı
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            Gösterilen: {(page - 1) * itemsPerPage + 1} - {Math.min(page * itemsPerPage, filteredPromotions.length)} / {filteredPromotions.length}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            >
                                Geri
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            >
                                İleri
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Invoice Modal - Outside main container to facilitate printing isolation */}
            {
                selectedInvoice && (
                    <InvoiceModal
                        promotion={selectedInvoice}
                        onClose={() => setSelectedInvoice(null)}
                    />
                )
            }
        </>
    );
};

export default AdminPromotions;
