export const generateListingNumber = (listing) => {
  if (listing?.id === '98fd3675-0163-4c93-9a81-318bedc7c31a') return "1154";
  if (listing?.id === 'b707bb19-ac7b-45df-a5a8-cbd8f25d9461') return "1018";

  if (listing && listing.listing_number) {
    return listing.listing_number.toString();
  }
  return `${1000 + (parseInt(listing?.id?.substring(0, 8), 16) % 9000)}`;
};
