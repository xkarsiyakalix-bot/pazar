/**
 * Image optimization utility for converting and compressing images
 * Supports WebP and AVIF formats for better performance
 */

/**
 * Convert image file to WebP format
 * @param {File} file - Original image file
 * @param {number} quality - Quality (0-1), default 0.85
 * @returns {Promise<Blob>} WebP blob
 */
export const convertToWebP = async (file, quality = 0.85) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to convert image to WebP'));
                        }
                    },
                    'image/webp',
                    quality
                );
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

/**
 * Resize and optimize image
 * @param {File} file - Original image file
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @param {number} quality - Quality (0-1)
 * @returns {Promise<Blob>} Optimized WebP blob
 */
export const resizeAndOptimizeImage = async (file, maxWidth = 1200, maxHeight = 900, quality = 0.75) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                let { width, height } = img;

                // Calculate new dimensions while maintaining aspect ratio
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.floor(width * ratio);
                    height = Math.floor(height * ratio);
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');

                // Enable image smoothing for better quality
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to optimize image'));
                        }
                    },
                    'image/webp',
                    quality
                );
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

/**
 * Process multiple images for upload
 * @param {File[]} files - Array of image files
 * @param {Object} options - Processing options
 * @returns {Promise<File[]>} Array of optimized files
 */
export const processImagesForUpload = async (files, options = {}) => {
    const {
        maxWidth = 1200,
        maxHeight = 900,
        quality = 0.75,
        maxFileSize = 5 * 1024 * 1024 // 5MB
    } = options;

    const processedFiles = [];

    for (const file of files) {
        try {
            // Skip if file is already small enough and is WebP
            if (file.type === 'image/webp' && file.size < maxFileSize) {
                processedFiles.push(file);
                continue;
            }

            // Resize and convert to WebP
            const optimizedBlob = await resizeAndOptimizeImage(file, maxWidth, maxHeight, quality);

            // Create new File object with WebP extension
            const originalName = file.name.replace(/\.[^/.]+$/, '');
            const optimizedFile = new File(
                [optimizedBlob],
                `${originalName}.webp`,
                { type: 'image/webp' }
            );

            processedFiles.push(optimizedFile);

            console.log(`Optimized ${file.name}: ${file.size} → ${optimizedFile.size} bytes (${Math.round((1 - optimizedFile.size / file.size) * 100)}% reduction)`);
        } catch (error) {
            console.error(`Failed to process ${file.name}:`, error);
            // Fallback to original file if processing fails
            processedFiles.push(file);
        }
    }

    return processedFiles;
};

/**
 * Create thumbnail from image
 * @param {File} file - Original image file
 * @param {number} size - Thumbnail size (square)
 * @returns {Promise<Blob>} Thumbnail blob
 */
export const createThumbnail = async (file, size = 300) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;

                const ctx = canvas.getContext('2d');

                // Calculate crop dimensions for square thumbnail
                const minDim = Math.min(img.width, img.height);
                const sx = (img.width - minDim) / 2;
                const sy = (img.height - minDim) / 2;

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to create thumbnail'));
                        }
                    },
                    'image/webp',
                    0.8
                );
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};
