import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ListingCard } from './ListingCard';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { SKELETON_CONFIG } from '../config/skeletonConfig';
import { ListingGridSkeleton } from './skeletons/ListingCardSkeleton';

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
          // Import fetchListings from api/listings
          const { fetchListings } = await import('../api/listings');
          // Fetch latest 30 listings sorted strictly by created_at desc (ignoring top priority for Son İlanlar)
          const data = await fetchListings({ sort_by_newest: true }, { count: false });

          // Take only first 30 listings (already sorted by created_at desc)
          const latestListings = data.slice(0, 30);

          console.log('Fetched latest listings from Supabase:', latestListings);
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

  // Use only API listings (no mock data)
  const allListings = isLatest && apiListings.length > 0
    ? apiListings.map(listing => ({
      ...listing,
      // Ensure image field is properly formatted
      image: Array.isArray(listing.images) && listing.images.length > 0
        ? listing.images[0]
        : listing.image || '/placeholder-image.jpg',
      // price handling will be done in ListingCard
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

  // Trust the API's sorting, but interleave Gallery items every 15 items
  const displayListings = (() => {
    const totalListings = isLatest ? filtered.slice(0, 50) : filtered.slice(0, 10);

    // Separate gallery items
    const galleryItems = totalListings.filter(l => l.is_gallery);
    const regularItems = totalListings.filter(l => !l.is_gallery);

    const interleaved = [];
    let galleryIndex = 0;

    for (let i = 0; i < regularItems.length; i++) {
      // Every 15 items (at index 0, 15, 30...), insert a gallery item if available
      if (i % 15 === 0 && galleryIndex < galleryItems.length) {
        interleaved.push(galleryItems[galleryIndex]);
        galleryIndex++;
      }
      interleaved.push(regularItems[i]);
    }

    // Append remaining gallery items if any
    while (galleryIndex < galleryItems.length) {
      interleaved.push(galleryItems[galleryIndex]);
      galleryIndex++;
    }

    return interleaved;
  })();

  if (loading) {
    if (SKELETON_CONFIG.enabled) {
      return <ListingGridSkeleton count={isLatest ? 10 : 4} />;
    }
    return <div className="text-center py-12"><LoadingSpinner size="medium" /></div>;
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

// Gallery Component

export default ListingGrid;

