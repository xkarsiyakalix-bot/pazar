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

  // ONLY match if the main category is explicitly Evcil Hayvanlar / Haustiere
  if (cat.includes('evcil') || cat.includes('haustier')) {
    return true;
  }

  // Direct subcategory exact name match (from categories.js) — only if cat check passed above
  const exactPetSubs = [
    'köpekler', 'kediler', 'kuşlar', 'balıklar',
    'küçük hayvanlar', 'çiftlik hayvanları', 'atlar', 'kayıp hayvanlar'
  ];
  if (exactPetSubs.includes(sub)) return true;

  return false;
};

/**
 * Checks if a listing object is an animal adoption listing
 */
export const isPetAdoptionListing = (listing) => {
  if (!listing) return false;
  // Check all possible field name variations
  const category = listing.category || listing.Category || '';
  const subCategory =
    listing.sub_category ||
    listing.subcategory ||
    listing.subCategory ||
    listing.sub_Category ||
    '';
  return isPetAdoptionCategory(category, subCategory);
};
