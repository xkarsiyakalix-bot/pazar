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
    const [listingsData, setListingsData] = useState(() => {
        const saved = sessionStorage.getItem('myFavoritesListings');
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(() => {
        const saved = sessionStorage.getItem('myFavoritesListings');
        return !saved || saved === '[]';
    });

    // Save favorites listings to cache
    useEffect(() => {
        if (listingsData.length > 0) {
            try {
                sessionStorage.setItem('myFavoritesListings', JSON.stringify(listingsData));
            } catch (e) {
                console.warn('Could not save favorites to cache:', e);
            }
        }
    }, [listingsData]);

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
            // Only show loading if no cached data
            if (listingsData.length === 0) {
                setLoading(true);
            }
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
            <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center transition-colors">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <ProfileLayout>
            <div className="relative -mt-6">
                {/* Background Decoration */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-50 dark:bg-rose-900/10 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-60"></div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-6">
                        <div>

                            <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-neutral-100 tracking-tighter">
                                Favorilerim
                            </h1>
                        </div>

                    </div>

                    <div className="min-h-[500px]">
                        {listingsData.length === 0 ? (
                            <div className="max-w-xl mx-auto py-24 text-center">
                                <div className="relative inline-block mb-10">
                                    <div className="absolute inset-0 bg-rose-200 dark:bg-rose-900 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                                    <div className="relative w-32 h-32 bg-white dark:bg-neutral-800 rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-rose-50 dark:border-white/5 transform -rotate-6">
                                        <svg className="w-16 h-16 text-rose-500 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 dark:text-neutral-100 mb-6 tracking-tight italic">Burada Henüz Bir Şey Yok</h2>
                                <p className="text-xl text-gray-500 dark:text-neutral-400 mb-12 leading-relaxed font-medium">
                                    Beğendiğiniz ürünlerin kalp ikonuna dokunarak onları bu listeye ekleyebilir ve daha sonra kolayca inceleyebilirsiniz.
                                </p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-12 py-5 bg-gray-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-[2rem] font-black text-lg hover:bg-rose-600 dark:hover:bg-rose-500 transition-all shadow-2xl shadow-rose-100 dark:shadow-none hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
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
                                        <div key={listing.id} className="group transition-all duration-300">
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
                                        <div key={listing.id} className="transition-transform">
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

