import { clearCache } from '../utils/cache';
import { supabase } from '../lib/supabase';

/**
 * Purchase a promotion package for a listing
 * @param {string} listingId - The ID of the listing to promote
 * @param {Object} packageDetails - Details of the selected package
 * @param {string} packageDetails.id - Package ID (e.g., 'highlight', 'top')
 * @param {number} packageDetails.price - Price of the package
 * @param {number} packageDetails.duration - Duration in days
 * @param {string} userId - The ID of the user making the purchase
 * @param {Object} listingUpdates - Optional additional fields to update on the listing
 * @returns {Promise<Object>} The created promotion record
 */
export const purchasePromotion = async (listingId, packageDetails, userId, listingUpdates = {}) => {
    try {
        // 1. Calculate dates
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + packageDetails.duration);

        // 2. Insert promotion record
        const { data: promotion, error: promotionError } = await supabase
            .from('promotions')
            .insert({
                listing_id: listingId,
                user_id: userId,
                package_type: packageDetails.id,
                price: packageDetails.price,
                duration_days: packageDetails.duration,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                status: 'active'
            })
            .select()
            .single();

        if (promotionError) {
            console.error('Error creating promotion record:', promotionError);
            throw promotionError;
        }

        // 3. Update listing status based on package type
        const updates = {
            promotion_expiry: endDate.toISOString(),
            package_type: packageDetails.id, // Ensure the new field is set
            ...listingUpdates
        };

        if (packageDetails.id === 'bump' || packageDetails.id === 'multi-bump' || packageDetails.id === 'top') {
            updates.created_at = new Date().toISOString();
        }

        if (packageDetails.id === 'highlight') {
            updates.is_highlighted = true;
        }

        if (packageDetails.id === 'top') {
            updates.is_top = true;
            updates.is_multi_bump = false;
        }

        if (packageDetails.id === 'multi-bump') {
            updates.is_multi_bump = true;
            updates.is_top = true;
            updates.package_type = 'z_multi_bump';
        }

        if (packageDetails.id === 'premium' || packageDetails.id === 'z_premium') {
            updates.is_top = true;
            updates.is_multi_bump = false;
            // We use package_type 'z_premium' to distinguish for absolute top sorting
        }

        if (['galerie', 'gallery', 'galeri', 'vitrin'].includes(packageDetails.id?.toLowerCase())) {
            updates.is_gallery = true;
        }

        const { error: listingError } = await supabase
            .from('listings')
            .update(updates)
            .eq('id', listingId);

        if (listingError) {
            console.error('Error updating listing status:', listingError);
            throw listingError;
        }

        // Clear cache to ensure new promotion status is reflected immediately
        clearCache();

        return promotion;
    } catch (error) {
        console.error('Purchase promotion failed:', error);
        throw error;
    }
};
