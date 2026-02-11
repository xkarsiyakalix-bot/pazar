import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { getFollowing } from './api/follows';
import ProfileLayout from './ProfileLayout';
import LoadingSpinner from './components/LoadingSpinner';
import VerifiedBadge from './components/VerifiedBadge';

import { getSellerUrl } from './utils/slug';

const FollowingPage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [following, setFollowing] = useState(() => {
        try {
            const saved = sessionStorage.getItem('myFollowingList');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    // Initialize loading based on cache existence
    const [loading, setLoading] = useState(() => {
        return !sessionStorage.getItem('myFollowingList');
    });

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate('/login');
            return;
        }
        loadFollowing();
    }, [user, authLoading, navigate]);

    const loadFollowing = async () => {
        try {
            // Only show loading if we don't have cache
            if (following.length === 0) setLoading(true);

            const data = await getFollowing();
            setFollowing(data);
            // Update Cache
            try {
                sessionStorage.setItem('myFollowingList', JSON.stringify(data));
            } catch (e) {
                console.warn('Could not save following list to cache:', e);
            }
        } catch (error) {
            console.error('Error loading following:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 pt-20 flex justify-center items-center transition-colors">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <ProfileLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-neutral-100 transition-colors">Takip Ettiklerim</h1>
                <p className="text-gray-600 dark:text-neutral-400 mt-2">Takip ettiğiniz satıcılar</p>
            </div>

            {following.length === 0 ? (
                <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-12 text-center border border-transparent dark:border-white/5">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 dark:text-neutral-300 text-lg font-medium mb-2">Takip edilen satıcı bulunamadı</p>
                    <p className="text-gray-400 dark:text-neutral-500 mb-6">Henüz hiçbir satıcıyı takip etmiyorsunuz.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold hover:underline"
                    >
                        Satıcıları keşfet
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {following.map(seller => {
                        const sellerPath = getSellerUrl(seller);

                        return (
                            <Link
                                key={seller.id}
                                to={sellerPath}
                                state={{ sellerProfile: seller }}
                                className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-transparent dark:border-white/5 block"
                            >
                                <div className="p-6">
                                    {/* Profile Picture at Top */}
                                    <div className="flex justify-center mb-4">
                                        {(seller.store_logo || seller.avatar_url) ? (
                                            <img
                                                src={seller.store_logo || seller.avatar_url}
                                                alt={seller.full_name}
                                                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 dark:border-neutral-700 shadow-sm"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full border-4 border-gray-100 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 flex items-center justify-center text-3xl font-black text-gray-300 dark:text-neutral-700">
                                                {seller.full_name?.charAt(0) || '?'}
                                            </div>
                                        )}
                                    </div>

                                    {/* Seller Info */}
                                    <div className="text-center mb-4">
                                        <h3 className="font-bold text-gray-900 dark:text-neutral-100 text-lg mb-2 flex items-center justify-center gap-1.5">
                                            {seller.full_name || 'Bilinmeyen Satıcı'}
                                            <VerifiedBadge isVerified={seller.is_verified} size="sm" />
                                        </h3>
                                        {seller.city && (
                                            <p className="text-sm text-gray-500 dark:text-neutral-400 flex items-center justify-center gap-1 mb-1">
                                                <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                                    <circle cx="12" cy="10" r="3" />
                                                </svg>
                                                {seller.city}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-600 dark:text-neutral-400 font-medium">
                                            {seller.total_listings || 0} aktif ilan
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-center pt-4 border-t border-gray-100 dark:border-white/5">
                                        <span className="text-sm text-gray-500 dark:text-neutral-500">
                                            Üyelik tarihi {new Date(seller.created_at).toLocaleDateString('tr-TR', { year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </ProfileLayout>
    );
};

export default FollowingPage;
