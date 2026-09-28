import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import ProductDetailSkeleton from './components/skeletons/ProductDetailSkeleton';
import { slugToCategoryMap } from './config/categoryConfigs';
import { findBrandBySlug } from './utils/brandUtils';

const StorePage = React.lazy(() => import('./components/Store/StorePage'));
const NotFoundPage = React.lazy(() => import('./NotFoundPage'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const DynamicCategoryPage = React.lazy(() => import('./pages/DynamicCategoryPage'));
const BrandPage = React.lazy(() => import('./pages/BrandPage'));

const SmartRoute = ({ addToCart, toggleFavorite, isFavorite, toggleFollowSeller, isSellerFollowed }) => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const pathParts = location.pathname.split('/').filter(Boolean);
    const slug = decodeURIComponent(pathParts[0] || "");
    const subSlug = decodeURIComponent(pathParts[1] || "");

    const stateListing = location.state?.listing;
    const isStateListing = Boolean(
        stateListing && (
            stateListing.slug === slug ||
            stateListing.id === slug ||
            String(stateListing.id) === slug ||
            (stateListing.slug && decodeURIComponent(stateListing.slug) === slug)
        )
    );

    const [isStore, setIsStore] = useState(isStateListing ? false : null);
    const [isListing, setIsListing] = useState(isStateListing);
    const [isBrand, setIsBrand] = useState(false);
    const [listingId, setListingId] = useState(isStateListing ? stateListing.id : null);
    const [isCategory, setIsCategory] = useState(false);

    useEffect(() => {
        const reservedPaths = [
            'login', 'register', 'admin', 'settings', 'profile', 'search', 'packages',
            'privacy', 'terms', 'contact', 'hakkimizda', 'iletisim', 'sitemap', 'robots',
            'my-listings', 'favorites', 'messages', 'notifications', 'checkout', 'payment',
            'ilan', 'product', 'seller', 'store', 'categories', 'add-listing', 'ilan-ver'
        ];

        if (!slug || reservedPaths.includes(slug.toLowerCase())) {
            setIsStore(false);
            setIsListing(false);
            setIsBrand(false);
            return;
        }

        // If listing is already provided in navigation state, skip all DB queries!
        if (stateListing && (
            stateListing.slug === slug ||
            stateListing.id === slug ||
            String(stateListing.id) === slug ||
            (stateListing.slug && decodeURIComponent(stateListing.slug) === slug)
        )) {
            setIsListing(true);
            setListingId(stateListing.id);
            setIsStore(false);
            setIsBrand(false);
            setIsCategory(false);
            return;
        }

        const checkSlug = async () => {
            // 0. Check if it's a Category
            const isCat = Object.keys(slugToCategoryMap).some(key => key.toLowerCase() === slug.toLowerCase());
            if (isCat) {
                setIsCategory(true);
                setIsStore(false);
                setIsListing(false);
                setIsBrand(false);
                return;
            }

            // 0.5. Check if it's a known Brand
            const brandInfo = findBrandBySlug(slug);
            if (brandInfo) {
                setIsBrand(true);
                setIsStore(false);
                setIsListing(false);
                setIsCategory(false);
                return;
            }

            try {
                // 1. Check if it's a Listing Slug first (99% of requests)
                const { data: listingBySlug } = await supabase
                    .from('listings')
                    .select('id, slug')
                    .eq('slug', slug)
                    .maybeSingle();

                if (listingBySlug) {
                    setListingId(listingBySlug.id);
                    setIsListing(true);
                    setIsStore(false);
                    setIsBrand(false);
                    return;
                }

                // 2. Check if it's a Store Slug
                const { data: storeData, error: storeError } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('store_slug', slug.toLowerCase())
                    .single();

                if (storeData && !storeError) {
                    setIsStore(true);
                    setIsListing(false);
                    setIsBrand(false);
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
                        if (listingById.slug && listingById.slug !== slug) {
                            navigate(`/${listingById.slug}`, { replace: true });
                            return;
                        }
                        setListingId(listingById.id);
                        setIsListing(true);
                        setIsStore(false);
                        setIsBrand(false);
                        return;
                    }
                }

                // 4. Also check old slugs with timestamp suffix (e.g. "title-0375")
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
                        setIsBrand(false);
                        return;
                    }
                }

                // 5. Check if it matches any custom brand recorded in database
                const cleanSlug = slug.toLowerCase().trim();
                const { data: customBrandListing } = await supabase
                    .from('listings')
                    .select('id')
                    .or(`marke.ilike.%${cleanSlug}%,car_brand.ilike.%${cleanSlug}%,damenbekleidung_marke.ilike.%${cleanSlug}%,damenschuhe_marke.ilike.%${cleanSlug}%,herrenbekleidung_marke.ilike.%${cleanSlug}%,herrenschuhe_marke.ilike.%${cleanSlug}%`)
                    .limit(1)
                    .maybeSingle();

                if (customBrandListing) {
                    setIsBrand(true);
                    setIsStore(false);
                    setIsListing(false);
                    return;
                }

                setIsStore(false);
                setIsListing(false);
                setIsBrand(false);
            } catch (err) {
                console.error('Error checking slug:', err);
                setIsStore(false);
                setIsListing(false);
                setIsBrand(false);
            }
        };

        setIsStore(null);
        setIsListing(false);
        setIsCategory(false);
        setIsBrand(false);
        checkSlug();
    }, [slug]);

    if (isStore === null) {
        return <ProductDetailSkeleton />;
    }

    return (
        <React.Suspense fallback={<ProductDetailSkeleton />}>
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
            {isBrand && (
                <BrandPage
                    slug={slug}
                    toggleFavorite={toggleFavorite}
                    isFavorite={isFavorite}
                />
            )}
            {!isStore && !isCategory && !isListing && !isBrand && <NotFoundPage />}
        </React.Suspense>
    );
};

export default SmartRoute;
