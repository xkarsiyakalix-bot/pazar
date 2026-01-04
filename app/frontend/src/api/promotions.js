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
            ...listingUpdates
        };

        if (packageDetails.id === 'bump') {
            updates.created_at = new Date().toISOString();
        }

        if (packageDetails.id === 'highlight' || packageDetails.id === 'galerie' || packageDetails.id === 'premium') {
            updates.is_highlighted = true;
        }

        if (packageDetails.id === 'top' || packageDetails.id === 'galerie' || packageDetails.id === 'premium') {
            updates.is_top = true;
        }

        if (packageDetails.id === 'multi-bump' || packageDetails.id === 'premium') {
            updates.is_multi_bump = true;
        }

        if (packageDetails.id === 'galerie' || packageDetails.id === 'premium') {
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
