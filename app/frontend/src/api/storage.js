import { supabase } from '../lib/supabase';

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

    for (const file of files) {
        // Validate file size
        if (file.size > maxFileSize) {
            console.warn(`File ${file.name} is too large (${file.size} bytes). Skipping.`);
            continue;
        }

        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            console.warn(`File ${file.name} has invalid type (${file.type}). Skipping.`);
            continue;
        }

        try {
            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('listing-images')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
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
