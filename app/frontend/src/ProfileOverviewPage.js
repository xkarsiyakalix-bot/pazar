import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { fetchUserProfile, getUserStats } from './api/profile';
import { fetchUserListings } from './api/listings';
import { HorizontalListingCard, formatLastSeen } from './components';
import VerifiedBadge from './components/VerifiedBadge';
import LoadingSpinner from './components/LoadingSpinner';
import { t } from './translations';

import { getFollowersCount, getFollowingCount } from './api/follows';

import ProfileLayout from './ProfileLayout';
import { useIsMobile } from './hooks/useIsMobile';
import { getSellerUrl } from './utils/slug';
import { PhoneVerificationModal } from './components/PhoneVerificationModal';

const ProfileOverviewPage = () => {
    const isMobile = useIsMobile();
    const { user, loading: authLoading, signOut } = useAuth();
    const navigate = useNavigate();
    // Load all data from cache during initialization to prevent flicker
    const getCachedData = () => {
        try {
            const saved = sessionStorage.getItem('myProfileData');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error('Error parsing profile cache:', e);
            return null;
        }
    };

    const cachedData = getCachedData();

    const [profile, setProfile] = useState(cachedData?.profile || null);
    const [stats, setStats] = useState(cachedData?.stats || null);
    const [recentListings, setRecentListings] = useState(cachedData?.recentListings || []);
    const [followersCount, setFollowersCount] = useState(cachedData?.followersCount || 0);
    const [followingCount, setFollowingCount] = useState(cachedData?.followingCount || 0);

    const [loading, setLoading] = useState(!cachedData);
    const [showPhoneModal, setShowPhoneModal] = useState(false);

    // Save to cache whenever data updates
    useEffect(() => {
        if (profile) {
            const cacheData = {
                profile,
                stats,
                recentListings,
                followersCount,
                followingCount
            };
            try {
                sessionStorage.setItem('myProfileData', JSON.stringify(cacheData));
            } catch (e) {
                console.warn('Could not save profile data to cache:', e);
            }
        }
    }, [profile, stats, recentListings, followersCount, followingCount]);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate('/login');
            return;
        }
        loadData();
    }, [user, authLoading, navigate]);

    const loadData = async () => {
        try {
            // Only show loading if we didn't start with cache
            if (loading && !profile) {
                setLoading(true);
            }

            const [profileData, statsData, listingsData, followersCountData, followingCountData] = await Promise.all([
                fetchUserProfile(user.id),
                getUserStats(user.id),
                fetchUserListings(user.id),
                getFollowersCount(user.id),
                getFollowingCount(user.id)
            ]);

            setProfile(profileData);
            setStats(statsData);
            setRecentListings(listingsData);
            setFollowersCount(followersCountData);
            setFollowingCount(followingCountData);
        } catch (error) {
            console.error('Error loading profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    const quickLinks = [
        { to: '/messages', label: 'Mesajlar', path: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
        { to: '/my-listings', label: 'İlanlarım', path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { to: '/settings', label: 'Ayarlar', paths: ['M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'] },
        { to: '/favorites', label: 'Favoriler', path: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
        { to: '/following', label: 'Takip', path: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { to: '/my-invoices', label: 'Faturalar', path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    ];

    return (
        <ProfileLayout>
            <div className="flex flex-col gap-4 sm:gap-5">
                <h1 className="sm:hidden text-base font-medium text-neutral-900 dark:text-neutral-100 px-0.5">Profil</h1>
                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 sm:p-6 border border-neutral-200 dark:border-neutral-700">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-8">
                        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 w-full lg:w-auto text-center sm:text-left">
                            <div className="relative">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center overflow-hidden border border-neutral-200 dark:border-neutral-600">
                                    {profile?.store_logo || profile?.avatar_url ? (
                                        <img src={profile.store_logo || profile.avatar_url} alt="Profil" className="w-full h-full object-cover" />
                                    ) : (
                                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    )}
                                </div>
                                <span className="absolute bottom-0.5 right-0.5 bg-emerald-600 w-2.5 h-2.5 rounded-full border border-white dark:border-neutral-800" title="Çevrimiçi"></span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-1.5 sm:gap-2 mb-1">
                                    <h3 className="text-lg sm:text-xl font-medium text-neutral-900 dark:text-neutral-100 flex items-center justify-center gap-2">
                                        {profile?.full_name || 'Kullanıcı'}
                                        <VerifiedBadge isVerified={profile?.is_verified} size="lg" />
                                    </h3>
                                    {profile?.is_verified && (
                                        <p className="sm:hidden text-xs text-neutral-500 dark:text-neutral-400">Doğrulanmış Satıcı</p>
                                    )}
                                    <span className="inline-block text-xs text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-600 rounded-md px-2 py-0.5">Bireysel Üye</span>
                                </div>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">{profile?.email}</p>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                                    <button
                                        onClick={() => navigate('/followers')}
                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 px-2.5 py-1.5 rounded-md hover:border-neutral-400 border border-neutral-200 dark:border-neutral-700 transition-colors duration-200 cursor-pointer"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                        {followersCount} Takipçi
                                    </button>
                                    <button
                                        onClick={() => navigate('/following')}
                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 px-2.5 py-1.5 rounded-md hover:border-neutral-400 border border-neutral-200 dark:border-neutral-700 transition-colors duration-200 cursor-pointer"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                                        {followingCount} Takip Edilen
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 w-full lg:w-auto lg:flex lg:flex-row items-stretch lg:items-center pt-0 lg:pt-0 mt-1 sm:mt-0 border border-neutral-200 dark:border-neutral-700 lg:border-0 lg:border-l rounded-md lg:rounded-none overflow-hidden lg:overflow-visible divide-x divide-neutral-200 dark:divide-neutral-700 lg:divide-x-0 lg:gap-6 lg:pl-8">
                            <div className="flex flex-col gap-0.5 text-center lg:text-left px-2 py-2.5 lg:p-0 min-w-0">
                                <span className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400">Katılım</span>
                                <span className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }) : '-'}
                                </span>
                            </div>
                            <div className="flex flex-col gap-0.5 text-center lg:text-left px-2 py-2.5 lg:p-0 min-w-0">
                                <span className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400">Konum</span>
                                <span className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{profile?.city || 'Belirtilmedi'}</span>
                            </div>
                            <div className="flex flex-col gap-0.5 text-center lg:text-left px-2 py-2.5 lg:p-0 min-w-0">
                                <span className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400">Satıcı No</span>
                                <Link
                                    to={getSellerUrl(profile)}
                                    state={{ sellerProfile: profile }}
                                    className="text-xs sm:text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:underline truncate"
                                >
                                    #{profile?.user_number || 'N/A'}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-px overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-700">
                    {quickLinks.map((item) => (
                        <button
                            key={item.to}
                            onClick={() => navigate(item.to)}
                            className="flex flex-col items-center justify-center gap-1.5 min-h-[44px] p-3 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors duration-200 cursor-pointer group"
                        >
                            <svg className="w-4 h-4 text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                {(item.paths || [item.path]).map((d) => (
                                    <path key={d} strokeLinecap="round" strokeLinejoin="round" d={d} />
                                ))}
                            </svg>
                            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{item.label}</span>
                        </button>
                    ))}
                </div>

                {recentListings && recentListings.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-200 dark:border-neutral-700">
                            <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-100">Tüm İlanlarım</h3>
                            <button
                                onClick={() => navigate('/my-listings')}
                                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium text-sm inline-flex items-center gap-1 cursor-pointer transition-colors duration-200"
                            >
                                Yönet
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                            {recentListings.map(listing => (
                                <HorizontalListingCard
                                    key={listing.id}
                                    listing={listing}
                                    toggleFavorite={() => { }}
                                    isFavorite={() => false}
                                    isOwnListing={true}
                                    quiet
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ProfileLayout>
    );
};

export default ProfileOverviewPage;
