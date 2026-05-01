/**
 * Utility functions for formatting and consistent naming
 */

export const formatLastSeen = (lastSeenDate) => {
  if (!lastSeenDate) return 'Az önce aktifti';

  const now = new Date();
  const lastSeen = new Date(lastSeenDate);
  const diffInMinutes = Math.floor((now - lastSeen) / (1000 * 60));

  if (diffInMinutes < 1) return 'Az önce aktifti';
  if (diffInMinutes < 60) return `${diffInMinutes} dakika önce aktifti`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} saat önce aktifti`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Dün aktifti';
  if (diffInDays < 7) return `${diffInDays} gün önce aktifti`;

  return lastSeen.toLocaleDateString('tr-TR');
};

export const generateListingNumber = (listing) => {
  if (!listing) return "";
  
  // Demo specific overrides to match legacy behavior
  if (listing.id === '98fd3675-0163-4c93-9a81-318bedc7c31a') return "1154";
  if (listing.id === 'b707bb19-ac7b-45df-a5a8-cbd8f25d9461') return "1018";

  // Use listing_number from database if available
  if (listing.listing_number) {
    return listing.listing_number.toString();
  }

  // Fallback to numeric hash of ID
  const id = listing.id.toString();
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString().substring(0, 6);
};
