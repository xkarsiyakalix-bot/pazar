import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom 404 Not Found Page
 * Enhanced with modern design, animations, and engaging visuals
 */
const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Animated background circles */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="max-w-2xl w-full text-center relative z-10">
                {/* 404 Illustration with animation */}
                <div className="mb-8 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mb-6 shadow-2xl animate-bounce-slow">
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4 animate-pulse-slow">
                        404
                    </h1>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 animate-fade-in-up animation-delay-200">
                        Sayfa Bulunamadı
                    </h2>

                    <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto animate-fade-in-up animation-delay-400">
                        Aradığınız sayfa mevcut değil, taşınmış veya silinmiş olabilir.
                    </p>
                </div>

                {/* Action Buttons with stagger animation */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-fade-in-up animation-delay-600">
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 flex items-center gap-2 group"
                    >
                        <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Ana Sayfaya Dön
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-gray-200 group"
                    >
                        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Geri Dön
                    </button>
                </div>

                {/* Popular Links with animation */}
                <div className="mt-12 pt-8 border-t border-gray-300 animate-fade-in-up animation-delay-800">
                    <p className="text-sm text-gray-600 mb-4 font-semibold">Popüler Sayfalar:</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <button
                            onClick={() => navigate('/search')}
                            className="px-5 py-2.5 bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-lg border-2 border-gray-200 hover:border-red-300 transition-all text-sm font-medium transform hover:scale-105"
                        >
                            Tüm Kategoriler
                        </button>
                        <button
                            onClick={() => navigate('/hakkimizda')}
                            className="px-5 py-2.5 bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-lg border-2 border-gray-200 hover:border-red-300 transition-all text-sm font-medium transform hover:scale-105"
                        >
                            Hakkımızda
                        </button>
                        <button
                            onClick={() => navigate('/iletisim')}
                            className="px-5 py-2.5 bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-lg border-2 border-gray-200 hover:border-red-300 transition-all text-sm font-medium transform hover:scale-105"
                        >
                            İletişim
                        </button>
                        <button
                            onClick={() => navigate('/add-listing')}
                            className="px-5 py-2.5 bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-lg border-2 border-gray-200 hover:border-red-300 transition-all text-sm font-medium transform hover:scale-105"
                        >
                            İlan Ver
                        </button>
                    </div>
                </div>


            </div>

            {/* Custom CSS for animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }

                @keyframes bounce-slow {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                @keyframes pulse-slow {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                }

                .animate-blob {
                    animation: blob 7s infinite;
                }

                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }

                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }

                .animation-delay-200 {
                    animation-delay: 0.2s;
                }

                .animation-delay-400 {
                    animation-delay: 0.4s;
                }

                .animation-delay-600 {
                    animation-delay: 0.6s;
                }

                .animation-delay-800 {
                    animation-delay: 0.8s;
                }

                .animation-delay-1000 {
                    animation-delay: 1s;
                }

                .animation-delay-2000 {
                    animation-delay: 2s;
                }

                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            ` }} />
        </div>
    );
};

export default NotFoundPage;
