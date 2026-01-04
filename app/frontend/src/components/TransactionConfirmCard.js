import React, { useState, useEffect } from 'react';
import { confirmTransaction, getTransaction } from '../api/transactions';
import { useAuth } from '../contexts/AuthContext';

/**
 * TransactionConfirmCard Component
 * Mesajlaşma sayfasında işlem onaylama kartı
 */
function TransactionConfirmCard({
    listingId,
    sellerId,
    buyerId,
    onTransactionComplete,
    onRatingRequest
}) {
    const { user } = useAuth();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);

    const isSeller = user?.id === sellerId;
    const isBuyer = user?.id === buyerId;

    // İşlem bilgisini yükle
    useEffect(() => {
        loadTransaction();
    }, [listingId, sellerId, buyerId]);

    const loadTransaction = async () => {
        try {
            // İşlemi al veya oluştur
            const { getOrCreateTransaction } = await import('../api/transactions');
            const txn = await getOrCreateTransaction(listingId, sellerId, buyerId);
            setTransaction(txn);
        } catch (error) {
            console.error('Error loading transaction:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (confirmed) => {
        if (!transaction) return;

        setConfirming(true);
        try {
            const updated = await confirmTransaction(transaction.id, user.id, confirmed);
            setTransaction(updated);

            // İşlem tamamlandıysa callback çağır
            if (updated.status === 'completed' && onTransactionComplete) {
                onTransactionComplete(updated);
            }
        } catch (error) {
            console.error('Error confirming transaction:', error);
            alert('İşlem onaylanırken bir hata oluştu.');
        } finally {
            setConfirming(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!transaction) return null;

    const userConfirmed = isSeller ? transaction.seller_confirmed : transaction.buyer_confirmed;
    const otherUserConfirmed = isSeller ? transaction.buyer_confirmed : transaction.seller_confirmed;
    const isCompleted = transaction.status === 'completed';
    const isCancelled = transaction.status === 'cancelled';

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-bold text-gray-900">İşlem Durumu</h3>
            </div>

            {/* İptal Edilmiş */}
            {isCancelled && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 font-medium">❌ İşlem iptal edildi</p>
                </div>
            )}

            {/* Tamamlanmış */}
            {isCompleted && (
                <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-700 font-medium flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            ✅ İşlem tamamlandı!
                        </p>
                    </div>

                    {isBuyer && !transaction.buyer_rated && (
                        <button
                            onClick={() => onRatingRequest && onRatingRequest(transaction)}
                            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
                        >
                            ⭐ Satıcıyı Değerlendir
                        </button>
                    )}

                    {isBuyer && transaction.buyer_rated && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="text-gray-600 text-sm text-center">
                                ✅ Değerlendirme yapıldı
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Onay Bekliyor */}
            {!isCompleted && !isCancelled && (
                <div className="space-y-4">
                    {/* Kullanıcı henüz onaylamadı */}
                    {!userConfirmed && (
                        <div className="space-y-3">
                            <p className="text-gray-700 font-medium">
                                Bu ürünü {isSeller ? 'sattınız' : 'satın aldınız'} mı?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleConfirm(false)}
                                    disabled={confirming}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Hayır
                                </button>
                                <button
                                    onClick={() => handleConfirm(true)}
                                    disabled={confirming}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50"
                                >
                                    ✅ Evet, {isSeller ? 'Sattım' : 'Aldım'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Kullanıcı onayladı, karşı taraf bekleniyor */}
                    {userConfirmed && !otherUserConfirmed && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-700 flex items-center gap-2">
                                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                ⏳ Karşı tarafın onayı bekleniyor...
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default TransactionConfirmCard;
