import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { ListingCard } from './ListingCard';
import { t } from '../translations';
import { useNavigate } from 'react-router-dom';
import { GalleryInfoModal } from './GalleryInfoModal';

export const Gallery = ({ toggleFavorite, isFavorite, priceRange = 'all', filterLocation = 'Tüm Şehirler', sortBy = 'relevance' }) => {
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const { user } = useAuth();
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Responsive items per page
    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth < 640) setItemsPerPage(2);
            else if (window.innerWidth < 1024) setItemsPerPage(3);
            else setItemsPerPage(5);
        };
        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);
        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, []);

    useEffect(() => {
        const fetchTopListings = async () => {
            try {
                setLoading(true);
                const { fetchListings } = await import('../api/listings');
                const { clearCache } = await import('../utils/cache');
                clearCache();

                const data = await fetchListings({
                    select: 'id,title,price,price_type,images,category,sub_category,city,is_top,is_gallery,package_type,promotion_expiry,user_id,created_at,slug'
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
                setCurrentPage(0); // Reset to first page on data change
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
                <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-50">Vitrin</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowInfoModal(true)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
                    >
                        {t.topAds.placeAd}
                    </button>
                    {galleryItems.length > itemsPerPage && !isMobile && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrev}
                                disabled={currentPage === 0}
                                className="p-2 rounded-full bg-white dark:bg-neutral-800 border-2 border-gray-200 dark:border-white/10 hover:border-red-500 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed shadow-md transition-all z-10"
                                aria-label="Önceki"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentPage >= maxScroll}
                                className="p-2 rounded-full bg-white dark:bg-neutral-800 border-2 border-gray-200 dark:border-white/10 hover:border-red-500 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed shadow-md transition-all z-10"
                                aria-label="Sonraki"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="relative overflow-hidden">
                <div
                    className={`${isMobile ? 'overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4' : 'overflow-hidden'} flex items-stretch py-1.5`}
                >
                    <div
                        className="flex transition-transform duration-500 ease-in-out items-stretch w-full"
                        style={{
                            transform: !isMobile ? `translateX(-${currentPage * (100 / itemsPerPage)}%)` : 'none',
                            gap: isMobile ? '1rem' : '1.25rem'
                        }}
                    >
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex-shrink-0 h-56 bg-gray-200 dark:bg-neutral-800 animate-pulse rounded-lg ${isMobile ? 'snap-start' : ''}`}
                                    style={{
                                        width: isMobile ? 'calc(45% - 0.75rem)' : `calc((100% - ${(itemsPerPage - 1) * 1.25}rem) / ${itemsPerPage})`,
                                        minWidth: isMobile ? 'calc(45% - 0.75rem)' : 'auto'
                                    }}
                                />
                            ))
                        ) : (
                            galleryItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex-shrink-0 ${isMobile ? 'snap-start' : ''}`}
                                    style={{
                                        width: isMobile ? 'calc(45% - 0.75rem)' : `calc((100% - ${(itemsPerPage - 1) * 1.25}rem) / ${itemsPerPage})`,
                                        minWidth: isMobile ? 'calc(45% - 0.75rem)' : 'auto'
                                    }}
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
            </div>
            <GalleryInfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
        </section>
    );
};

export default Gallery;

