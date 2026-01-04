import React, { useState } from 'react';
import StarRating from './StarRating';
import { submitRating } from '../api/ratings';

/**
 * RatingModal Component
 * Satıcıyı puanlama modal'ı
 */
function RatingModal({
    isOpen,
    onClose,
    transaction,
    sellerName,
    onSuccess
}) {
    const [ratings, setRatings] = useState({
        communication: 0,
        description: 0,
        delivery: 0,
        overall: 0
    });
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasyon
        if (ratings.communication === 0 || ratings.description === 0 ||
            ratings.delivery === 0 || ratings.overall === 0) {
            setError('Lütfen tüm kategorileri puanlayın');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await submitRating({
                transactionId: transaction.id,
                sellerId: transaction.seller_id,
                buyerId: transaction.buyer_id,
                listingId: transaction.listing_id,
                communicationRating: ratings.communication,
                descriptionRating: ratings.description,
                deliveryRating: ratings.delivery,
                overallRating: ratings.overall,
                reviewText: reviewText.trim()
            });

            // Başarılı
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            console.error('Error submitting rating:', err);
            setError('Puanlama gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">
                            Satıcıyı Değerlendirin
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-red-100 mt-2">
                        {sellerName}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* İletişim */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            İletişim
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                            Yanıt hızı, kibarlık ve profesyonellik
                        </p>
                        <StarRating
                            rating={ratings.communication}
                            onRatingChange={(value) => setRatings({ ...ratings, communication: value })}
                            size={32}
                        />
                    </div>

                    {/* Ürün Açıklaması */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Ürün Açıklaması
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                            İlan ile gerçek ürün uyumu
                        </p>
                        <StarRating
                            rating={ratings.description}
                            onRatingChange={(value) => setRatings({ ...ratings, description: value })}
                            size={32}
                        />
                    </div>

                    {/* Teslimat/Buluşma */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Teslimat/Buluşma
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                            Zamanında teslimat, anlaşılan yerde buluşma
                        </p>
                        <StarRating
                            rating={ratings.delivery}
                            onRatingChange={(value) => setRatings({ ...ratings, delivery: value })}
                            size={32}
                        />
                    </div>

                    {/* Genel Memnuniyet */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Genel Memnuniyet
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                            Genel deneyim ve tekrar alışveriş yapma isteği
                        </p>
                        <StarRating
                            rating={ratings.overall}
                            onRatingChange={(value) => setRatings({ ...ratings, overall: value })}
                            size={32}
                        />
                    </div>

                    {/* Yorum */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Yorumunuz (İsteğe Bağlı)
                        </label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={4}
                            maxLength={500}
                            placeholder="Deneyiminizi paylaşın..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {reviewText.length}/500 karakter
                        </p>
                    </div>

                    {/* Hata Mesajı */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Butonlar */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Gönderiliyor...' : 'Gönder'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RatingModal;
