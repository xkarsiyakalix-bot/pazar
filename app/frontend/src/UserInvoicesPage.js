import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { useAuth } from './contexts/AuthContext';
import ProfileLayout from './ProfileLayout';
import InvoiceModal from './components/InvoiceModal';
import LoadingSpinner from './components/LoadingSpinner';

const UserInvoicesPage = () => {
    const { user } = useAuth();
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        if (user) {
            fetchInvoices();
        }
    }, [user]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('promotions')
                .select(`
                    *,
                    profiles (full_name, email, user_number),
                    listings (title, listing_number)
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPromotions(data || []);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <ProfileLayout>
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner size="medium" />
                </div>
            </ProfileLayout>
        );
    }

    return (
        <ProfileLayout>
            <div className="bg-white md:rounded-2xl md:shadow-lg overflow-hidden md:border border-gray-100 mx-0">
                <div className="p-5 md:p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 md:bg-gray-50/50">
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Faturalarım</h2>
                        <p className="text-gray-500 text-[11px] md:text-sm mt-1">Burada satın aldığınız tüm öne çıkarma paketlerinin faturalarını bulabilirsiniz.</p>
                    </div>
                    <div className="bg-white p-2.5 md:p-3 rounded-xl shadow-sm border border-gray-100 w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Toplam Harcama</span>
                        <span className="text-base md:text-xl font-black text-red-600">
                            {promotions.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest md:tracking-[0.2em] border-b border-gray-100">
                                <th className="px-4 md:px-8 py-3 md:py-5">Tarih / No</th>
                                <th className="px-4 md:px-8 py-3 md:py-5">Paket</th>
                                <th className="px-4 md:px-8 py-3 md:py-5 hidden sm:table-cell">İlan</th>
                                <th className="px-4 md:px-8 py-3 md:py-5 text-right">Tutar</th>
                                <th className="px-4 md:px-8 py-3 md:py-5 text-center">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {promotions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-12 text-center text-gray-400 italic">
                                        Henüz bir fatura bulunmamaktadır.
                                    </td>
                                </tr>
                            ) : (
                                promotions.map((promo) => (
                                    <tr key={promo.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-4 md:px-8 py-4 md:py-6">
                                            <div className="font-bold text-gray-900 text-xs md:text-sm">
                                                {new Date(promo.created_at).toLocaleDateString('tr-TR')}
                                            </div>
                                            <div className="text-[9px] font-mono text-gray-400 mt-0.5 uppercase tracking-tighter">
                                                RE-{new Date(promo.created_at).getFullYear()}-{promo.id.slice(0, 4).toUpperCase()}
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 md:py-6">
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <div className="w-0.5 md:w-1 h-6 md:h-8 bg-red-600 rounded-full"></div>
                                                <span className="font-black text-gray-800 text-[11px] md:text-sm uppercase tracking-tight">
                                                    {promo.package_type === 'highlight' ? 'Öne Çıkarılan' :
                                                        ['galerie', 'gallery', 'galeri', 'vitrin'].includes(promo.package_type?.toLowerCase()) ? 'Vitrin' :
                                                            promo.package_type === 'top' ? 'Top' :
                                                                promo.package_type === 'budget' ? 'Budget' :
                                                                    promo.package_type === 'premium' ? 'Premium' :
                                                                        promo.package_type === 'plus' ? 'Plus' :
                                                                            promo.package_type === 'subscription_unlimited' ? 'Sınırsız Abonelik' :
                                                                                promo.package_type === 'subscription_pack1' ? 'Başlangıç Kurumsal' :
                                                                                    promo.package_type === 'subscription_pack2' ? 'Pro Kurumsal' :
                                                                                        promo.package_type}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 md:py-6 hidden sm:table-cell">
                                            <div className="text-sm font-medium text-gray-600 truncate max-w-[200px]" title={promo.listings?.title}>
                                                {promo.listings?.title || 'Abonelik Paketi'}
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 md:py-6 text-right">
                                            <span className="font-black text-gray-900 text-sm md:text-base">{promo.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 md:py-6 text-center">
                                            <button
                                                onClick={() => setSelectedInvoice(promo)}
                                                className="inline-flex items-center gap-1.5 md:gap-2 bg-gray-900 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-black hover:scale-105 transition-all shadow-md group-hover:shadow-lg"
                                            >
                                                <span className="hidden xs:inline">Detaylar / Yazdır</span>
                                                <span className="xs:hidden">Yazdır</span>
                                                <span className="text-xs md:text-base">🖨️</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedInvoice && (
                <InvoiceModal
                    promotion={selectedInvoice}
                    onClose={() => setSelectedInvoice(null)}
                />
            )}
        </ProfileLayout>
    );
};

export default UserInvoicesPage;
