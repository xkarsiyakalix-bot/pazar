import { useState, useEffect, useCallback } from 'react';
import { fetchListings } from '../api/listings';

export const useListings = (category, subCategory = null, initialPage = 1, limit = 20, additionalFilters = {}) => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(initialPage);
    const [hasMore, setHasMore] = useState(true);

    const loadListings = useCallback(async (pageNum, isLoadMore = false) => {
        try {
            setLoading(true);
            const data = await fetchListings({
                category,
                subCategory,
                page: pageNum,
                limit,
                ...additionalFilters
            });

            if (isLoadMore) {
                setListings(prev => [...prev, ...data]);
            } else {
                setListings(data);
            }

            // Ensure we handle hasMore correctly even if data is returned
            if (data.length < limit) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
        } catch (err) {
            console.error('Error loading listings:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [category, subCategory, limit, JSON.stringify(additionalFilters)]);

    // Initial load
    useEffect(() => {
        loadListings(1, false);
    }, [loadListings]);

    const loadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadListings(nextPage, true);
        }
    };

    const refresh = () => {
        setPage(1);
        setHasMore(true);
        loadListings(1, false);
    };

    return {
        listings,
        loading,
        error,
        hasMore,
        loadMore,
        refresh,
        page
    };
};
