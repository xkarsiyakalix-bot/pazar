import React from 'react';
import { createPortal } from 'react-dom';
import { generateListingNumber } from '../components';

const InvoiceModal = ({ promotion, onClose }) => {
    if (!promotion) return null;

    const invoiceNumber = `RE-${new Date(promotion.created_at).getFullYear()}-${promotion.id.slice(0, 4).toUpperCase()}`;

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm print:p-0 print:bg-white print:static print:block invoice-print-wrapper">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden font-sans animate-in fade-in zoom-in duration-200 print:shadow-none print:rounded-none print:max-w-none print:w-full print:m-0">
                {/* Header */}
                <div className="p-8 bg-gray-900 text-white flex justify-between items-start print:bg-white print:text-black print:border-b-2 print:border-gray-100 print:p-8">
                    <div>
                        <h2 className="text-3xl font-black italic tracking-tighter mb-1">KLEINBAZAAR</h2>
                        <p className="text-gray-400 text-xs font-bold tracking-widest uppercase print:text-gray-500">Resmi Fatura</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-gray-300 text-2xl font-light print:hidden">×</button>
                </div>

                <div className="p-8 space-y-8 print:p-8">
                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-8 print:grid-cols-2">
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Fatura Alıcısı</h3>
                            <div className="space-y-1">
                                <p className="font-bold text-gray-900 text-lg leading-tight">{promotion.profiles?.full_name}</p>
                                <p className="text-gray-500 text-sm italic">{promotion.profiles?.email}</p>
                                <p className="text-[10px] text-gray-400 font-mono mt-3 uppercase tracking-wider bg-gray-50 inline-block px-2 py-1 rounded">Müşteri No: {promotion.profiles?.user_number}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Fatura Detayları</h3>
                            <div className="space-y-1">
                                <p className="font-black text-gray-900 text-lg tracking-tight">{invoiceNumber}</p>
                                <p className="text-gray-500 text-sm">{new Date(promotion.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                <div className="mt-4">
                                    <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-200">Ödeme Başarılı</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Info */}
                    <div className="border-t border-gray-100 pt-8">
                        <table className="w-full">
                            <thead>
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    <th className="text-left pb-4">Kalem / Hizmet</th>
                                    <th className="text-center pb-4">Adet</th>
                                    <th className="text-right pb-4">Birim Fiyat</th>
                                    <th className="text-right pb-4">Toplam</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-1.5 h-10 bg-red-600 rounded-full"></div>
                                            <div>
                                                <p className="font-black text-gray-900 uppercase text-sm tracking-tight">Görünürlük Paketi: {promotion.package_type}</p>
                                                <p className="text-xs text-gray-500 mt-1 font-medium italic">İlan: {promotion.listings?.title}</p>
                                                <p className="text-[9px] text-gray-400 font-mono mt-2 bg-gray-50 px-1.5 py-0.5 rounded inline-block">ID: {generateListingNumber(promotion.listings || {})}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 text-center text-sm font-bold text-gray-900">1</td>
                                    <td className="py-6 text-right text-sm text-gray-900 font-medium">{promotion.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</td>
                                    <td className="py-6 text-right font-black text-gray-900">{promotion.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div className="flex justify-end pt-8 border-t border-gray-100">
                        <div className="w-72 space-y-4 bg-gray-50 p-6 rounded-2xl print:bg-white print:border print:border-gray-100">
                            <div className="flex justify-between text-[10px] text-gray-500 font-black uppercase tracking-wider">
                                <span>Ara Toplam:</span>
                                <span className="text-gray-900">{promotion.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-500 font-black uppercase tracking-wider">
                                <span>KDV (%0):</span>
                                <span className="text-gray-900">0,00 ₺</span>
                            </div>
                            <div className="h-px bg-gray-200"></div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Genel Toplam:</span>
                                <span className="text-3xl font-black text-red-600 tracking-tighter">{promotion.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                            </div>
                        </div>
                    </div>

                    {/* Note for Reverse Charge or Similar */}
                    <p className="text-[10px] text-gray-400 italic mt-8 text-center max-w-sm mx-auto">
                        KDV'den muaftır veya vergi mükellefiyeti alıcıya aittir.
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 p-8 border-t border-gray-100 flex justify-between items-center print:hidden">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">© 2025 Kleinbazaar GmbH | HRB 123456</p>
                    <button
                        onClick={() => window.print()}
                        className="bg-gray-900 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl flex items-center gap-3"
                    >
                        <span>Yazdır</span>
                        <span className="text-lg">🖨️</span>
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 0; size: A4 portrait; }
                    
                    /* Reset everything */
                    body, html { 
                        margin: 0 !important; 
                        padding: 0 !important; 
                        background: white !important;
                        overflow: visible !important;
                    }

                    /* Hide the main application root entirely */
                    #root { 
                        display: none !important; 
                    }

                    /* Ensure the portal target (body children that are modals) are visible */
                    .invoice-print-wrapper {
                        visibility: visible !important;
                        display: block !important;
                        position: absolute !important;
                        left: 0 !important;
                        top: 15mm !important;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        z-index: 2147483647 !important;
                    }

                    .invoice-print-wrapper * {
                        visibility: visible !important;
                    }
                    
                    .print\\:hidden { display: none !important; }
                    
                    /* Ensure colors and backgrounds print */
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            `}} />
        </div>,
        document.body
    );
};

export default InvoiceModal;
