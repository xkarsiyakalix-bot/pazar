import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ListingCard } from './components';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuth } from './contexts/AuthContext';
import { fetchListings } from './api/listings';

export const SmartRecommendations = ({ toggleFavorite, isFavorite }) => {
    const [displayedListings, setDisplayedListings] = useState([]);
    const [allRecommendations, setAllRecommendations] = useState([]);
    const [currentCount, setCurrentCount] = useState(30);
    const [loading, setLoading] = useState(true);
    const [allListings, setAllListings] = useState([]);
    const { user } = useAuth();
    const loaderRef = useRef(null);

    // Fetch all listings from Supabase
    useEffect(() => {
        const loadListings = async () => {
            try {
                // Fetch listings from Supabase, skip count for speed
                console.log('SmartRecommendations: Fetching listings from Supabase...');
                const data = await fetchListings({}, { count: false });
                console.log(`SmartRecommendations: Fetched ${data?.length || 0} listings`);
                setAllListings(data);
            } catch (error) {
                console.error('SmartRecommendations: Error fetching listings:', error);
                setAllListings([]);
            }
        };
        loadListings();
    }, []);

    const generateRecommendations = useCallback((userHistory) => {
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
    }, [allListings]);

    useEffect(() => {
        if (allListings.length === 0) {
            setLoading(false);
            return;
        }

        // Get user history from localStorage
        const userHistory = {
            searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
            viewedCategories: JSON.parse(localStorage.getItem('viewedCategories') || '[]'),
            viewedListings: JSON.parse(localStorage.getItem('viewedListings') || '[]'),
            favorites: JSON.parse(localStorage.getItem('favorites') || '[]')
        };

        // Generate personalized recommendations
        let recommendations = generateRecommendations(userHistory);

        // RELAUNCH: Ensure Vitrin (galerie) listings appear twice, distributed far apart
        const vitrinListings = recommendations.filter(l => l.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(l.package_type?.toLowerCase()));
        if (vitrinListings.length > 0) {
            // Keep the first 10
            const firstPart = recommendations.slice(0, 10);
            const remainingPart = recommendations.slice(10);

            const distributedListings = [...remainingPart];
            vitrinListings.forEach(l => {
                // Insert duplicates way down in the list (e.g., after 40th position)
                const minPos = Math.min(distributedListings.length, 30);
                const insertPos = minPos + Math.floor(Math.random() * (distributedListings.length - minPos));
                distributedListings.splice(insertPos, 0, l);
            });

            recommendations = [...firstPart, ...distributedListings];
        }

        setAllRecommendations(recommendations);
        setDisplayedListings(recommendations.slice(0, 30));
        setLoading(false);
    }, [allListings, generateRecommendations]);

    const getDiverseListings = () => {
        // Helper to get priority score
        const getPromoPriority = (l) => {
            const type = l.package_type?.toLowerCase();
            // RELAUNCH: Lower base scores to allow mixing with regular items
            let score = 0;
            if (type === 'z_premium' || type === 'premium') score = 40;
            else if (l.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(type)) score = 35;
            else if (type === 'z_multi_bump' || type === 'multi-bump') score = 30;
            else if (l.is_top) score = 25;
            else if (l.is_highlighted || type === 'highlight' || type === 'budget') score = 20;

            // Add high randomness so they spread across the whole list
            return score + (Math.random() * 150);
        };

        // Get unique categories
        const categories = [...new Set(allListings.map(l => l.category))];
        const diverseListings = [];

        // Get 2-3 listings from each category, prioritizing promoted ones
        categories.forEach(category => {
            const categoryListings = allListings
                .filter(l => l.category === category)
                .sort((a, b) => {
                    const prioA = getPromoPriority(a);
                    const prioB = getPromoPriority(b);
                    if (prioA !== prioB) return prioB - prioA;
                    return 0.5 - Math.random(); // Random within same priority
                })
                .slice(0, 3);
            diverseListings.push(...categoryListings);
        });

        // Final sort: Promoted items should be mixed together at the top
        return diverseListings.sort((a, b) => {
            const prioA = getPromoPriority(a);
            const prioB = getPromoPriority(b);
            // Since we added randomness in getPromoPriority, we just sort by that
            if (prioA !== prioB) return prioB - prioA;
            return 0.5 - Math.random();
        });
    };

    const getPersonalizedListings = (userHistory) => {
        const scoredListings = allListings.map(listing => {
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
                if (listing.title && listing.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                    score += 40;
                }
                if (listing.description && listing.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                    score += 20;
                }
            });

            // Boost score for similar items to favorites
            if (userHistory.favorites.length > 0) {
                const favoriteListings = allListings.filter(l => userHistory.favorites.includes(l.id));
                favoriteListings.forEach(fav => {
                    if (fav.category === listing.category) score += 25;
                    if (fav.subCategory === listing.subCategory) score += 15;
                    if (fav.city === listing.city) score += 10;
                });
            }

            // RELAUNCH: Lower boosts + higher random factor to mix with regular listings
            const type = listing.package_type?.toLowerCase();
            let promoBoost = 0;
            if (type === 'z_premium' || type === 'premium') promoBoost = 60;
            else if (listing.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(type)) promoBoost = 55;
            else if (type === 'z_multi_bump' || type === 'multi-bump') promoBoost = 50;
            else if (listing.is_top) promoBoost = 45;
            else if (listing.is_highlighted || type === 'highlight' || type === 'budget') promoBoost = 40;

            score += promoBoost;

            // Add HUGE randomness (0-200) to ensure items are scattered across the whole list
            score += Math.random() * 200;

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

    const loadMore = useCallback(() => {
        if (currentCount >= allRecommendations.length) return;

        const newCount = currentCount + 30;
        setDisplayedListings(allRecommendations.slice(0, newCount));
        setCurrentCount(newCount);
    }, [currentCount, allRecommendations]);

    const hasMore = currentCount < allRecommendations.length;

    // Infinite Scroll Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [loadMore, hasMore, loading]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="medium" />
            </div>
        );
    }

    return (
        <div>
            {/* Listings Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {displayedListings.map((listing, index) => (
                    <ListingCard
                        key={`${listing.id}-${index}`}
                        listing={listing}
                        toggleFavorite={toggleFavorite}
                        isFavorite={isFavorite}
                        isOwnListing={user && listing.user_id === user.id}
                    />
                ))}
            </div>

            {/* Loading Sentinel */}
            {hasMore && (
                <div ref={loaderRef} className="flex justify-center py-8">
                    <LoadingSpinner size="small" />
                </div>
            )}

            {/* End Message */}
            {!hasMore && displayedListings.length > 0 && (
                <div className="text-center mt-8 py-6 text-gray-500">
                    <p className="text-lg font-medium">Tüm öneriler bu kadar</p>
                    <p className="text-sm mt-2">Daha fazla ilan bulmak için aramayı veya kategorileri kullanın</p>
                </div>
            )}
        </div>
    );
};
