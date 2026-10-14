import { supabase } from '../lib/supabase';
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
 * Upload multiple images: primary Cloudflare R2, fallback Supabase Storage
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

    // Optimize images before upload (converts to WebP client-side)
    console.log('Optimizing images...');
    const optimizedFiles = await processImagesForUpload(files, {
        maxWidth: 1200,
        maxHeight: 900,
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

            let publicUrl = null;

            // 1. Primary: Direct Supabase Storage (50KB WebP, immediate upload, ultra-fast CDN)
            try {
                const { error: supaError } = await supabase.storage
                    .from('listing-images')
                    .upload(fileName, file, {
                        cacheControl: '31536000',
                        upsert: false,
                        contentType: 'image/webp'
                    });

                if (!supaError) {
                    const { data: { publicUrl: supabaseUrl } } = supabase.storage
                        .from('listing-images')
                        .getPublicUrl(fileName);
                    publicUrl = supabaseUrl;
                    console.log(`Successfully uploaded to Supabase Storage: ${publicUrl}`);
                } else {
                    console.warn('Supabase upload error, attempting Cloudflare R2 fallback:', supaError);
                }
            } catch (err) {
                console.warn('Supabase exception, attempting Cloudflare R2 fallback:', err);
            }

            // 2. Fallback to Cloudflare R2 if Supabase Storage is unavailable
            if (!publicUrl) {
                try {
                    publicUrl = await uploadToR2(file, fileName);
                    console.log(`Successfully uploaded to Cloudflare R2 fallback: ${publicUrl}`);
                } catch (r2Error) {
                    console.error('All upload attempts failed:', r2Error);
                    throw r2Error;
                }
            }

            uploadedUrls.push(publicUrl);
        } catch (error) {
            console.error(`Failed to upload ${file.name}:`, error);
        }
    }

    return uploadedUrls;
};

/**
 * Delete images from Cloudflare R2 or Supabase Storage
 * @param {string[]} imageUrls - Array of image URLs to delete
 * @param {string} userId - User ID for permission check
 */
export const deleteListingImages = async (imageUrls, userId) => {
    if (!imageUrls || imageUrls.length === 0) {
        return;
    }

    for (const url of imageUrls) {
        try {
            if (url.includes('images.exvitrin.com/')) {
                // Delete from Cloudflare R2
                await fetch('/api/delete-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url })
                });
            } else if (url.includes('/listing-images/')) {
                // Delete from Supabase Storage
                const path = url.split('/listing-images/')[1];
                if (path) {
                    await supabase.storage.from('listing-images').remove([path]);
                }
            }
        } catch (error) {
            console.error('Failed to delete image:', url, error);
        }
    }
};
