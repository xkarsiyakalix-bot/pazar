/**
 * Social and native sharing utility functions for ExVitrin
 */

export const isMobileDevice = () => {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
};

export const shareToFacebook = (url, title = 'ExVitrin') => {
  if (!url) return;

  // On mobile devices, native share connects directly to the installed Facebook App
  if (isMobileDevice() && typeof navigator !== 'undefined' && navigator.share) {
    navigator.share({
      title: title || 'ExVitrin',
      text: `${title || 'İlan'} - ExVitrin'de!`,
      url: url
    }).catch(() => {
      // User cancelled share or share dismissed - ignore
    });
    return;
  }

  // Desktop or fallback: open properly sized popup window
  const width = 626;
  const height = 436;
  const left = Math.max(0, (window.innerWidth - width) / 2 + (window.screenX || window.screenLeft || 0));
  const top = Math.max(0, (window.innerHeight - height) / 2 + (window.screenY || window.screenTop || 0));
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  try {
    const popup = window.open(
      shareUrl,
      'facebook-share-dialog',
      `width=${width},height=${height},top=${top},left=${left},toolbar=no,menubar=no,location=no,status=no,resizable=yes,scrollbars=yes`
    );
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      window.open(shareUrl, '_blank');
    }
  } catch (err) {
    window.open(shareUrl, '_blank');
  }
};

export const shareToWhatsApp = (url, title = '') => {
  if (!url) return;
  const text = `${title ? `${title} ilanını ExVitrin'de keşfedin!` : "ExVitrin'de harika bir ilan keşfettim!"}\n${url}`;
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
};

export const shareToTwitter = (url, title = '') => {
  if (!url) return;
  const text = `${title ? `${title} ilanını ExVitrin'de keşfedin!` : "ExVitrin'de harika bir ilan!"}`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
};

export const copyShareLink = async (url) => {
  if (!url) return false;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Failed to copy link:', err);
    return false;
  }
};

