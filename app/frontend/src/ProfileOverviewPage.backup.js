import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { fetchUserProfile, getUserStats } from './api/profile';
import { fetchUserListings } from './api/listings';
import { HorizontalListingCard, formatLastSeen } from './components';
import LoadingSpinner from './components/LoadingSpinner';
import { t } from './translations';

import { getFollowersCount, getFollowingCount } from './api/follows';

import ProfileLayout from './ProfileLayout';
import { useIsMobile } from './hooks/useIsMobile';

const ProfileOverviewPage = () => {
    const isMobile = useIsMobile();
    const { user, loading: authLoading, signOut } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [recentListings, setRecentListings] = useState([]);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [loading, setLoading] = useState(true);

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
            setLoading(true);
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <ProfileLayout>
            <div className="flex flex-col sm:gap-6 gap-0">
                {/* Original Banner - Desktop Only */}
                {!isMobile && (
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-4 sm:p-6 relative">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Tekrar hoş geldin, {profile?.full_name || 'Kullanıcı'}!</h2>
                        <p className="text-sm sm:text-base text-gray-600">İlanlarınızı ve ayarlarınızı yönetin</p>
                    </div>
                )}

                {/* Two Column Layout: Profile Info + Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Profile Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-3 sm:p-6 relative">
                            {/* Mobile Layout: Row | Desktop: Column */}
                            <div className="flex flex-row sm:flex-col items-center sm:items-center gap-4 sm:gap-0">
                                {/* Left Side (Mobile) / Top Side (Desktop) */}
                                <div className="flex flex-col items-center flex-shrink-0">
                                    <div className="w-14 h-14 sm:w-24 sm:h-24 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center mb-1 sm:mb-4 overflow-hidden shadow-sm">
                                        {profile?.avatar_url ? (
                                            <img src={profile.avatar_url} alt="Profil" className="w-full h-full object-cover" />
                                        ) : (
                                            <svg className="w-7 h-7 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        )}
                                    </div>
                                    <h3 className="hidden sm:block text-lg sm:text-xl font-bold text-gray-900 mb-0.5 sm:mb-1">{profile?.full_name || 'Kullanıcı'}</h3>
                                    <p className="hidden sm:block text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 truncate max-w-[150px]">{profile?.email}</p>
                                </div>

                                {/* Mobile Only: Name and Email next to Avatar */}
                                <div className="sm:hidden flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-gray-900 truncate">{profile?.full_name || 'Kullanıcı'}</h3>
                                    <p className="text-[10px] text-gray-500 truncate mb-1">{profile?.email}</p>
                                    <button
                                        onClick={() => navigate(`/seller/${profile?.user_number || user?.id}`)}
                                        className="text-[9px] font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 px-2 py-0.5 rounded-md"
                                    >
                                        #{profile?.user_number || 'N/A'}
                                    </button>
                                </div>

                                {/* Right Side (Mobile) / Bottom Side (Desktop) */}
                                <div className="hidden sm:block w-full space-y-2 sm:space-y-3 mt-2 sm:mt-4 border-t sm:border-t-0 pt-2 sm:pt-0">
                                    <div className="flex items-center justify-between py-1.5 sm:py-2 border-b border-gray-100">
                                        <span className="text-xs sm:text-sm text-gray-600">Üyelik tarihi</span>
                                        <span className="text-xs sm:text-sm font-medium text-gray-900">
                                            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }) : '-'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-1.5 sm:py-2 border-b border-gray-100">
                                        <span className="text-xs sm:text-sm text-gray-600">Konum</span>
                                        <span className="text-xs sm:text-sm font-medium text-gray-900">{profile?.city || 'Belirtilmedi'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-1.5 sm:py-2 border-b border-gray-100">
                                        <span className="text-xs sm:text-sm text-gray-600">Son görülme</span>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="text-xs sm:text-sm font-bold text-gray-900">{formatLastSeen(profile?.last_seen)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between py-1.5 sm:py-2">
                                        <span className="text-xs sm:text-sm text-gray-600">Satıcı No</span>
                                        <button
                                            onClick={() => navigate(`/seller/${profile?.user_number || user?.id}`)}
                                            className="text-[10px] sm:text-sm font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200"
                                        >
                                            #{profile?.user_number || 'N/A'}
                                        </button>
                                    </div>
                                </div>

                                {/* Custom Mobile Row for Info ( membership, location, last seen ) */}
                                <div className="sm:hidden flex flex-col justify-center gap-1 border-l border-gray-100 pl-4 py-1">
                                    <div className="flex items-center gap-1">
                                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span className="text-[10px] text-gray-500">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }) : '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span className="text-[10px] text-gray-500 truncate max-w-[80px]">{profile?.city || 'Şehir Yok'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-[10px] font-bold text-gray-700">{formatLastSeen(profile?.last_seen)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats Grid */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-3 sm:p-6">
                            <h3 className="hidden sm:block text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">İstatistikler</h3>
                            <div className="grid grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
                                <div
                                    onClick={() => navigate('/my-listings')}
                                    className="group bg-gradient-to-br from-white to-gray-50 border border-gray-100 sm:border-2 rounded-lg sm:rounded-2xl p-2 sm:p-4 cursor-pointer hover:border-red-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="text-[7px] sm:text-[10px] font-black uppercase tracking-tight sm:tracking-[0.2em] text-gray-400 mb-0.5 group-hover:text-red-500 transition-colors">İlanlar</div>
                                    <div className="text-base sm:text-3xl font-black text-gray-900 group-hover:text-gray-900">{stats?.totalListings || 0}</div>
                                </div>
                                <div
                                    onClick={() => navigate('/my-listings?filter=active')}
                                    className="group bg-gradient-to-br from-white to-gray-50 border border-gray-100 sm:border-2 rounded-lg sm:rounded-2xl p-2 sm:p-4 cursor-pointer hover:border-green-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="text-[7px] sm:text-[10px] font-black uppercase tracking-tight sm:tracking-[0.2em] text-gray-400 mb-0.5 group-hover:text-green-500 transition-colors">Aktif</div>
                                    <div className="text-base sm:text-3xl font-black text-gray-900 group-hover:text-gray-900">{stats?.activeListings || 0}</div>
                                </div>
                                <div className="group bg-gradient-to-br from-white to-gray-50 border border-gray-100 sm:border-2 rounded-lg sm:rounded-2xl p-2 sm:p-4 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="text-[7px] sm:text-[10px] font-black uppercase tracking-tight sm:tracking-[0.2em] text-gray-400 mb-0.5 group-hover:text-blue-500 transition-colors">Görüntüleme</div>
                                    <div className="text-base sm:text-3xl font-black text-gray-900 group-hover:text-gray-900">{stats?.totalViews || 0}</div>
                                </div>
                                <div
                                    onClick={() => navigate('/favorites')}
                                    className="group bg-gradient-to-br from-white to-gray-50 border border-gray-100 sm:border-2 rounded-lg sm:rounded-2xl p-2 sm:p-4 cursor-pointer hover:border-pink-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="text-[7px] sm:text-[10px] font-black uppercase tracking-tight sm:tracking-[0.2em] text-gray-400 mb-0.5 group-hover:text-pink-500 transition-colors">Favoriler</div>
                                    <div className="text-base sm:text-3xl font-black text-gray-900 group-hover:text-gray-900">{stats?.watchlistCount || 0}</div>
                                </div>
                                <div
                                    onClick={() => navigate('/messages')}
                                    className="group bg-gradient-to-br from-white to-gray-50 border border-gray-100 sm:border-2 rounded-lg sm:rounded-2xl p-2 sm:p-4 cursor-pointer hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="text-[7px] sm:text-[10px] font-black uppercase tracking-tight sm:tracking-[0.2em] text-gray-400 mb-0.5 group-hover:text-indigo-500 transition-colors">Mesajlar</div>
                                    <div className="text-base sm:text-3xl font-black text-gray-900 group-hover:text-gray-900">{stats?.totalMessages || 0}</div>
                                </div>
                                <div
                                    onClick={() => navigate('/followers')}
                                    className="group bg-gradient-to-br from-white to-gray-50 border border-gray-100 sm:border-2 rounded-lg sm:rounded-2xl p-2 sm:p-4 cursor-pointer hover:border-purple-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="text-[7px] sm:text-[10px] font-black uppercase tracking-tight sm:tracking-[0.2em] text-gray-400 mb-0.5 group-hover:text-purple-500 transition-colors">Takipçi</div>
                                    <div className="text-base sm:text-3xl font-black text-gray-900 group-hover:text-gray-900">{followersCount || 0}</div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Navigation Buttons */}
                        <div className="mt-4 sm:mt-6">
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 sm:gap-2">
                                <button
                                    onClick={() => navigate('/messages')}
                                    className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-red-500 hover:shadow-md transition-all duration-200 group"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h0.01M12 10h0.01M16 10h0.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 group-hover:text-red-600 transition-colors">Mesajlar</span>
                                </button>

                                <button
                                    onClick={() => navigate('/my-listings')}
                                    className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-red-500 hover:shadow-md transition-all duration-200 group"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 group-hover:text-red-600 transition-colors">İlanlarım</span>
                                </button>

                                <button
                                    onClick={() => navigate('/settings')}
                                    className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-red-500 hover:shadow-md transition-all duration-200 group"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-0.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-0.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-0.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-0.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-0.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-0.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 group-hover:text-red-600 transition-colors">Ayarlar</span>
                                </button>

                                <button
                                    onClick={() => navigate('/favorites')}
                                    className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-red-500 hover:shadow-md transition-all duration-200 group"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 group-hover:text-red-600 transition-colors">Favoriler</span>
                                </button>

                                <button
                                    onClick={() => navigate('/following')}
                                    className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-red-500 hover:shadow-md transition-all duration-200 group"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-0.656-0.126-1.283-0.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-0.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 group-hover:text-red-600 transition-colors text-center">Takip Ettiklerim</span>
                                </button>

                                <button
                                    onClick={() => navigate('/my-invoices')}
                                    className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-red-500 hover:shadow-md transition-all duration-200 group"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 group-hover:text-red-600 transition-colors">Faturalar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Listings */}
                {recentListings && recentListings.length > 0 && (
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-4 px-1 sm:px-0">
                            <h3 className="text-xl font-bold text-gray-900">Tüm İlanlarım</h3>
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
                        <div className="space-y-4">
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
                    </div>
                )}
            </div>
        </ProfileLayout>
    );
};

export default ProfileOverviewPage;
