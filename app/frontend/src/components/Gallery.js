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
    const { user } = useAuth();
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const [showInfoModal, setShowInfoModal] = useState(false);
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
        <>
            <section className="mt-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-50">Vitrin</h2>
                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        onClick={() => setShowInfoModal(true)}
                        className="text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 hover:underline transition-colors focus:outline-none"
                        aria-label="Add listing to top ads"
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
                        ) : galleryItems.length === 0 ? (
                            <div className="w-full">
                                <div className="bg-white dark:bg-neutral-950 rounded-3xl overflow-hidden border border-gray-200 dark:border-white/5 shadow-lg max-w-4xl mx-auto my-4 transform transition-all">
                                    {/* Header with Premium Pattern */}
                                    <div className="relative h-28 md:h-36 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 flex items-center justify-center overflow-hidden border-b border-gray-200 dark:border-white/10">
                                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent"></div>
                                        <div className="text-center z-10 p-6">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md mb-2">
                                                ⭐ VİTRİN İLANI
                                            </span>
                                            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                                                Kategoride Fark Edilin!
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Content Body */}
                                    <div className="p-4 md:p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                                            <div className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-sm">🚀</div>
                                                <div>
                                                    <h3 className="text-xs font-black text-gray-900 dark:text-white mb-1">Daha Fazla Başvuru</h3>
                                                    <p className="text-[10px] text-gray-600 dark:text-neutral-400 font-medium">Öne çıkan konumla daha fazla alıcıya ulaşın.</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-sm">📅</div>
                                                <div>
                                                    <h3 className="text-xs font-black text-gray-900 dark:text-white mb-1">10 Günlük Döngü</h3>
                                                    <p className="text-[10px] text-gray-600 dark:text-neutral-400 font-medium">İlanınız kategori sayfasında en üstte döner.</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-sm">💎</div>
                                                <div>
                                                    <h3 className="text-xs font-black text-gray-900 dark:text-white mb-1">Premium Etkisi</h3>
                                                    <p className="text-[10px] text-gray-600 dark:text-neutral-400 font-medium">Dikkat çeken ilanlarla satışınızı hızlandırın.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center gap-3">
                                            <button
                                                onClick={() => {
                                                    const navigate = window.location.href.includes('/profile') 
                                                    ? () => window.location.reload() 
                                                    : () => window.location.href = '/profile?tab=listings';
                                                    navigate();
                                                }}
                                                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-white font-black py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all text-sm transform hover:-translate-y-0.5"
                                            >
                                                Şimdi İlan Seç
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
        </section>
            <GalleryInfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
        </>
    );
};

export default Gallery;

