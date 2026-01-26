import React, { useState } from 'react';
import { submitRating } from '../api/ratings';
import LoadingSpinner from './LoadingSpinner';

const RatingModal = ({ isOpen, onClose, ratedUserId, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError('Lütfen bir puan seçin.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await submitRating(ratedUserId, rating, comment);
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.message || 'Puanlama sırasında bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Kullanıcıyı Değerlendir</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col items-center mb-6">
                            <div className="flex gap-2">
                                {[...Array(5)].map((_, index) => {
                                    const ratingValue = index + 1;
                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            className={`focus:outline-none transition-transform duration-200 ${ratingValue <= (hover || rating) ? 'scale-110' : ''}`}
                                            onClick={() => setRating(ratingValue)}
                                            onMouseEnter={() => setHover(ratingValue)}
                                            onMouseLeave={() => setHover(rating)}
                                        >
                                            <svg
                                                className={`w-10 h-10 ${ratingValue <= (hover || rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="mt-2 text-sm text-gray-500 font-medium">
                                {rating > 0 ? `${rating} Yıldız` : 'Puan Verin'}
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Yorumunuz (Opsiyonel)
                            </label>
                            <textarea
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                                placeholder="Deneyiminizi paylaşın..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                disabled={loading || rating === 0}
                                className={`flex-1 px-4 py-3 rounded-xl text-white font-bold shadow-lg transition-all transform hover:-translate-y-0.5
                                    ${loading || rating === 0
                                        ? 'bg-gray-300 cursor-not-allowed shadow-none'
                                        : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-primary-500/30'}`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <LoadingSpinner size="small" />
                                        Gönderiliyor
                                    </div>
                                ) : 'Gönder'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;
