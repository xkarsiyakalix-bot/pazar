import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ListingCard } from './ListingCard';
import { PLACEHOLDER_IMAGE } from '../utils/imageUtils';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { SKELETON_CONFIG } from '../config/skeletonConfig';
import { ListingGridSkeleton } from './skeletons/ListingCardSkeleton';
import { useIsMobile } from '../hooks/useIsMobile';

export const ListingGrid = ({ isLatest = false, selectedCategory = 'Tüm Kategoriler', searchTerm = '', toggleFavorite, isFavorite }) => {
  const isMobile = useIsMobile();
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
          // Fetch latest 24 listings with only needed card fields to dramatically reduce network payload
          const data = await fetchListings({
            sort_by_newest: true,
            page: 1,
            limit: 24,
            select: 'id,title,price,price_type,images,category,sub_category,city,district,is_top,is_gallery,is_highlighted,is_multi_bump,package_type,promotion_expiry,user_id,created_at,slug,reserved_by,reserved_until'
          }, { count: false });

          const latestListings = data || [];

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
        : listing.image || PLACEHOLDER_IMAGE,
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
      {displayListings.map((listing, index) => (
        <ListingCard
          key={listing.id}
          priority={isMobile ? index < 4 : index < 10}
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

