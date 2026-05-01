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
