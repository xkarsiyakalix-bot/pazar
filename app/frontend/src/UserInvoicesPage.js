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
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Faturalarım</h2>
                        <p className="text-gray-500 text-sm mt-1">Burada satın aldığınız tüm öne çıkarma paketlerinin faturalarını bulabilirsiniz.</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">Toplam Harcama</span>
                        <span className="text-xl font-black text-red-600">
                            {promotions.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                                <th className="px-8 py-5">Tarih / No</th>
                                <th className="px-8 py-5">Paket</th>
                                <th className="px-8 py-5">İlan</th>
                                <th className="px-8 py-5 text-right">Tutar</th>
                                <th className="px-8 py-5 text-center">İşlem</th>
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
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-gray-900">
                                                {new Date(promo.created_at).toLocaleDateString('tr-TR')}
                                            </div>
                                            <div className="text-[10px] font-mono text-gray-400 mt-0.5 uppercase tracking-tighter">
                                                RE-{new Date(promo.created_at).getFullYear()}-{promo.id.slice(0, 4).toUpperCase()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1 h-8 bg-red-600 rounded-full"></div>
                                                <span className="font-black text-gray-800 text-sm uppercase tracking-tight">
                                                    {promo.package_type === 'highlight' ? 'Öne Çıkarılan' :
                                                        ['galerie', 'gallery', 'galeri', 'vitrin'].includes(promo.package_type?.toLowerCase()) ? 'Vitrin' :
                                                            promo.package_type === 'top' ? 'Top' :
                                                                promo.package_type === 'budget' ? 'Budget' :
                                                                    promo.package_type === 'premium' ? 'Premium' :
                                                                        promo.package_type === 'plus' ? 'Plus' :
                                                                            promo.package_type}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-medium text-gray-600 truncate max-w-[200px]" title={promo.listings?.title}>
                                                {promo.listings?.title || 'Abonelik Paketi'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className="font-black text-gray-900 text-base">{promo.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <button
                                                onClick={() => setSelectedInvoice(promo)}
                                                className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black hover:scale-105 transition-all shadow-md group-hover:shadow-lg"
                                            >
                                                <span>Detaylar / Yazdır</span>
                                                <span>🖨️</span>
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
