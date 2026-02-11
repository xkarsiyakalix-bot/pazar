import { supabase } from '../lib/supabase';
import { processImagesForUpload } from '../utils/imageOptimization';

/**
 * Upload multiple images to Supabase Storage
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

    // Optimize images before upload
    console.log('Optimizing images...');
    const optimizedFiles = await processImagesForUpload(files, {
        maxWidth: 1200,
        maxHeight: 900,
        quality: 0.75,
        maxFileSize
    });

    for (const file of optimizedFiles) {
        // Validate file size (after optimization)
        if (file.size > maxFileSize) {
            console.warn(`File ${file.name} is still too large (${file.size} bytes) after optimization. Skipping.`);
            continue;
        }

        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            console.warn(`File ${file.name} has invalid type (${file.type}). Skipping.`);
            continue;
        }

        try {
            // Generate unique filename with .webp extension
            const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('listing-images')
                .upload(fileName, file, {
                    cacheControl: '31536000', // 1 year cache
                    upsert: false,
                    contentType: 'image/webp'
                });

            if (error) {
                console.error(`Error uploading ${file.name}:`, error);
                throw error;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('listing-images')
                .getPublicUrl(fileName);

            uploadedUrls.push(publicUrl);
            console.log(`Successfully uploaded: ${fileName}`);
        } catch (error) {
            console.error(`Failed to upload ${file.name}:`, error);
            // Continue with other files even if one fails
        }
    }

    return uploadedUrls;
};

/**
 * Delete images from Supabase Storage
 * @param {string[]} imageUrls - Array of image URLs to delete
 * @param {string} userId - User ID for permission check
 */
export const deleteListingImages = async (imageUrls, userId) => {
    if (!imageUrls || imageUrls.length === 0) {
        return;
    }

    const filePaths = imageUrls.map(url => {
        // Extract file path from public URL
        const urlParts = url.split('/listing-images/');
        return urlParts[1];
    }).filter(Boolean);

    if (filePaths.length === 0) {
        return;
    }

    try {
        const { error } = await supabase.storage
            .from('listing-images')
            .remove(filePaths);

        if (error) {
            console.error('Error deleting images:', error);
            throw error;
        }

        console.log(`Successfully deleted ${filePaths.length} images`);
    } catch (error) {
        console.error('Failed to delete images:', error);
    }
};
