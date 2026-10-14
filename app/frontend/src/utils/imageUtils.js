/**
 * Optimizes Supabase Storage image URLs with transformation parameters.
 * IMPORTANT: Image Transformation is a paid feature in Supabase (Pro Plan).
 * If you are on the Free Plan, this will fall back to standard public URLs.
 * 
 * @param {string} url - The original image URL
 * @param {number} width - Target width
 * @param {number} height - Target height (optional)
 * @param {string} resize - Resize mode ('cover', 'contain', 'fill') - default 'cover'
 * @param {boolean} preferAVIF - Prefer AVIF format over WebP (default true)
 * @returns {string} Optimized URL
 */
export const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='280' viewBox='0 0 400 280'%3E%3Crect fill='%23f3f4f6' width='400' height='280'/%3E%3Cpath fill='%239ca3af' d='M160 120a20 20 0 1 0 0-40 20 20 0 0 0 0 40zm-40 60h160l-50-60-40 50-30-30-40 40z'/%3E%3Ctext fill='%236b7280' font-family='sans-serif' font-size='15' font-weight='600' x='50%25' y='215' text-anchor='middle'%3EExVitrin%3C/text%3E%3C/svg%3E";

export const getOptimizedImageUrl = (url, width, height, resize = 'cover', preferAVIF = true) => {
    if (!url) return PLACEHOLDER_IMAGE;

    // Check if it's a Supabase Storage URL
    if (!url.includes('supabase.co/storage/v1/')) {
        return url;
    }

    // Set to false to avoid Supabase $10/mo Image Transformation add-on fee & latency.
    // When false, images load instantly from direct Supabase CDN without render wait times.
    const isTransformationEnabled = false;

    if (!isTransformationEnabled) {
        // Return direct clean Supabase URL without proxy or transformation params
        if (url.includes('/storage/v1/render/image/public/')) {
            return url.split('?')[0].replace('/storage/v1/render/image/public/', '/storage/v1/object/public/');
        }
        return url.split('?')[0];
    }

    // Transformation URL structure: .../render/image/public/[bucket]/[path]
    const transformedUrl = url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');

    // If it already has query params, append. Otherwise start with ?
    const separator = transformedUrl.includes('?') ? '&' : '?';

    let params = `width=${width}`;
    if (height) params += `&height=${height}`;
    params += `&resize=${resize}`;

    // WebP is more compatible for transformations
    params += `&format=webp`;
    params += `&quality=75`;

    return `${transformedUrl}${separator}${params}`;
};

/**
 * Generate picture element with multiple format sources for best browser support
 * @param {string} url - Original image URL
 * @param {number} width - Target width
 * @param {number} height - Target height
 * @param {string} alt - Alt text
 * @param {string} className - CSS classes
 * @returns {string} HTML picture element
 */
export const generateResponsiveImage = (url, width, height, alt = '', className = '') => {
    if (!url) return '';

    const avifUrl = getOptimizedImageUrl(url, width, height, 'cover', true);
    const webpUrl = getOptimizedImageUrl(url, width, height, 'cover', false);

    return `
        <picture>
            <source srcset="${avifUrl}" type="image/avif">
            <source srcset="${webpUrl}" type="image/webp">
            <img src="${webpUrl}" alt="${alt}" class="${className}" loading="lazy" width="${width}" height="${height || 'auto'}">
        </picture>
    `;
};

/**
 * Compresses and converts an image file to WebP format using Canvas API.
 * This runs entirely in the browser before upload.
 * 
 * @param {File} file - The original image file
 * @param {number} maxWidth - Maximum width (default 1920)
 * @param {number} quality - Quality (0.0 to 1.0, default 0.8)
 * @returns {Promise<File>} - A Promise resolving to the compressed WebP file
 */
export const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        // Check if file is an image
        if (!file.type.match(/image.*/)) {
            // Not an image, return original file or reject
            // Here we prefer resolving with original file to avoid breaking non-image uploads if any
            resolve(file);
            return;
        }

        // If it's already WebP and small enough, maybe skip? 
        // But for consistency let's process it.

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Resize logic
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to WebP blob
                canvas.toBlob((blob) => {
                    if (!blob) {
                        // Fallback to original if conversion fails
                        resolve(file);
                        return;
                    }

                    // Create a new File from the blob
                    // Preserve original name but change extension to .webp
                    const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                    const newFile = new File([blob], fileName, {
                        type: 'image/webp',
                        lastModified: Date.now()
                    });

                    resolve(newFile);
                }, 'image/webp', quality);
            };
            img.onerror = (error) => {
                console.error('Image load error during compression:', error);
                resolve(file); // Return original on error
            };
        };
        reader.onerror = (error) => {
            console.error('FileReader error during compression:', error);
            resolve(file); // Return original on error
        };
    });
};
