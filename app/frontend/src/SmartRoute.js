import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import LoadingSpinner from './components/LoadingSpinner';
import { slugToCategoryMap, slugToSubCategoryMap } from './config/categoryConfigs';

const StorePage = React.lazy(() => import('./components/Store/StorePage'));
const NotFoundPage = React.lazy(() => import('./NotFoundPage'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const DynamicCategoryPage = React.lazy(() => import('./pages/DynamicCategoryPage'));

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

                // 2. Check if it's a Listing Slug (clean slug lookup)
                const { data: listingBySlug } = await supabase
                    .from('listings')
                    .select('id, slug')
                    .eq('slug', slug)
                    .maybeSingle();

                if (listingBySlug) {
                    setListingId(listingBySlug.id);
                    setIsListing(true);
                    setIsStore(false);
                    return;
                }

                // 3. Backward compatibility: Check if old URL with UUID at the end
                const idMatch = slug.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
                if (idMatch) {
                    const extractedId = idMatch[0];
                    const { data: listingById } = await supabase
                        .from('listings')
                        .select('id, slug')
                        .eq('id', extractedId)
                        .maybeSingle();

                    if (listingById) {
                        // Redirect old UUID URL to new clean slug URL
                        if (listingById.slug && listingById.slug !== slug) {
                            navigate(`/${listingById.slug}`, { replace: true });
                            return;
                        }
                        setListingId(listingById.id);
                        setIsListing(true);
                        setIsStore(false);
                        return;
                    }
                }

                // 4. Also check old slugs with timestamp suffix (e.g. "title-0375")
                // Try matching by removing trailing numbers after last hyphen
                const oldSlugMatch = slug.match(/^(.+)-\d{4}$/);
                if (oldSlugMatch) {
                    const { data: listingByOldSlug } = await supabase
                        .from('listings')
                        .select('id, slug')
                        .eq('slug', slug)
                        .maybeSingle();

                    if (listingByOldSlug) {
                        setListingId(listingByOldSlug.id);
                        setIsListing(true);
                        setIsStore(false);
                        return;
                    }
                }

                setIsStore(false);
                setIsListing(false);
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

    return (
        <React.Suspense fallback={
            <div className="min-h-[50vh] flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        }>
            {isStore && <StorePage sellerId={slug} />}
            {isCategory && (
                <DynamicCategoryPage
                    category={slug}
                    subCategory={subSlug}
                    toggleFavorite={toggleFavorite}
                    isFavorite={isFavorite}
                />
            )}
            {isListing && (
                <ProductDetail
                    id={listingId}
                    slug={slug}
                    addToCart={addToCart}
                    toggleFavorite={toggleFavorite}
                    isFavorite={isFavorite}
                    toggleFollowSeller={toggleFollowSeller}
                    isSellerFollowed={isSellerFollowed}
                />
            )}
            {!isStore && !isCategory && !isListing && <NotFoundPage />}
        </React.Suspense>
    );
};

export default SmartRoute;
