import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { getFollowing } from './api/follows';
import ProfileLayout from './ProfileLayout';
import LoadingSpinner from './components/LoadingSpinner';

const FollowingPage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);

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
            setLoading(true);
            const data = await getFollowing();
            setFollowing(data);
        } catch (error) {
            console.error('Error loading following:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 flex justify-center items-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <ProfileLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Takip Ettiklerim</h1>
                <p className="text-gray-600 mt-2">Takip ettiğiniz satıcılar</p>
            </div>

            {following.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-lg font-medium mb-2">Takip edilen satıcı bulunamadı</p>
                    <p className="text-gray-400 mb-6">Henüz hiçbir satıcıyı takip etmiyorsunuz.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="text-red-600 hover:text-red-700 font-semibold hover:underline"
                    >
                        Satıcıları keşfet
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {following.map(seller => (
                        <div
                            key={seller.id}
                            onClick={() => {
                                if (seller.is_pro || seller.is_commercial || (seller.subscription_tier && seller.subscription_tier !== 'free')) {
                                    navigate(`/store/${seller.id}`);
                                } else {
                                    navigate(`/seller/${seller.user_number}`);
                                }
                            }}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                        >
                            <div className="p-6">
                                {/* Profile Picture at Top */}
                                <div className="flex justify-center mb-4">
                                    <img
                                        src={seller.store_logo || seller.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.full_name || 'User')}&background=ef4444&color=fff&size=200`}
                                        alt={seller.full_name}
                                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                                    />
                                </div>

                                {/* Seller Info */}
                                <div className="text-center mb-4">
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                                        {seller.full_name || 'Bilinmeyen Satıcı'}
                                    </h3>
                                    {seller.city && (
                                        <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mb-1">
                                            <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                            {seller.city}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-600 font-medium">
                                        {seller.total_listings || 0} aktif ilan
                                    </p>
                                </div>

                                <div className="flex items-center justify-center pt-4 border-t border-gray-100">
                                    <span className="text-sm text-gray-500">
                                        Üyelik tarihi {new Date(seller.created_at).toLocaleDateString('tr-TR', { year: 'numeric' })}
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

export default FollowingPage;
