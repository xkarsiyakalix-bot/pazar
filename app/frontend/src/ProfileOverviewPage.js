import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { fetchUserProfile, getUserStats } from './api/profile';
import { fetchUserListings } from './api/listings';
import { HorizontalListingCard, ListingCard, formatLastSeen } from './components';
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

    return (
        <ProfileLayout>
            <div className="flex flex-col gap-6">
                {/* Horizontal Profile Header */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-4 sm:p-8 border border-neutral-400 dark:border-white/10 transition-all">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10">
                        {/* Left Side: Avatar + Name + Sub-info */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-8 w-full lg:w-auto text-center sm:text-left">
                            <div className="relative group">
                                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-red-500 via-pink-500 to-rose-600 rounded-2xl sm:rounded-3xl flex items-center justify-center overflow-hidden shadow-xl shadow-red-500/10 ring-4 ring-white dark:ring-neutral-800 transition-transform group-hover:scale-105 duration-300">
                                    {profile?.store_logo || profile?.avatar_url ? (
                                        <img src={profile.store_logo || profile.avatar_url} alt="Profil" className="w-full h-full object-cover" />
                                    ) : (
                                        <svg className="w-10 h-10 sm:w-14 sm:h-14 text-white p-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    )}
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-neutral-800 shadow-sm sm:block" title="Çevrimiçi"></div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 mb-1">
                                    <h3 className="text-xl sm:text-3xl font-black text-gray-900 dark:text-neutral-100 flex items-center gap-2">
                                        {profile?.full_name || 'Kullanıcı'}
                                        <VerifiedBadge isVerified={profile?.is_verified} size="lg" />
                                    </h3>
                                    <span className="hidden lg:inline-block px-3 py-1 bg-red-50 dark:bg-red-400/10 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-wider rounded-full">Bireysel Üye</span>
                                </div>
                                <p className="text-sm sm:text-lg text-gray-500 dark:text-neutral-400 truncate">{profile?.email}</p>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                                    <button
                                        onClick={() => navigate('/followers')}
                                        className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-neutral-400 bg-gray-50 dark:bg-white/5 px-2.5 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-neutral-200 dark:hover:border-white/10"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                        {followersCount} Takipçi
                                    </button>
                                    <button
                                        onClick={() => navigate('/following')}
                                        className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-neutral-400 bg-gray-50 dark:bg-white/5 px-2.5 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-neutral-200 dark:hover:border-white/10"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                                        {followingCount} Takip Edilen
                                    </button>
                                    {!profile?.is_verified && (
                                        <button
                                            onClick={() => setShowPhoneModal(true)}
                                            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all cursor-pointer border border-blue-200 dark:border-blue-800"
                                        >
                                            <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.47L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
                                            </svg>
                                            Hesabını Doğrula (Mavi Tik Al)
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Account Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-row items-center gap-3 sm:gap-6 w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-white/5 lg:pl-10">
                            <div className="flex flex-col gap-1 text-center lg:text-left bg-gray-50/50 dark:bg-white/5 p-3 rounded-xl lg:bg-transparent lg:p-0">
                                <span className="text-[10px] sm:text-xs font-black text-gray-400 dark:text-neutral-500 uppercase tracking-widest">Katılım</span>
                                <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-neutral-100">
                                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }) : '-'}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1 text-center lg:text-left bg-gray-50/50 dark:bg-white/5 p-3 rounded-xl lg:bg-transparent lg:p-0">
                                <span className="text-[10px] sm:text-xs font-black text-gray-400 dark:text-neutral-500 uppercase tracking-widest">Konum</span>
                                <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-neutral-100">{profile?.city || 'Belirtilmedi'}</span>
                            </div>
                            <div className="flex flex-col gap-1 text-center lg:text-left col-span-2 md:col-span-1 bg-gray-50/50 dark:bg-white/5 p-3 rounded-xl lg:bg-transparent lg:p-0">
                                <span className="text-[10px] sm:text-xs font-black text-gray-400 dark:text-neutral-500 uppercase tracking-widest">Satıcı No</span>
                                <Link
                                    to={getSellerUrl(profile)}
                                    state={{ sellerProfile: profile }}
                                    className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    #{profile?.user_number || 'N/A'}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Navigation - Horizontal Grid below Profile */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 sm:gap-2">
                    <button
                        onClick={() => navigate('/messages')}
                        className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-white dark:bg-neutral-800 border border-neutral-400 dark:border-white/10 rounded-lg sm:rounded-xl hover:border-red-500 hover:shadow-md transition-all duration-200 group"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-neutral-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h0.01M12 10h0.01M16 10h0.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-neutral-300 group-hover:text-red-600 transition-colors">Mesajlar</span>
                    </button>

                    <button
                        onClick={() => navigate('/my-listings')}
                        className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-white dark:bg-neutral-800 border border-neutral-400 dark:border-white/10 rounded-lg sm:rounded-xl hover:border-red-500 hover:shadow-md transition-all duration-200 group"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-neutral-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-neutral-300 group-hover:text-red-600 transition-colors">İlanlarım</span>
                    </button>

                    <button
                        onClick={() => navigate('/settings')}
                        className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-white dark:bg-neutral-800 border border-neutral-400 dark:border-white/10 rounded-lg sm:rounded-xl hover:border-red-500 hover:shadow-md transition-all duration-200 group"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-neutral-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-0.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-0.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-0.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-0.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-0.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-0.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-neutral-300 group-hover:text-red-600 transition-colors">Ayarlar</span>
                    </button>

                    <button
                        onClick={() => navigate('/favorites')}
                        className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-white dark:bg-neutral-800 border border-neutral-400 dark:border-white/10 rounded-lg sm:rounded-xl hover:border-red-500 hover:shadow-md transition-all duration-200 group"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-neutral-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-neutral-300 group-hover:text-red-600 transition-colors">Favoriler</span>
                    </button>

                    <button
                        onClick={() => navigate('/following')}
                        className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-white dark:bg-neutral-800 border border-neutral-400 dark:border-white/10 rounded-lg sm:rounded-xl hover:border-red-500 hover:shadow-md transition-all duration-200 group"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-neutral-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-0.656-0.126-1.283-0.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-0.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-neutral-300 group-hover:text-red-600 transition-colors text-center">Takip</span>
                    </button>

                    <button
                        onClick={() => navigate('/my-invoices')}
                        className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-white dark:bg-neutral-800 border border-neutral-400 dark:border-white/10 rounded-lg sm:rounded-xl hover:border-red-500 hover:shadow-md transition-all duration-200 group"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-neutral-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-neutral-300 group-hover:text-red-600 transition-colors">Faturalar</span>
                    </button>
                </div>

                {/* Recent Listings */}
                {recentListings && recentListings.length > 0 && (
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-4 px-1 sm:px-0">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-neutral-100">Tüm İlanlarım</h3>
                            <button
                                onClick={() => navigate('/my-listings')}
                                className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1"
                            >
                                Yönet
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-col gap-4">
                            {/* Desktop View */}
                            <div className="hidden sm:block space-y-4">
                                {recentListings.map(listing => (
                                    <HorizontalListingCard
                                        key={listing.id}
                                        listing={listing}
                                        toggleFavorite={() => { }}
                                        isFavorite={() => false}
                                        isOwnListing={true}
                                    />
                                ))}
                            </div>

                            {/* Mobile Grid View */}
                            <div className="grid grid-cols-2 gap-2 sm:hidden px-0">
                                {recentListings.map(listing => (
                                    <ListingCard
                                        key={listing.id}
                                        listing={listing}
                                        toggleFavorite={() => { }}
                                        isFavorite={() => false}
                                        isOwnListing={true}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <PhoneVerificationModal
                isOpen={showPhoneModal}
                onClose={() => setShowPhoneModal(false)}
                onVerified={(phone) => {
                    setProfile(prev => prev ? { ...prev, is_verified: true, phone } : prev);
                }}
            />
        </ProfileLayout>
    );
};

export default ProfileOverviewPage;
