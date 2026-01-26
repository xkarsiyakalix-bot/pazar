import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { fetchUserProfile, getUserStats } from './api/profile';
import { fetchUserListings } from './api/listings';
import { HorizontalListingCard, formatLastSeen } from './components';
import LoadingSpinner from './components/LoadingSpinner';

import { getFollowersCount, getFollowingCount } from './api/follows';

import ProfileLayout from './ProfileLayout';

const ProfileOverviewPage = () => {
    const { user, loading: authLoading } = useAuth();
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

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <ProfileLayout>
            <div className="space-y-6">
                {/* Original Banner */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Tekrar hoş geldin, {profile?.full_name || 'Kullanıcı'}!</h2>
                    <p className="text-gray-600">İlanlarınızı ve ayarlarınızı yönetin</p>
                </div>

                {/* Two Column Layout: Profile Info + Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Profile Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Profil" className="w-full h-full object-cover" />
                                    ) : (
                                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{profile?.full_name || 'Kullanıcı'}</h3>
                                <p className="text-sm text-gray-500 mb-4">{profile?.email}</p>

                                <div className="w-full space-y-3 mt-4">
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-sm text-gray-600">Üyelik tarihi</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }) : '-'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-sm text-gray-600">Konum</span>
                                        <span className="text-sm font-medium text-gray-900">{profile?.city || 'Belirtilmedi'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-sm text-gray-600">Son görülme</span>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="text-sm font-bold text-gray-900">{formatLastSeen(profile?.last_seen)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-sm text-gray-600">Satıcı No</span>
                                        <button
                                            onClick={() => navigate(`/seller/${profile?.user_number || user?.id}`)}
                                            className="text-sm font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 px-3 py-1.5 rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200"
                                        >
                                            #{profile?.user_number || 'N/A'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats Grid */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">İstatistikler</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                <div
                                    onClick={() => navigate('/my-listings')}
                                    className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-2xl p-4 cursor-pointer hover:border-red-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 group-hover:text-red-500 transition-colors">İlanlar</div>
                                    <div className="text-3xl font-black text-gray-900 group-hover:text-gray-900">{stats?.totalListings || 0}</div>
                                </div>
                                <div
                                    onClick={() => navigate('/my-listings?filter=active')}
                                    className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-2xl p-4 cursor-pointer hover:border-green-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 group-hover:text-green-500 transition-colors">Aktif</div>
                                    <div className="text-3xl font-black text-gray-900 group-hover:text-gray-900">{stats?.activeListings || 0}</div>
                                </div>
                                <div className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-2xl p-4 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 group-hover:text-blue-500 transition-colors">Görüntülenme</div>
                                    <div className="text-3xl font-black text-gray-900 group-hover:text-gray-900">{stats?.totalViews || 0}</div>
                                </div>
                                <div
                                    onClick={() => navigate('/favorites')}
                                    className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-2xl p-4 cursor-pointer hover:border-pink-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 group-hover:text-pink-500 transition-colors">Favoriler</div>
                                    <div className="text-3xl font-black text-gray-900 group-hover:text-gray-900">{stats?.watchlistCount || 0}</div>
                                </div>
                                <div
                                    onClick={() => navigate('/messages')}
                                    className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-2xl p-4 cursor-pointer hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 group-hover:text-indigo-500 transition-colors">Mesajlar</div>
                                    <div className="text-3xl font-black text-gray-900 group-hover:text-gray-900">{stats?.totalMessages || 0}</div>
                                </div>
                                <div
                                    onClick={() => navigate('/followers')}
                                    className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-2xl p-4 cursor-pointer hover:border-purple-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 group-hover:text-purple-500 transition-colors">Takipçi</div>
                                    <div className="text-3xl font-black text-gray-900 group-hover:text-gray-900">{followersCount || 0}</div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Navigation Buttons */}
                        <div className="mt-6">
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                <button
                                    onClick={() => navigate('/messages')}
                                    className="flex flex-col items-center gap-2 p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-red-500 hover:shadow-md transition-all duration-200 group"
                                >
                                    <svg className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-700 group-hover:text-red-600 transition-colors">Mesajlar</span>
                                </button>

                                <button
                                    onClick={() => navigate('/my-listings')}
                                    className="flex flex-col items-center gap-2 p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-red-500 hover:shadow-md transition-all duration-200 group"
                                >
                                    <svg className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-700 group-hover:text-red-600 transition-colors">İlanlarım</span>
                                </button>

                                <button
                                    onClick={() => navigate('/settings')}
                                    className="flex flex-col items-center gap-2 p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-red-500 hover:shadow-md transition-all duration-200 group"
                                >
                                    <svg className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-700 group-hover:text-red-600 transition-colors">Ayarlar</span>
                                </button>

                                <button
                                    onClick={() => navigate('/favorites')}
                                    className="flex flex-col items-center gap-2 p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-red-500 hover:shadow-md transition-all duration-200 group"
                                >
                                    <svg className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-700 group-hover:text-red-600 transition-colors">Favoriler</span>
                                </button>

                                <button
                                    onClick={() => navigate('/following')}
                                    className="flex flex-col items-center gap-2 p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-red-500 hover:shadow-md transition-all duration-200 group"
                                >
                                    <svg className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-700 group-hover:text-red-600 transition-colors">Takip Ettiklerim</span>
                                </button>

                                <button
                                    onClick={() => navigate('/my-invoices')}
                                    className="flex flex-col items-center gap-2 p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-red-500 hover:shadow-md transition-all duration-200 group"
                                >
                                    <svg className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-700 group-hover:text-red-600 transition-colors">Faturalar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Listings */}
                {recentListings && recentListings.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Son İlanlar</h3>
                            <button
                                onClick={() => navigate('/my-listings')}
                                className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1"
                            >
                                Hepsini gör
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentListings.slice(0, 5).map(listing => (
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
