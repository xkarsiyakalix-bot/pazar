// Favorites API Service - Supabase Implementation
import { supabase } from '../lib/supabase';

export const favoritesApi = {
    /**
     * Get all favorites for the current user
     */
    async getFavorites(userId) {
        try {
            const { data, error } = await supabase
                .from('favorites')
                .select('*')
                .eq('user_id', userId);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching favorites:', error);
            return [];
        }
    },

    /**
     * Add a listing to favorites
     */
    async addFavorite(listingId, userId) {
        try {
            const { data, error } = await supabase
                .from('favorites')
                .insert([
                    {
                        user_id: userId,
                        listing_id: listingId,
                        created_at: new Date().toISOString()
                    }
                ])
                .select();

            if (error) throw error;
            console.log('✅ Added to favorites:', listingId);
            return { success: true, data };
        } catch (error) {
            console.error('Error adding favorite:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Remove a listing from favorites
     */
    async removeFavorite(listingId, userId) {
        try {
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', userId)
                .eq('listing_id', listingId);

            if (error) throw error;
            console.log('✅ Removed from favorites:', listingId);
            return { success: true };
        } catch (error) {
            console.error('Error removing favorite:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Get the number of users who favorited a listing
     */
    async getFavoriteCount(listingId) {
        try {
            const { count, error } = await supabase
                .from('favorites')
                .select('*', { count: 'exact', head: true })
                .eq('listing_id', listingId);

            if (error) throw error;
            return count || 0;
        } catch (error) {
            console.error('Error getting favorite count:', error);
            return 0;
        }
    },

    /**
     * Check if a listing is favorited by the current user
     */
    async isFavorited(listingId, userId) {
        try {
            const favorites = await this.getFavorites(userId);
            return favorites.some(fav => fav.listing_id === listingId);
        } catch (error) {
            console.error('Error checking favorite status:', error);
            return false;
        }
    },

    /**
     * Toggle favorite status (add if not favorited, remove if favorited)
     */
    async toggleFavorite(listingId, userId) {
        try {
            const isFav = await this.isFavorited(listingId, userId);
            if (isFav) {
                return await this.removeFavorite(listingId, userId);
            } else {
                return await this.addFavorite(listingId, userId);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            return { success: false, error: error.message };
        }
    }
};

// Backward compatibility exports
export const fetchUserFavorites = favoritesApi.getFavorites;
export const addFavorite = favoritesApi.addFavorite;
export const removeFavorite = favoritesApi.removeFavorite;

export default favoritesApi;
