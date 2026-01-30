import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { fetchUserFavorites } from './api/favorites';
import { fetchListings } from './api/listings';
import { HorizontalListingCard, ListingCard } from './components';
import LoadingSpinner from './components/LoadingSpinner';
import ProfileLayout from './ProfileLayout';

const FavoritesPage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [listingsData, setListingsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (authLoading) return;
        if (!user) {
            navigate('/login');
            return;
        }
        loadFavorites();
    }, [user, authLoading, navigate]);

    const loadFavorites = async () => {
        try {
            setLoading(true);
            const favoritesData = await fetchUserFavorites(user.id);
            setFavorites(favoritesData);

            if (favoritesData.length > 0) {
                const allListings = await fetchListings({});
                const favoriteListingIds = favoritesData.map(fav => fav.listing_id);
                const matchedListings = allListings.filter(listing =>
                    favoriteListingIds.includes(listing.id)
                );
                setListingsData(matchedListings);
            } else {
                setListingsData([]);
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = async () => {
        await loadFavorites();
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <ProfileLayout>
            <div className="relative">
                {/* Background Decoration */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-50 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60"></div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div>
                            <span className="inline-block px-4 py-1.5 mb-4 text-[10px] font-black tracking-[0.2em] text-rose-600 uppercase bg-rose-50 rounded-full">
                                KİŞİSEL KOLEKSİYONUNUZ
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter">
                                Favorilerim
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 bg-white/50 backdrop-blur-xl border border-gray-100 px-6 py-4 rounded-3xl shadow-sm">
                            <span className="text-3xl font-black text-rose-600 leading-none">{listingsData.length}</span>
                            <div className="text-left leading-none">
                                <div className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1">KAYITLI</div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">İLANINIZ VAR</div>
                            </div>
                        </div>
                    </div>

                    <div className="min-h-[500px]">
                        {listingsData.length === 0 ? (
                            <div className="max-w-xl mx-auto py-24 text-center">
                                <div className="relative inline-block mb-10">
                                    <div className="absolute inset-0 bg-rose-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                                    <div className="relative w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-rose-50 transform -rotate-6">
                                        <svg className="w-16 h-16 text-rose-500 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight italic">Burada Henüz Bir Şey Yok</h2>
                                <p className="text-xl text-gray-500 mb-12 leading-relaxed font-medium">
                                    Beğendiğiniz ürünlerin kalp ikonuna dokunarak onları bu listeye ekleyebilir ve daha sonra kolayca inceleyebilirsiniz.
                                </p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-12 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-lg hover:bg-rose-600 transition-all shadow-2xl shadow-rose-100 hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
                                >
                                    KEŞFETMEYE BAŞLA
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Desktop View - Premium Horizontal List */}
                                <div className="hidden sm:block space-y-6">
                                    {listingsData.map(listing => (
                                        <div key={listing.id} className="group transition-all duration-300 hover:-translate-y-1">
                                            <HorizontalListingCard
                                                listing={listing}
                                                toggleFavorite={handleToggleFavorite}
                                                isFavorite={() => true}
                                                isOwnListing={false}
                                                compact={false}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Mobile View - Clean Premium Grid */}
                                <div className="grid grid-cols-2 gap-3 sm:hidden">
                                    {listingsData.map(listing => (
                                        <div key={listing.id} className="active:scale-[0.98] transition-transform">
                                            <ListingCard
                                                listing={listing}
                                                toggleFavorite={handleToggleFavorite}
                                                isFavorite={() => true}
                                                isOwnListing={false}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProfileLayout>
    );
};

export default FavoritesPage;

