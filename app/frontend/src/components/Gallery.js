import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { ListingCard } from './ListingCard';

export const Gallery = ({ toggleFavorite, isFavorite, priceRange = 'all', filterLocation = 'Tüm Şehirler', sortBy = 'relevance' }) => {
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const { user } = useAuth();
    const isMobile = useIsMobile();
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchTopListings = async () => {
            try {
                setLoading(true);
                const { fetchListings } = await import('../api/listings');
                const { clearCache } = await import('../utils/cache');
                clearCache();

                const data = await fetchListings({
                    select: 'id,title,price,price_type,images,category,sub_category,city,is_top,is_gallery,package_type,promotion_expiry,user_id,created_at'
                }, { count: false });
                let topListings = data.filter(listing =>
                    listing.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(listing.package_type?.toLowerCase())
                );

                if (priceRange !== 'all') {
                    topListings = topListings.filter(listing => {
                        const price = parseFloat(listing.price) || 0;
                        switch (priceRange) {
                            case 'free': return price === 0;
                            case 'under50': return price < 50;
                            case 'under100': return price < 100;
                            case '100-500': return price >= 100 && price <= 500;
                            case '500-1000': return price >= 500 && price <= 1000;
                            case '1000-5000': return price >= 1000 && price <= 5000;
                            case 'over5000': return price > 5000;
                            default: return true;
                        }
                    });
                }

                if (filterLocation && filterLocation !== 'Tüm Şehirler') {
                    topListings = topListings.filter(listing =>
                        listing.city && listing.city.includes(filterLocation)
                    );
                }

                switch (sortBy) {
                    case 'price-asc':
                        topListings.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
                        break;
                    case 'price-desc':
                        topListings.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
                        break;
                    case 'newest':
                        topListings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                        break;
                    case 'oldest':
                        topListings.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                        break;
                    case 'relevance':
                    default:
                        topListings = [...topListings].sort(() => 0.5 - Math.random());
                        break;
                }

                setGalleryItems(topListings);
            } catch (error) {
                console.error('Error fetching top listings:', error);
                setGalleryItems([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTopListings();
    }, [priceRange, filterLocation, sortBy]);

    const maxScroll = Math.max(0, galleryItems.length - itemsPerPage);

    const handleNext = () => {
        if (currentPage < maxScroll) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    return (
        <section className="mt-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900">Vitrin</h2>
                </div>
                {!isMobile && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 0}
                            className="p-1.5 rounded-md bg-white border border-gray-200 hover:border-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            aria-label="Önceki"
                        >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentPage >= maxScroll}
                            className="p-1.5 rounded-md bg-white border border-gray-200 hover:border-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            aria-label="Sonraki"
                        >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            <div className={`relative ${isMobile ? '' : 'overflow-hidden'}`}>
                <div
                    className={`flex transition-transform duration-500 ease-in-out ${isMobile ? 'overflow-x-auto snap-x snap-mandatory scrollbar-hide' : ''}`}
                    style={isMobile ? { gap: '0.5rem' } : {
                        transform: `translateX(-${currentPage * (100 / itemsPerPage)}%)`,
                        gap: '0.5rem'
                    }}
                >
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className={`flex-shrink-0 h-56 bg-gray-50 animate-pulse rounded-lg ${isMobile ? 'snap-start' : ''}`}
                                style={isMobile ? { width: '45%' } : { width: 'calc((100% - 2rem) / 5)' }}
                            />
                        ))
                    ) : (
                        galleryItems.map((item) => (
                            <div
                                key={item.id}
                                className={`flex-shrink-0 ${isMobile ? 'snap-start' : ''}`}
                                style={isMobile ? { width: '45%' } : { width: 'calc((100% - 2rem) / 5)' }}
                            >
                                <ListingCard
                                    listing={item}
                                    toggleFavorite={toggleFavorite}
                                    isFavorite={isFavorite}
                                    isOwnListing={user && item.user_id === user.id}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};
