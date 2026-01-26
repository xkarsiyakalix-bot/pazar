import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import StorePage from './components/Store/StorePage';
import NotFoundPage from './NotFoundPage';
import LoadingSpinner from './components/LoadingSpinner';

const SmartRoute = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isStore, setIsStore] = useState(null); // null = loading, true = found, false = not found
    const slug = decodeURIComponent(location.pathname.substring(1)); // Remove leading slash and decode
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        // Reserved paths that should never be checked as stores
        // Although React Router handles exact matches first, this is a safety check
        const reservedPaths = [
            'login', 'register', 'admin', 'settings', 'profile', 'search', 'packages',
            'privacy', 'terms', 'contact', 'hakkimizda', 'iletisim', 'sitemap', 'robots'
        ];

        if (!slug || reservedPaths.includes(slug.toLowerCase())) {
            setIsStore(false);
            return;
        }

        const checkSlug = async () => {
            try {
                // Determine if we should query by ID or Slug
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
                if (isUuid) {
                    setIsStore(false); // UUIDs should go to /store/:id usually, but if catch-all caught it, treating as 404 or let StorePage redirect?
                    // Actually, if we are here, it's NOT /store/UUID (captured by other route).
                    // It's /UUID at root. We can support /UUID root too!
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('id, store_slug')
                        .eq('id', slug)
                        .single();

                    if (data && !error) {
                        // If it's a UUID at root, we should probably redirect to cleaner slug if available
                        if (data.store_slug) {
                            window.location.replace(`/${data.store_slug}`);
                            return;
                        }
                        setIsStore(true);
                    } else {
                        setIsStore(false);
                    }
                    return;
                }

                // Normal Slug Check
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('store_slug', slug.toLowerCase()) // Force lowercase match
                    .single();

                if (data && !error) {
                    setIsStore(true);
                } else {
                    console.error('No store found for slug:', slug);
                    handleError();
                }
            } catch (err) {
                console.error('Error checking store slug:', err);
                handleError();
            }
        };

        const handleError = () => {
            if (retryCount < 2) {
                setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                }, 1000); // Wait 1 second before retrying
            } else {
                setIsStore(false);
            }
        };

        setIsStore(null); // Keep loading state
        checkSlug();
    }, [slug, retryCount]);

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

    // If it's a reserved path, don't show 404 here, let App.js handle it
    const reservedPaths = [
        'login', 'register', 'admin', 'settings', 'profile', 'search', 'packages',
        'privacy', 'terms', 'contact', 'hakkimizda', 'iletisim', 'sitemap', 'robots',
        'my-listings', 'favorites', 'messages', 'notifications', 'checkout', 'payment'
    ];

    if (reservedPaths.includes(slug.toLowerCase())) {
        return null;
    }

    return <NotFoundPage />;
};

export default SmartRoute;
