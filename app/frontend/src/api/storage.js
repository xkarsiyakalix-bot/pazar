import { processImagesForUpload } from '../utils/imageOptimization';

/**
 * Convert Blob or File to Base64 string
 */
const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

/**
 * Upload single image to Cloudflare R2 via serverless endpoint
 */
export const uploadToR2 = async (fileOrBlob, filePath) => {
    const base64 = await blobToBase64(fileOrBlob);
    const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fileName: filePath,
            base64,
            contentType: 'image/webp'
        })
    });

    if (!response.ok) {
        throw new Error(`R2 upload failed with HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data.url) {
        throw new Error('R2 response missing url');
    }
    return data.url;
};

/**
 * Upload multiple images directly to Cloudflare R2 CDN (images.exvitrin.com)
 * Supabase Storage is completely bypassed.
 * @param {File[]} files - Array of image files to upload
 * @param {string} userId - User ID for organizing files
 * @returns {Promise<string[]>} Array of public URLs
 */
export const uploadListingImages = async (files, userId) => {
    if (!files || files.length === 0) {
        return [];
    }

    const uploadedUrls = [];
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    // Optimize images before upload (converts to WebP client-side, ~30KB)
    const optimizedFiles = await processImagesForUpload(files, {
        maxWidth: 960,
        maxHeight: 720,
        quality: 0.75,
        maxFileSize
    });

    for (const file of optimizedFiles) {
        if (file.size > maxFileSize) {
            console.warn(`File ${file.name} is still too large (${file.size} bytes) after optimization. Skipping.`);
            continue;
        }

        if (!allowedTypes.includes(file.type)) {
            console.warn(`File ${file.name} has invalid type (${file.type}). Skipping.`);
            continue;
        }

        try {
            // Generate unique filename with .webp extension
            const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

            // Direct Cloudflare R2 upload (images.exvitrin.com CDN)
            const publicUrl = await uploadToR2(file, fileName);
            console.log(`Successfully uploaded to Cloudflare R2: ${publicUrl}`);
            uploadedUrls.push(publicUrl);
        } catch (error) {
            console.error(`Failed to upload ${file.name} to Cloudflare R2:`, error);
        }
    }

    return uploadedUrls;
};

/**
 * Delete images from Cloudflare R2 CDN
 * @param {string[]} imageUrls - Array of image URLs to delete
 */
export const deleteListingImages = async (imageUrls) => {
    if (!imageUrls || imageUrls.length === 0) {
        return;
    }

    for (const url of imageUrls) {
        try {
            // Normalize URL to delete endpoint
            const targetUrl = url.includes('/storage/v1/object/public/listing-images/')
                ? url.replace(/https?:\/\/[^\/]+\/storage\/v1\/object\/public\/listing-images\//, 'https://images.exvitrin.com/')
                : url;

            await fetch('/api/delete-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: targetUrl })
            });
        } catch (error) {
            console.error('Failed to delete image from Cloudflare R2:', url, error);
        }
    }
};
