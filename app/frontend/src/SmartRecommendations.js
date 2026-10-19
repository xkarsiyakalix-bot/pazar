import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ListingCard } from './components';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuth } from './contexts/AuthContext';
import { fetchListings } from './api/listings';
import { useIsMobile } from './hooks/useIsMobile';

const PAGE_SIZE = 30;

const SELECT_FIELDS = 'id,title,price,price_type,images,category,sub_category,city,district,is_top,is_gallery,is_highlighted,is_multi_bump,package_type,promotion_expiry,user_id,created_at,slug,reserved_by,reserved_until';

// Priority score for promoted listings (deterministic part)
const getPromoPriority = (l) => {
    const type = l.package_type?.toLowerCase();
    if (type === 'z_premium' || type === 'premium') return 40;
    if (l.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(type)) return 35;
    if (type === 'z_multi_bump' || type === 'multi-bump') return 30;
    if (l.is_top) return 25;
    if (l.is_highlighted || type === 'highlight' || type === 'budget') return 20;
    return 0;
};

// Shuffle a batch while keeping promoted listings slightly ahead
const sortBatch = (listings) =>
    listings
        .map(l => ({ ...l, _sort: getPromoPriority(l) + Math.random() * 150 }))
        .sort((a, b) => b._sort - a._sort)
        .map(({ _sort, ...l }) => l);

export const SmartRecommendations = ({ toggleFavorite, isFavorite }) => {
    const isMobile = useIsMobile();
    const pageSize = isMobile ? 12 : PAGE_SIZE;
    const [displayedListings, setDisplayedListings] = useState([]);
    const [page, setPage] = useState(1);
    const [startPage, setStartPage] = useState(null); // randomized start page
    const [inView, setInView] = useState(!isMobile);
    const [loading, setLoading] = useState(!isMobile);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useAuth();
    const loaderRef = useRef(null);
    const sectionRef = useRef(null);
    const initialLoad = useRef(false);

    // On mobile, defer loading until user approaches the section
    useEffect(() => {
        if (inView) return;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setInView(true);
                observer.disconnect();
            }
        }, { rootMargin: '400px' });

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        return () => observer.disconnect();
    }, [inView]);

    // Score a listing based on user history (personalization)
    const scoreListings = useCallback((listings) => {
        const userHistory = {
            searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
            viewedCategories: JSON.parse(localStorage.getItem('viewedCategories') || '[]'),
            viewedListings: JSON.parse(localStorage.getItem('viewedListings') || '[]'),
            favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
        };

        const isNewUser =
            userHistory.viewedCategories.length === 0 &&
            userHistory.searchHistory.length === 0 &&
            userHistory.viewedListings.length === 0;

        if (isNewUser) return sortBatch(listings);

        return listings
            .map(listing => {
                let score = getPromoPriority(listing);

                if (userHistory.viewedCategories.includes(listing.category)) score += 50;
                if (userHistory.viewedCategories.includes(listing.sub_category)) score += 30;

                userHistory.searchHistory.forEach(term => {
                    if (listing.title?.toLowerCase().includes(term.toLowerCase())) score += 40;
                });

                if (userHistory.viewedListings.includes(listing.id)) score -= 100;

                score += Math.random() * 200; // scatter
                return { ...listing, _score: score };
            })
            .sort((a, b) => b._score - a._score)
            .map(({ _score, ...l }) => l);
    }, []);

    // Fetch a page of listings (absolute page number from DB)
    const loadPage = useCallback(async (absolutePage, isFirst = false) => {
        if (isFirst) setLoading(true);
        else setLoadingMore(true);

        try {
            const data = await fetchListings(
                { page: absolutePage, limit: pageSize, select: SELECT_FIELDS },
                { count: false }
            );

            const sorted = scoreListings(data || []);

            setDisplayedListings(prev => {
                const existingIds = new Set(prev.map(l => l.id));
                const fresh = sorted.filter(l => !existingIds.has(l.id));
                return [...prev, ...fresh];
            });

            if (!data || data.length < pageSize) {
                setHasMore(false);
            }
        } catch (err) {
            console.error('SmartRecommendations fetch error:', err);
            setHasMore(false);
        } finally {
            if (isFirst) setLoading(false);
            else setLoadingMore(false);
        }
    }, [scoreListings, pageSize]);

    // Initial load with randomized start page
    useEffect(() => {
        if (!inView || initialLoad.current) return;
        initialLoad.current = true;

        const init = async () => {
            setLoading(true);
            try {
                // Get total count to pick a random starting offset
                const { supabase } = await import('./lib/supabase');
                const { count } = await supabase
                    .from('listings')
                    .select('id', { count: 'exact', head: true })
                    .eq('status', 'active');

                const totalPages = Math.max(1, Math.floor((count || pageSize) / pageSize));
                // Pick a random page, but leave last ~3 pages so there's still content to scroll
                const maxStart = Math.max(1, totalPages - 3);
                const randomPage = Math.floor(Math.random() * maxStart) + 1;
                setStartPage(randomPage);
                setPage(randomPage);
                await loadPage(randomPage, false);
            } catch (e) {
                // Fall back to page 1 if count fails
                setStartPage(1);
                await loadPage(1, false);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [inView, loadPage, pageSize]);

    // Infinite scroll — load next page when sentinel is visible
    const handleIntersect = useCallback((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadPage(nextPage, false);
        }
    }, [hasMore, loading, loadingMore, page, loadPage]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersect, { threshold: 0.1 });
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [handleIntersect]);

    if (!inView) {
        return <div ref={sectionRef} className="min-h-[120px]" />;
    }

    if (loading) {
        return (
            <div ref={sectionRef} className="flex justify-center items-center py-12 min-h-[120px]">
                <LoadingSpinner size="medium" />
            </div>
        );
    }

    return (
        <div ref={sectionRef}>
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

            {/* Infinite scroll sentinel */}
            {hasMore && (
                <div ref={loaderRef} className="flex justify-center py-8">
                    {loadingMore && <LoadingSpinner size="small" />}
                </div>
            )}

            {/* End of listings */}
            {!hasMore && displayedListings.length > 0 && (
                <div className="text-center mt-8 py-6 text-gray-500 dark:text-neutral-400">
                    <p className="text-lg font-medium">Tüm öneriler bu kadar</p>
                    <p className="text-sm mt-2">Daha fazla ilan bulmak için aramayı veya kategorileri kullanın</p>
                </div>
            )}
        </div>
    );
};
