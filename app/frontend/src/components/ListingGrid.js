import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ListingCard } from './ListingCard';
import LoadingSpinner from './LoadingSpinner';

export const ListingGrid = ({ isLatest = false, selectedCategory = 'Tüm Kategoriler', searchTerm = '', toggleFavorite, isFavorite }) => {
    const [apiListings, setApiListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Fetch latest listings from backend when isLatest is true
    useEffect(() => {
        if (isLatest) {
            const fetchLatestListings = async () => {
                try {
                    setLoading(true);
                    const { fetchListings } = await import('../api/listings');
                    const data = await fetchListings({
                        sort_by_newest: true,
                        select: 'id,title,price,price_type,images,category,sub_category,city,is_top,is_gallery,package_type,promotion_expiry,user_id,created_at'
                    }, { count: false });
                    const latestListings = data.slice(0, 30);
                    setApiListings(latestListings);
                } catch (error) {
                    console.error('Error fetching latest listings:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchLatestListings();
        }
    }, [isLatest]);

    const allListings = isLatest && apiListings.length > 0
        ? apiListings.map(listing => ({
            ...listing,
            image: Array.isArray(listing.images) && listing.images.length > 0
                ? listing.images[0]
                : listing.image || '/placeholder-image.jpg',
            price: listing.price,
            price_type: listing.price_type
        }))
        : [];

    const filtered = allListings.filter(l => {
        const matchesCategory = selectedCategory === 'Tüm Kategoriler' || l.category === selectedCategory;
        const matchesSearch = !searchTerm ||
            (l.title && l.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (l.description && l.description.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const displayListings = (() => {
        const totalListings = isLatest ? filtered.slice(0, 50) : filtered.slice(0, 10);
        const galleryItems = totalListings.filter(l => l.is_gallery);
        const regularItems = totalListings.filter(l => !l.is_gallery);

        const interleaved = [];
        let galleryIndex = 0;

        for (let i = 0; i < regularItems.length; i++) {
            if (i % 15 === 0 && galleryIndex < galleryItems.length) {
                interleaved.push(galleryItems[galleryIndex]);
                galleryIndex++;
            }
            interleaved.push(regularItems[i]);
        }

        while (galleryIndex < galleryItems.length) {
            interleaved.push(galleryItems[galleryIndex]);
            galleryIndex++;
        }

        return interleaved;
    })();

    if (loading && isLatest) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-white rounded-xl shadow-md h-64 overflow-hidden border border-gray-100">
                        <div className="bg-gray-200 h-32 w-full"></div>
                        <div className="p-3 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (displayListings.length === 0) {
        if (selectedCategory !== 'Tüm Kategoriler' && !isLatest && filtered.length === 0) {
            return (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                    "{selectedCategory}" kategorisinde ilan bulunamadı.
                </div>
            );
        }
        return null;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
            {displayListings.map((listing) => (
                <ListingCard
                    key={listing.id}
                    listing={listing}
                    toggleFavorite={toggleFavorite}
                    isFavorite={isFavorite}
                    isOwnListing={user && listing.user_id === user.id}
                />
            ))}
        </div>
    );
};
