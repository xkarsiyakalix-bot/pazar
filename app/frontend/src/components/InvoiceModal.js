import React from 'react';
import { createPortal } from 'react-dom';
import { generateListingNumber } from '../components';

const InvoiceModal = ({ promotion, onClose }) => {
    if (!promotion) return null;

    const invoiceNumber = `RE-${new Date(promotion.created_at).getFullYear()}-${promotion.id.slice(0, 4).toUpperCase()}`;

    const content = (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm print:p-0 print:bg-white print:static print:block invoice-print-wrapper">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden font-sans animate-in fade-in zoom-in duration-200 print:animate-none print:shadow-none print:rounded-none print:max-w-none print:w-full print:m-0">

                {/* === PRINTABLE CONTENT START === */}
                <div id="printable-invoice-content" className="p-8 space-y-8 print:p-6 print:space-y-4">

                    {/* Header */}
                    <div className="flex justify-between items-start print:border-b print:border-gray-200 print:pb-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <img src="/logo_exvitrin_2026.png" alt="ExVitrin" className="h-10 w-auto" />
                                <h2 className="text-2xl font-black italic tracking-tighter text-gray-900">ExVitrin</h2>
                            </div>

                            <div className="text-[10px] text-gray-400 space-y-0.5 print:text-gray-600 font-medium leading-tight pl-1">
                                <p className="font-bold text-gray-900 print:text-black uppercase tracking-wider mb-1 text-xs">ExVitrin Bilişim Hizmetleri</p>
                                <p>Teknoloji Mah. İnovasyon Cad. No: 1</p>
                                <p>34000 İstanbul, Türkiye</p>
                                <div className="flex gap-3">
                                    <p>VD: Beşiktaş</p>
                                    <p>VN: 1234567890</p>
                                </div>
                                <p>Mersis: 012345678900001</p>
                            </div>
                        </div>
                        {/* Close button - explicitly hidden in print */}
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-light print:hidden no-print">×</button>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-8 print:grid-cols-2 print:gap-4">
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 print:mb-1">Fatura Alıcısı</h3>
                            <div className="space-y-0.5">
                                <p className="font-bold text-gray-900 text-sm leading-tight">{promotion.profiles?.full_name}</p>
                                <p className="text-gray-500 text-xs italic">{promotion.profiles?.email}</p>
                                <p className="text-[9px] text-gray-400 font-mono mt-1 uppercase tracking-wider bg-gray-50 inline-block px-2 py-0.5 rounded print:bg-transparent print:p-0">Müşteri No: {promotion.profiles?.user_number}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 print:mb-1">Fatura Detayları</h3>
                            <div className="space-y-0.5">
                                <p className="font-black text-gray-900 text-sm tracking-tight">{invoiceNumber}</p>
                                <p className="text-gray-500 text-xs">{new Date(promotion.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                <div className="mt-2">
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border border-green-200 print:border-gray-300 print:bg-transparent print:text-black print:px-0">Ödeme Başarılı</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Info Table */}
                    <div className="border-t border-gray-100 pt-4 print:pt-2">
                        <table className="w-full">
                            <thead>
                                <tr className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    <th className="text-left pb-2">Kalem / Hizmet</th>
                                    <th className="text-center pb-2">Adet</th>
                                    <th className="text-right pb-2">Birim Fiyat</th>
                                    <th className="text-right pb-2">Toplam</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 print:border-t print:border-gray-200">
                                <tr>
                                    <td className="py-4 print:py-2">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <p className="font-black text-gray-900 uppercase text-xs tracking-tight">
                                                    Görünürlük Paketi: {
                                                        promotion.package_type === 'highlight' ? 'Öne Çıkarılan' :
                                                            ['galerie', 'gallery', 'galeri', 'vitrin'].includes(promotion.package_type?.toLowerCase()) ? 'Vitrin' :
                                                                promotion.package_type === 'top' ? 'Premium' :
                                                                    promotion.package_type === 'budget' ? 'Budget' :
                                                                        promotion.package_type === 'premium' ? 'Premium' :
                                                                            promotion.package_type === 'plus' ? 'Plus' :
                                                                                promotion.package_type
                                                    }
                                                </p>
                                                <p className="text-[10px] text-gray-500 mt-0.5 font-medium italic">İlan: {promotion.listings?.title}</p>
                                                <p className="text-[9px] text-gray-400 font-mono mt-1 bg-gray-50 px-1 py-0.5 rounded inline-block print:bg-transparent print:text-gray-500 print:p-0">ID: {generateListingNumber(promotion.listings || {})}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-center text-xs font-bold text-gray-900 print:py-2">1</td>
                                    <td className="py-4 text-right text-xs text-gray-900 font-medium print:py-2">{(promotion.price / 1.18).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL</td>
                                    <td className="py-4 text-right font-black text-xs text-gray-900 print:py-2">{(promotion.price / 1.18).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div className="flex justify-end pt-4 border-t border-gray-100 print:pt-2">
                        <div className="w-64 space-y-2 bg-gray-50 p-4 rounded-xl print:bg-transparent print:p-0 print:w-56">
                            <div className="flex justify-between text-[9px] text-gray-500 font-black uppercase tracking-wider">
                                <span>Ara Toplam (KDV Hariç):</span>
                                <span className="text-gray-900">{(promotion.price / 1.18).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL</span>
                            </div>
                            <div className="flex justify-between text-[9px] text-gray-500 font-black uppercase tracking-wider">
                                <span>KDV (%18):</span>
                                <span className="text-gray-900">{(promotion.price - (promotion.price / 1.18)).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL</span>
                            </div>
                            <div className="h-px bg-gray-200 print:bg-gray-300"></div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Genel Toplam:</span>
                                <span className="text-xl font-black text-red-600 tracking-tighter print:text-black">{promotion.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL</span>
                            </div>
                        </div>
                    </div>

                    {/* Note */}
                    <p className="text-[9px] text-gray-400 italic mt-4 text-center max-w-sm mx-auto print:mt-2 print:text-gray-500">
                        Tüm fiyatlar KDV dahildir. Ödeme başarıyla alınmıştır.
                    </p>

                    {/* Detailed Footer - KEEP THIS VISIBLE */}
                    <div className="mt-8 pt-4 border-t border-gray-100 text-[9px] text-gray-500 print:mt-4 print:pt-4">
                        <div className="grid grid-cols-2 gap-4 print:gap-2">
                            <div>
                                <h4 className="font-black text-gray-900 uppercase tracking-wider mb-1 text-[9px]">ExVitrin Bilişim Hizmetleri</h4>
                                <p className="leading-tight">Teknoloji Mah. İnovasyon Cad. No: 1</p>
                                <p className="leading-tight">34000 İstanbul, Türkiye</p>
                                <p className="mt-1 leading-tight">Vergi Dairesi: Beşiktaş</p>
                                <p className="leading-tight">Vergi No: 1234567890</p>
                                <p className="leading-tight">Mersis No: 012345678900001</p>
                            </div>
                            <div className="text-right">
                                <h4 className="font-black text-gray-900 uppercase tracking-wider mb-1 text-[9px]">İletişim</h4>
                                <p className="leading-tight">info@exvitrin.com</p>
                                <p className="leading-tight">+90 (212) 123 45 67</p>
                                <p className="mt-1 text-gray-400 leading-tight print:text-gray-500">www.exvitrin.com</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* === PRINTABLE CONTENT END === */}


                {/* === CONTROLS FOOTER (HIDDEN IN PRINT) === */}
                <div id="invoice-controls" className="bg-gray-50 p-8 border-t border-gray-100 flex justify-between items-center print:hidden no-print">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">© 2025 ExVitrin GmbH</p>
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
                    
                    /* 1. Reset Root and Body */
                    #root { display: none !important; }
                    
                    html, body {
                        width: 100% !important;
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: hidden !important;
                        background: white !important;
                    }

                    /* 2. Setup Print Wrapper */
                    .invoice-print-wrapper {
                        display: block !important;
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 10mm !important;
                        background: white !important;
                        z-index: 9999 !important;
                        visibility: visible !important;
                    }

                    /* 3. Hide EVERYTHING by default inside wrapper */
                    .invoice-print-wrapper * {
                        visibility: hidden;
                    }

                    /* 4. Show ONLY the printable content block and its children */
                    #printable-invoice-content, 
                    #printable-invoice-content * {
                        visibility: visible !important;
                    }

                    /* 5. FORCE HIDE CONTROLS */
                    #invoice-controls,
                    #invoice-controls *,
                    .no-print,
                    .print\\:hidden {
                        display: none !important;
                        visibility: hidden !important;
                        height: 0 !important;
                        width: 0 !important;
                        overflow: hidden !important;
                    }
                    
                    /* 6. Layout Fixes for Printable Area */
                    #printable-invoice-content {
                        position: absolute;
                        left: 10mm;
                        top: 10mm;
                        width: calc(100% - 20mm);
                    }

                    #printable-invoice-content .flex { display: flex !important; }
                    #printable-invoice-content .grid { display: grid !important; }
                    
                    /* Spacing */
                    .space-y-8 > :not([hidden]) ~ :not([hidden]) {
                        margin-top: 1rem !important; 
                    }

                    /* Colors match */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        box-shadow: none !important;
                    }
                }
            `}} />
        </div>
    );

    return createPortal(content, document.body);
};

export default InvoiceModal;
