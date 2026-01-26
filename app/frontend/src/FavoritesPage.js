import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { fetchUserFavorites } from './api/favorites';
import { fetchListings } from './api/listings';
import { HorizontalListingCard } from './components';
import LoadingSpinner from './components/LoadingSpinner';

import ProfileLayout from './ProfileLayout';

const FavoritesPage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [listingsData, setListingsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                // Fetch listing details
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

    const handleToggleFavorite = async (listingId) => {
        // Since we are on favorites page, toggling means removing
        // Ideally we call an API to remove and then update state
        // For now, let's just reload or filter out
        // But HorizontalListingCard might expect a toggle function
        // We can import toggleFavorite from context or API if available globally
        // Or just reload
        await loadFavorites();
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Favoriler</h1>

            <div className="bg-white rounded-2xl shadow-lg p-6">
                {listingsData.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-lg font-medium mb-2">Henüz favori ilanınız yok</p>
                        <p className="text-gray-400 mb-6">İlgilendiğiniz ilanları daha sonra kolayca bulmak için kaydedin.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="text-red-600 hover:text-red-700 font-semibold hover:underline"
                        >
                            İlanlara göz at
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {listingsData.map(listing => (
                            <HorizontalListingCard
                                key={listing.id}
                                listing={listing}
                                toggleFavorite={handleToggleFavorite}
                                isFavorite={() => true}
                                isOwnListing={false}
                                compact={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </ProfileLayout>
    );
};

export default FavoritesPage;
