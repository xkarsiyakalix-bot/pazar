import React from 'react';
import { createPortal } from 'react-dom';
import { generateListingNumber } from '../utils/format';
import { getPackageName } from '../utils/packageNames';

const InvoiceModal = ({ promotion, onClose }) => {
    if (!promotion) return null;

    const invoiceNumber = `RE-${new Date(promotion.created_at).getFullYear()}-${promotion.id.slice(0, 4).toUpperCase()}`;

    const content = (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex justify-center p-0 sm:p-4 md:p-8 backdrop-blur-sm print:p-0 print:bg-white print:static print:block invoice-print-wrapper transition-all duration-300 overflow-y-auto"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-neutral-900 md:rounded-2xl shadow-2xl w-full max-w-2xl h-fit my-0 sm:my-auto overflow-hidden font-sans animate-in fade-in zoom-in duration-200 border border-transparent dark:border-white/5 print:animate-none print:shadow-none print:rounded-none print:max-w-none print:w-full print:m-0 transition-colors duration-300 relative"
            >
                {/* Mobile Close Button - Top Right Overlay */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-[110] w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all print:hidden"
                    aria-label="Kapat"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* === PRINTABLE CONTENT START === */}
                <div id="printable-invoice-content" className="p-5 sm:p-8 space-y-6 sm:space-y-8 print:p-6 print:space-y-4 relative">
                    {/* Cancellation Stamp */}
                    {promotion.status === 'cancelled' && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[100] opacity-80 rotate-[-25deg] select-none">
                            <div className="border-[8px] border-red-600 px-12 py-6 rounded-3xl">
                                <span className="text-7xl font-black text-red-600 tracking-tighter uppercase tabular-nums">İPTAL EDİLDİ</span>
                                <div className="text-center mt-2 font-mono text-red-600 text-sm font-bold opacity-70">
                                    {new Date().toLocaleDateString('tr-TR')}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Header */}
                    <div className="flex justify-between items-start print:border-b print:border-gray-200 print:pb-4 pr-10">
                        <div>
                            <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                <img src="/logo_exvitrin_2026.png" alt="ExVitrin" className="h-8 sm:h-10 w-auto" />
                                <h2 className="text-xl sm:text-2xl font-black italic tracking-tighter text-gray-900 dark:text-neutral-50 transition-colors">ExVitrin</h2>
                            </div>

                            <div className="text-[10px] text-gray-400 dark:text-neutral-500 space-y-0.5 print:text-gray-600 font-medium leading-tight pl-1 transition-colors">
                                <p className="font-bold text-gray-900 dark:text-neutral-100 print:text-black uppercase tracking-wider mb-1 text-[11px] transition-colors">ExVitrin Bilişim Hizmetleri</p>
                                <p>Teknoloji Mah. İnovasyon Cad. No: 1</p>
                                <p>34000 İstanbul, Türkiye</p>
                                <div className="flex gap-3">
                                    <p>VD: Beşiktaş</p>
                                    <p>VN: 1234567890</p>
                                </div>
                                <p>Mersis: 012345678900001</p>
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 print:grid-cols-2 print:gap-4">
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 dark:text-neutral-500 uppercase tracking-[0.2em] mb-2 print:mb-1 transition-colors">Fatura Alıcısı</h3>
                            <div className="space-y-0.5">
                                <p className="font-bold text-gray-900 dark:text-neutral-100 text-sm leading-tight transition-colors">{promotion.profiles?.full_name}</p>
                                <p className="text-gray-500 dark:text-neutral-400 text-xs italic transition-colors">{promotion.profiles?.email}</p>
                                <p className="text-[9px] text-gray-400 dark:text-neutral-500 font-mono mt-1 uppercase tracking-wider bg-gray-50 dark:bg-neutral-950 inline-block px-2 py-0.5 rounded print:bg-transparent print:p-0 transition-colors">Müşteri No: {promotion.profiles?.user_number}</p>
                            </div>
                        </div>
                        <div className="sm:text-right">
                            <h3 className="text-[10px] font-black text-gray-400 dark:text-neutral-500 uppercase tracking-[0.2em] mb-2 print:mb-1 transition-colors">Fatura Detayları</h3>
                            <div className="space-y-0.5">
                                <p className="font-black text-gray-900 dark:text-neutral-100 text-sm tracking-tight transition-colors">{invoiceNumber}</p>
                                <p className="text-gray-500 dark:text-neutral-400 text-xs transition-colors">{new Date(promotion.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                <div className="mt-2 text-xs">
                                    <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border border-green-200 dark:border-green-900/30 print:border-gray-300 print:bg-transparent print:text-black print:px-0 transition-colors">Ödeme Başarılı</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Info Table */}
                    <div className="border-t border-gray-100 dark:border-white/5 pt-4 print:pt-2 transition-colors overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="text-[9px] font-black text-gray-400 dark:text-neutral-500 uppercase tracking-[0.2em] transition-colors">
                                    <th className="text-left pb-2">Hizmet</th>
                                    <th className="text-center pb-2 hidden sm:table-cell">Adet</th>
                                    <th className="text-right pb-2">Toplam</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5 print:border-t print:border-gray-200 transition-colors">
                                <tr>
                                    <td className="py-4 print:py-2">
                                        <div>
                                            <p className="font-black text-gray-900 dark:text-neutral-100 uppercase text-[11px] sm:text-xs tracking-tight transition-colors">
                                                Görünürlük Paketi: {
                                                    getPackageName(promotion.package_type)
                                                }
                                            </p>
                                            <p className="text-[10px] text-gray-500 dark:text-neutral-400 mt-0.5 font-medium italic transition-colors">İlan: {promotion.listings?.title}</p>
                                            <p className="text-[9px] text-gray-400 dark:text-neutral-500 font-mono mt-1 bg-gray-50 dark:bg-neutral-950 px-1 py-0.5 rounded inline-block print:bg-transparent print:text-gray-500 print:p-0 transition-colors">ID: {generateListingNumber(promotion.listings || {})}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 text-center text-xs font-bold text-gray-900 dark:text-neutral-100 print:py-2 transition-colors hidden sm:table-cell">1</td>
                                    <td className="py-4 text-right font-black text-xs text-gray-900 dark:text-neutral-100 print:py-2 transition-colors">{promotion.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-white/5 print:pt-2 transition-colors">
                        <div className="w-full sm:w-64 space-y-2 bg-gray-50 dark:bg-neutral-950 p-4 rounded-xl print:bg-transparent print:p-0 print:w-56 transition-colors">
                            <div className="flex justify-between text-[9px] text-gray-500 dark:text-neutral-400 font-black uppercase tracking-wider transition-colors">
                                <span>Ara Toplam (KDV Hariç):</span>
                                <span className="text-gray-900 dark:text-neutral-100">{(promotion.price / 1.18).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL</span>
                            </div>
                            <div className="flex justify-between text-[9px] text-gray-500 dark:text-neutral-400 font-black uppercase tracking-wider transition-colors">
                                <span>KDV (%18):</span>
                                <span className="text-gray-900 dark:text-neutral-100">{(promotion.price - (promotion.price / 1.18)).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL</span>
                            </div>
                            <div className="h-px bg-gray-200 dark:bg-white/10 print:bg-gray-300 transition-colors"></div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-[10px] font-black text-gray-900 dark:text-neutral-50 uppercase tracking-[0.2em] transition-colors">Genel Toplam:</span>
                                <span className="text-xl font-black text-red-600 dark:text-red-500 tracking-tighter print:text-black transition-colors">{promotion.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL</span>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Footer */}
                    <div className="mt-8 pt-4 border-t border-gray-100 dark:border-white/5 text-[9px] text-gray-500 dark:text-neutral-500 print:mt-4 print:pt-4 transition-colors">
                        <div className="grid grid-cols-2 gap-4 print:gap-2">
                            <div>
                                <h4 className="font-black text-gray-900 dark:text-neutral-200 uppercase tracking-wider mb-1 text-[9px] transition-colors">ExVitrin Bilişim Hizmetleri</h4>
                                <p className="leading-tight">Teknoloji Mah. İnovasyon Cad. No: 1</p>
                                <p className="leading-tight">34000 İstanbul, Türkiye</p>
                            </div>
                            <div className="text-right">
                                <h4 className="font-black text-gray-900 dark:text-neutral-200 uppercase tracking-wider mb-1 text-[9px] transition-colors">İletişim</h4>
                                <p className="leading-tight">info@exvitrin.com</p>
                                <p className="leading-tight">www.exvitrin.com</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* === PRINTABLE CONTENT END === */}


                {/* === CONTROLS FOOTER (HIDDEN IN PRINT) === */}
                <div id="invoice-controls" className="bg-gray-50 dark:bg-neutral-950 p-5 sm:p-8 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center print:hidden no-print transition-colors duration-300">
                    <p className="text-[9px] font-black text-gray-400 dark:text-neutral-500 uppercase tracking-[0.2em] transition-colors order-2 sm:order-1">© 2026 ExVitrin</p>
                    <div className="flex gap-3 w-full sm:w-auto order-1 sm:order-2">
                        <button
                            onClick={onClose}
                            className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-[0.2em] bg-white dark:bg-neutral-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-gray-50 transition-all sm:hidden"
                        >
                            Kapat
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="flex-1 sm:flex-none bg-gray-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-3"
                        >
                            <span>Yazdır</span>
                            <span className="text-lg">🖨️</span>
                        </button>
                    </div>
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
