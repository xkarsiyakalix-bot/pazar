import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { useAuth } from './contexts/AuthContext';
import ProfileLayout from './ProfileLayout';
import InvoiceModal from './components/InvoiceModal';
import LoadingSpinner from './components/LoadingSpinner';
import { getPackageName } from './utils/packageNames';

const UserInvoicesPage = () => {
    const { user } = useAuth();
    const [promotions, setPromotions] = useState(() => {
        try {
            const saved = sessionStorage.getItem('myInvoicesList');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    const [loading, setLoading] = useState(() => {
        return !sessionStorage.getItem('myInvoicesList');
    });

    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        if (user) {
            fetchInvoices();
        }
    }, [user]);

    const fetchInvoices = async () => {
        try {
            // Only show loading if we don't have cache
            if (promotions.length === 0) setLoading(true);

            let updatedPromotions = [];

            const { data: fullData, error: fullError } = await supabase
                .from('promotions')
                .select(`
                    *,
                    profiles (full_name, email, user_number),
                    listings (title, listing_number)
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (fullError) {
                console.error('Full query failed, using manual join fallback:', fullError);

                const { data: simpleData, error: simpleError } = await supabase
                    .from('promotions')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (simpleError) throw simpleError;

                const rawPromotions = simpleData || [];
                const listingIds = [...new Set(rawPromotions.map(p => p.listing_id).filter(Boolean))];

                let listingsMap = {};

                if (listingIds.length > 0) {
                    const { data: listingsData } = await supabase
                        .from('listings')
                        .select('id, title, listing_number')
                        .in('id', listingIds);
                    if (listingsData) listingsData.forEach(l => listingsMap[l.id] = l);
                }

                // Get current user's profile
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('id, full_name, email, user_number')
                    .eq('id', user.id)
                    .single();

                updatedPromotions = rawPromotions.map(promo => ({
                    ...promo,
                    listings: promo.listing_id ? listingsMap[promo.listing_id] : null,
                    profiles: profileData || null
                }));
            } else {
                updatedPromotions = fullData || [];
            }

            setPromotions(updatedPromotions);
            // Update Cache
            try {
                sessionStorage.setItem('myInvoicesList', JSON.stringify(updatedPromotions));
            } catch (e) {
                console.warn('Could not save invoices to cache:', e);
            }

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
            <div className="bg-white dark:bg-neutral-800 md:rounded-2xl md:shadow-lg overflow-hidden md:border border-gray-100 dark:border-white/5 mx-0 transition-colors">
                <div className="p-5 md:p-8 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 md:bg-gray-50/50 dark:md:bg-neutral-900/50">
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-neutral-100 tracking-tight">Faturalarım</h2>
                        <p className="text-gray-500 dark:text-neutral-400 text-[11px] md:text-sm mt-1">Burada satın aldığınız tüm öne çıkarma paketlerinin faturalarını bulabilirsiniz.</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-700 p-2.5 md:p-3 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                        <span className="text-[10px] font-black text-gray-400 dark:text-neutral-400 uppercase tracking-widest block">Toplam Harcama</span>
                        <span className="text-base md:text-xl font-black text-red-600 dark:text-red-450">
                            {promotions.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto -mx-0">
                    <table className="w-full text-left border-collapse min-w-[360px]">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-neutral-900/50 text-[8px] sm:text-[10px] font-black text-gray-400 dark:text-neutral-500 uppercase tracking-widest md:tracking-[0.2em] border-b border-gray-100 dark:border-white/5">
                                <th className="px-3 md:px-8 py-3 md:py-5">Tarih</th>
                                <th className="px-3 md:px-8 py-3 md:py-5">Paket</th>
                                <th className="px-3 md:px-8 py-3 md:py-5 hidden sm:table-cell">İlan</th>
                                <th className="px-3 md:px-8 py-3 md:py-5 text-right whitespace-nowrap">Tutar</th>
                                <th className="px-3 md:px-8 py-3 md:py-5 text-center">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-gray-900 dark:text-neutral-300">
                            {promotions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-12 text-center text-gray-400 dark:text-neutral-600 italic">
                                        Henüz bir fatura bulunmamaktadır.
                                    </td>
                                </tr>
                            ) : (
                                promotions.map((promo) => (
                                    <tr key={promo.id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-750/50 transition-colors group">
                                        <td className="px-3 md:px-8 py-4 md:py-6">
                                            <div className="font-bold text-gray-900 dark:text-neutral-100 text-[10px] sm:text-xs md:text-sm whitespace-nowrap">
                                                {new Date(promo.created_at).toLocaleDateString('tr-TR')}
                                            </div>
                                            <div className="text-[8px] font-mono text-gray-400 dark:text-neutral-500 mt-0.5 uppercase tracking-tighter">
                                                RE-{promo.id.slice(0, 4).toUpperCase()}
                                            </div>
                                        </td>
                                        <td className="px-3 md:px-8 py-4 md:py-6">
                                            <div className="flex items-center gap-1.5 md:gap-3">
                                                <div className="w-0.5 md:w-1 h-5 md:h-8 bg-red-600 rounded-full flex-shrink-0"></div>
                                                <span className="font-bold text-gray-800 dark:text-neutral-200 text-[10px] sm:text-xs md:text-sm uppercase tracking-tight">
                                                    {getPackageName(promo.package_type)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-3 md:px-8 py-4 md:py-6 hidden sm:table-cell">
                                            <div className="text-sm font-medium text-gray-600 dark:text-neutral-400 truncate max-w-[150px]" title={promo.listings?.title}>
                                                {promo.listings?.title || 'Abonelik'}
                                            </div>
                                        </td>
                                        <td className="px-3 md:px-8 py-4 md:py-6 text-right whitespace-nowrap">
                                            <span className="font-black text-gray-900 dark:text-neutral-100 text-[11px] sm:text-sm md:text-base">
                                                {promo.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}<span className="ml-0.5 text-[9px] sm:text-xs">TL</span>
                                            </span>
                                        </td>
                                        <td className="px-3 md:px-8 py-4 md:py-6 text-center">
                                            <button
                                                onClick={() => setSelectedInvoice(promo)}
                                                className="inline-flex items-center justify-center w-8 h-8 sm:w-auto sm:px-4 sm:py-2 bg-gray-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-md"
                                                title="Detaylar"
                                            >
                                                <span className="hidden sm:inline mr-2">Detay / Yazdır</span>
                                                <span className="text-sm sm:text-base">🖨️</span>
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
