import React, { useState, useEffect } from 'react';
import { mockListings } from './components';
import { ListingCard } from './components';

export const SmartRecommendations = ({ toggleFavorite, isFavorite }) => {
    const [displayedListings, setDisplayedListings] = useState([]);
    const [allRecommendations, setAllRecommendations] = useState([]);
    const [currentCount, setCurrentCount] = useState(30);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get user history from localStorage
        const userHistory = {
            searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
            viewedCategories: JSON.parse(localStorage.getItem('viewedCategories') || '[]'),
            viewedListings: JSON.parse(localStorage.getItem('viewedListings') || '[]'),
            favorites: JSON.parse(localStorage.getItem('favorites') || '[]')
        };

        // Generate personalized recommendations
        const recommendations = generateRecommendations(userHistory);
        setAllRecommendations(recommendations);
        setDisplayedListings(recommendations.slice(0, 30));
        setLoading(false);
    }, []);

    const generateRecommendations = (userHistory) => {
        const isNewUser = userHistory.viewedCategories.length === 0 &&
            userHistory.searchHistory.length === 0 &&
            userHistory.viewedListings.length === 0;

        if (isNewUser) {
            // For new users: Show diverse listings from different categories
            return getDiverseListings();
        } else {
            // For returning users: Personalized recommendations
            return getPersonalizedListings(userHistory);
        }
    };

    const getDiverseListings = () => {
        // Get unique categories
        const categories = [...new Set(mockListings.map(l => l.category))];
        const diverseListings = [];

        // Get 2-3 listings from each category
        categories.forEach(category => {
            const categoryListings = mockListings
                .filter(l => l.category === category)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);
            diverseListings.push(...categoryListings);
        });

        // Shuffle and return
        return diverseListings.sort(() => 0.5 - Math.random());
    };

    const getPersonalizedListings = (userHistory) => {
        const scoredListings = mockListings.map(listing => {
            let score = 0;

            // Boost score based on viewed categories
            if (userHistory.viewedCategories.includes(listing.category)) {
                score += 50;
            }
            if (userHistory.viewedCategories.includes(listing.subCategory)) {
                score += 30;
            }

            // Boost score based on search history
            userHistory.searchHistory.forEach(searchTerm => {
                if (listing.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                    score += 40;
                }
                if (listing.description && listing.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                    score += 20;
                }
            });

            // Boost score for similar items to favorites
            if (userHistory.favorites.length > 0) {
                const favoriteListings = mockListings.filter(l => userHistory.favorites.includes(l.id));
                favoriteListings.forEach(fav => {
                    if (fav.category === listing.category) score += 25;
                    if (fav.subCategory === listing.subCategory) score += 15;
                    if (fav.city === listing.city) score += 10;
                });
            }

            // Boost for top listings
            if (listing.isTop) {
                score += 10;
            }

            // Penalize already viewed listings
            if (userHistory.viewedListings.includes(listing.id)) {
                score -= 100;
            }

            // Add some randomness to avoid being too predictable
            score += Math.random() * 5;

            return { ...listing, score };
        });

        // Sort by score and return
        return scoredListings
            .sort((a, b) => b.score - a.score)
            .map(({ score, ...listing }) => listing);
    };

    const loadMore = () => {
        const newCount = currentCount + 15;
        setDisplayedListings(allRecommendations.slice(0, newCount));
        setCurrentCount(newCount);
    };

    const hasMore = currentCount < allRecommendations.length;

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Listings Grid */}
            <div className="grid grid-cols-5 gap-3">
                {displayedListings.map((listing) => (
                    <ListingCard
                        key={listing.id}
                        listing={listing}
                        toggleFavorite={toggleFavorite}
                        isFavorite={isFavorite}
                    />
                ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={loadMore}
                        className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                    >
                        Weitere Anzeigen laden
                    </button>
                </div>
            )}

            {/* End Message */}
            {!hasMore && displayedListings.length > 0 && (
                <div className="text-center mt-8 py-6 text-gray-500">
                    <p className="text-lg font-medium">Das waren alle Empfehlungen</p>
                    <p className="text-sm mt-2">Nutzen Sie die Suche oder Kategorien, um mehr Anzeigen zu finden</p>
                </div>
            )}
        </div>
    );
};
