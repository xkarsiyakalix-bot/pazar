import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { getFollowers } from './api/follows';
import ProfileLayout from './ProfileLayout';
import LoadingSpinner from './components/LoadingSpinner';
import { getSellerUrl } from './utils/slug';

const FollowersPage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [followers, setFollowers] = useState(() => {
        try {
            const saved = sessionStorage.getItem('myFollowersList');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    const [loading, setLoading] = useState(() => {
        return !sessionStorage.getItem('myFollowersList');
    });

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate('/login');
            return;
        }
        loadFollowers();
    }, [user, authLoading, navigate]);

    const loadFollowers = async () => {
        try {
            // Only show loading if we haven't rendered from cache
            if (followers.length === 0) setLoading(true);

            const data = await getFollowers();
            setFollowers(data);
            // Update Cache
            try {
                sessionStorage.setItem('myFollowersList', JSON.stringify(data));
            } catch (e) {
                console.warn('Could not save followers list to cache:', e);
            }
        } catch (error) {
            console.error('Error loading followers:', error);
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-neutral-100 transition-colors">Takipçiler</h1>
                <p className="text-gray-600 dark:text-neutral-400 mt-2">Sizi takip eden kullanıcılar</p>
            </div>

            {followers.length === 0 ? (
                <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-12 text-center border border-transparent dark:border-white/5">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 dark:text-neutral-300 text-lg font-medium mb-2">Henüz takipçiniz yok</p>
                    <p className="text-gray-400 dark:text-neutral-500 mb-6">Biri sizi takip etmeye başladığında burada görünecektir.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {followers.map(follower => (
                        <div
                            key={follower.id}
                            onClick={() => navigate(getSellerUrl(follower))}
                            className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-transparent dark:border-white/5"
                        >
                            <div className="p-6">
                                {/* Profile Picture at Top */}
                                <div className="flex justify-center mb-4">
                                    <img
                                        src={follower.store_logo || follower.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(follower.full_name || 'U')}&background=random&color=fff`}
                                        alt={follower.full_name}
                                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 dark:border-neutral-700"
                                    />
                                </div>

                                {/* Follower Info */}
                                <div className="text-center mb-4">
                                    <h3 className="font-bold text-gray-900 dark:text-neutral-100 text-lg mb-2">
                                        {follower.full_name || 'Bilinmeyen Kullanıcı'}
                                    </h3>
                                    {follower.city && (
                                        <p className="text-sm text-gray-500 dark:text-neutral-400 flex items-center justify-center gap-1 mb-1">
                                            <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                            {follower.city}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-600 dark:text-neutral-400 font-medium">
                                        {follower.total_listings || 0} aktif ilan
                                    </p>
                                </div>

                                <div className="flex items-center justify-center pt-4 border-t border-gray-100 dark:border-white/5">
                                    <span className="text-sm text-gray-500 dark:text-neutral-500">
                                        Üyelik tarihi {new Date(follower.created_at).toLocaleDateString('tr-TR', { year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ProfileLayout>
    );
};

export default FollowersPage;
