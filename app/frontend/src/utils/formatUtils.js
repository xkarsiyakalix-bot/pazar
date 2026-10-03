export const formatPrice = (val) => {
    if (!val) return '';
    const numeric = val.toString().replace(/\D/g, '');
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const unformatPrice = (val) => {
    if (!val) return '';
    return val.toString().replace(/\./g, '');
};

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


/**
 * Checks if a given category & subcategory represents an animal adoption listing
 * (Dogs, Cats, Birds, Fish, Farm animals, etc. - excluding accessories and care/training services).
 */
export const isPetAdoptionCategory = (category, subCategory) => {
  const cat = (category || '').toString().toLowerCase().trim();
  const sub = (subCategory || '').toString().toLowerCase().trim();

  // Exclude accessories and care/training services
  if (
    sub.includes('aksesuar') || 
    sub.includes('zubehör') || 
    sub.includes('bakım') || 
    sub.includes('bakim') || 
    sub.includes('eğitim') || 
    sub.includes('egitim') || 
    sub.includes('betreuung') ||
    sub.includes('training')
  ) {
    return false;
  }

  // If main category is Evcil Hayvanlar / Haustiere
  if (
    cat.includes('evcil') || 
    cat.includes('hayvan') || 
    cat.includes('haustier')
  ) {
    return true;
  }

  // Animal subcategory names
  const animalKeywords = [
    'kedi', 'katze', 'köpek', 'kopek', 'hund', 
    'kuş', 'kus', 'vogel', 'balık', 'balik', 'fisch', 
    'at ', 'atlar', 'pferd', 'kemirgen', 'sürüngen', 'reptil', 
    'küçük hayvan', 'ciftlik hayvan', 'çiftlik hayvan', 'kayıp hayvan', 'vermisst'
  ];
  return animalKeywords.some(keyword => sub.includes(keyword));
};

/**
 * Checks if a listing object is an animal adoption listing
 */
export const isPetAdoptionListing = (listing) => {
  if (!listing) return false;
  return isPetAdoptionCategory(listing.category, listing.sub_category || listing.subcategory);
};
