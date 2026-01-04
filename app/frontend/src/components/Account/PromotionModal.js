import React, { useState } from 'react';
import { t } from '../../translations';

const PromotionModal = ({ isOpen, onClose, onConfirm, listingTitle }) => {
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [status, setStatus] = useState('selection'); // selection, payment, success, error

    if (!isOpen) return null;

    const packages = [
        { id: 'gallery', key: 'gallery', icon: '🌟' },
        { id: 'top', key: 'top', icon: '🔝' },
        { id: 'highlight', key: 'highlight', icon: '🎨' }
    ];

    const handleConfirm = async () => {
        setStatus('payment');
        // Simulate payment delay
        setTimeout(async () => {
            try {
                await onConfirm(selectedPackage);
                setStatus('success');
            } catch (error) {
                setStatus('error');
            }
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold">{t.promotions.title}</h3>
                        <p className="text-red-100 text-sm mt-1">{listingTitle}</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-red-200 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    {status === 'selection' && (
                        <div className="space-y-4">
                            <p className="text-gray-600 mb-6">{t.promotions.subtitle}</p>

                            {packages.map((pkg) => (
                                <div
                                    key={pkg.id}
                                    onClick={() => setSelectedPackage(pkg.id)}
                                    className={`relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 group ${selectedPackage === pkg.id
                                            ? 'border-red-500 bg-red-50 shadow-md scale-[1.02]'
                                            : 'border-gray-100 hover:border-red-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">
                                            {pkg.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <h4 className="font-bold text-gray-900">{t.promotions.packages[pkg.key].name}</h4>
                                                <span className="text-red-600 font-bold">{t.promotions.packages[pkg.key].price}</span>
                                            </div>
                                            <p className="text-sm text-gray-500">{t.promotions.packages[pkg.key].description}</p>
                                        </div>
                                    </div>
                                    {selectedPackage === pkg.id && (
                                        <div className="absolute top-2 right-2">
                                            <div className="bg-red-500 text-white rounded-full p-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button
                                disabled={!selectedPackage}
                                onClick={handleConfirm}
                                className={`w-full mt-8 font-bold py-4 rounded-xl shadow-lg transition-all duration-200 ${selectedPackage
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transform hover:-translate-y-1'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {t.promotions.continue}
                            </button>
                        </div>
                    )}

                    {status === 'payment' && (
                        <div className="py-12 text-center space-y-6">
                            <div className="relative inline-block">
                                <div className="w-20 h-20 border-4 border-red-100 border-t-red-500 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl">💳</span>
                                </div>
                            </div>
                            <h4 className="text-xl font-bold text-gray-900">{t.promotions.simulatedPayment}</h4>
                            <p className="text-gray-500 italic">🔒 Güvenli ödeme sayfasına yönlendiriliyorsunuz...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="py-12 text-center space-y-6">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl animate-bounce">
                                ✓
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900">{t.promotions.paymentSuccess}</h4>
                            <button
                                onClick={onClose}
                                className="bg-gray-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-black transition-all"
                            >
                                Tamam
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="py-12 text-center space-y-6">
                            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-4xl">
                                ✕
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900">{t.promotions.paymentError}</h4>
                            <button
                                onClick={() => setStatus('selection')}
                                className="bg-red-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-red-600 transition-all"
                            >
                                Tekrar Dene
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PromotionModal;
