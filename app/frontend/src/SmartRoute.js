import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import StorePage from './components/Store/StorePage';
import NotFoundPage from './NotFoundPage';
import LoadingSpinner from './components/LoadingSpinner';
import { ProductDetail } from './components';
import { slugToCategoryMap, slugToSubCategoryMap } from './config/categoryConfigs';
import DynamicCategoryPage from './pages/DynamicCategoryPage';

const SmartRoute = ({ addToCart, toggleFavorite, isFavorite, toggleFollowSeller, isSellerFollowed }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isStore, setIsStore] = useState(null); // null = loading, true = found, false = not found
    const [isListing, setIsListing] = useState(false);
    const [listingId, setListingId] = useState(null);
    const [isCategory, setIsCategory] = useState(false);
    const pathParts = location.pathname.split('/').filter(Boolean);
    const slug = decodeURIComponent(pathParts[0] || "");
    const subSlug = decodeURIComponent(pathParts[1] || "");
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
            // 0. Check if it's a Category
            const isCat = Object.keys(slugToCategoryMap).some(key => key.toLowerCase() === slug.toLowerCase());
            if (isCat) {
                setIsCategory(true);
                setIsStore(false);
                setIsListing(false);
                return;
            }

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
                // Extract UUID if present at the end of the slug
                const idMatch = slug.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
                const extractedId = idMatch ? idMatch[0] : null;

                let listingQuery = supabase.from('listings').select('id');
                
                if (extractedId) {
                    listingQuery = listingQuery.eq('id', extractedId);
                } else {
                    listingQuery = listingQuery.eq('slug', slug);
                }

                const { data: listingData } = await listingQuery.single();

                if (listingData) {
                    setListingId(listingData.id);
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
        setIsCategory(false);
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

    if (isCategory) {
        return (
            <DynamicCategoryPage
                category={slug}
                subCategory={subSlug}
                toggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
            />
        );
    }

    if (isListing) {
        return (
            <ProductDetail
                id={listingId}
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
