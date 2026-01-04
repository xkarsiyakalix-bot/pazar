/**
 * Optimizes Supabase Storage image URLs with transformation parameters.
 * 
 * @param {string} url - The original image URL
 * @param {number} width - Target width
 * @param {number} height - Target height (optional)
 * @param {string} resize - Resize mode ('cover', 'contain', 'fill') - default 'cover'
 * @returns {string} Optimized URL
 */
export const getOptimizedImageUrl = (url, width, height, resize = 'cover') => {
    if (!url) return '';

    // Check if it's a Supabase Storage URL
    // Typical pattern: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path]
    if (!url.includes('supabase.co/storage/v1/object/public')) {
        return url;
    }

    // If it already has query params, append. Otherwise start with ?
    const separator = url.includes('?') ? '&' : '?';

    let params = `width=${width}`;
    if (height) params += `&height=${height}`;
    params += `&resize=${resize}`;
    params += `&format=webp`; // Always prefer WebP for size
    params += `&quality=80`;  // Good balance of quality and size

    return `${url}${separator}${params}`;
};
