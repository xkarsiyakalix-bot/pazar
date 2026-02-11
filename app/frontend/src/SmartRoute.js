import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import StorePage from './components/Store/StorePage';
import NotFoundPage from './NotFoundPage';
import LoadingSpinner from './components/LoadingSpinner';
import { ProductDetail } from './components.js';

const SmartRoute = ({ addToCart, toggleFavorite, isFavorite, toggleFollowSeller, isSellerFollowed }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isStore, setIsStore] = useState(null); // null = loading, true = found, false = not found
    const [isListing, setIsListing] = useState(false);
    const slug = decodeURIComponent(location.pathname.substring(1)); // Remove leading slash and decode
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        // Reserved paths that should never be checked as stores or listings
        const reservedPaths = [
            'login', 'register', 'admin', 'settings', 'profile', 'search', 'packages',
            'privacy', 'terms', 'contact', 'hakkimizda', 'iletisim', 'sitemap', 'robots',
            'my-listings', 'favorites', 'messages', 'notifications', 'checkout', 'payment',
            'ilan', 'product', 'seller', 'store', 'categories'
        ];

        if (!slug || reservedPaths.includes(slug.toLowerCase())) {
            setIsStore(false);
            setIsListing(false);
            return;
        }

        const checkSlug = async () => {
            try {
                // 1. Check if it's a Store Slug
                const { data: storeData, error: storeError } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('store_slug', slug.toLowerCase())
                    .single();

                if (storeData && !storeError) {
                    setIsStore(true);
                    setIsListing(false);
                    return;
                }

                // 2. Check if it's a Listing Slug
                const { data: listingData, error: listingError } = await supabase
                    .from('listings')
                    .select('id')
                    .eq('slug', slug)
                    .single();

                if (listingData && !listingError) {
                    setIsListing(true);
                    setIsStore(false);
                } else {
                    setIsStore(false);
                    setIsListing(false);
                }
            } catch (err) {
                console.error('Error checking slug:', err);
                setIsStore(false);
                setIsListing(false);
            }
        };

        setIsStore(null);
        setIsListing(false);
        checkSlug();
    }, [slug]);

    if (isStore === null) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (isStore) {
        return <StorePage sellerId={slug} />;
    }

    if (isListing) {
        return (
            <ProductDetail
                slug={slug}
                addToCart={addToCart}
                toggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
                toggleFollowSeller={toggleFollowSeller}
                isSellerFollowed={isSellerFollowed}
            />
        );
    }

    return <NotFoundPage />;
};

export default SmartRoute;
