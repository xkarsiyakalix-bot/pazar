// Favorites API Service - Supabase Implementation
import { supabase } from '../lib/supabase';

// In-memory cache for favorite counts across cards
const countCache = new Map();
let batchQueue = [];
let batchTimeout = null;
const subscribers = new Map(); // listingId -> Array of callbacks

function processBatch() {
    const currentQueue = Array.from(new Set(batchQueue));
    batchQueue = [];
    batchTimeout = null;

    if (currentQueue.length === 0) return;

    supabase
        .from('favorites')
        .select('listing_id')
        .in('listing_id', currentQueue)
        .then(({ data, error }) => {
            if (error) {
                console.error('Error batch fetching favorite counts:', error);
                return;
            }
            const counts = {};
            currentQueue.forEach(id => { counts[id] = 0; });
            (data || []).forEach(row => {
                counts[row.listing_id] = (counts[row.listing_id] || 0) + 1;
            });

            Object.entries(counts).forEach(([id, count]) => {
                countCache.set(id, count);
                const cbs = subscribers.get(id);
                if (cbs) {
                    cbs.forEach(cb => {
                        try { cb(count); } catch (_) {}
                    });
                    subscribers.delete(id);
                }
            });
        })
        .catch(err => {
            console.error('Failed to process favorites batch:', err);
        });
}

/**
 * Batched favorite count loader.
 * Batches calls within 40ms window into a single Supabase query.
 */
export const getFavoriteCountBatched = (listingId, callback) => {
    if (!listingId) return;
    if (countCache.has(listingId)) {
        callback(countCache.get(listingId));
        return;
    }
    if (!subscribers.has(listingId)) {
        subscribers.set(listingId, []);
    }
    subscribers.get(listingId).push(callback);

    batchQueue.push(listingId);
    if (!batchTimeout) {
        batchTimeout = setTimeout(processBatch, 40);
    }
};

/**
 * Update cached count after user toggles favorite
 */
export const updateCachedFavoriteCount = (listingId, delta) => {
    if (!listingId) return;
    const current = countCache.get(listingId) || 0;
    const next = Math.max(0, current + delta);
    countCache.set(listingId, next);
};

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
            updateCachedFavoriteCount(listingId, 1);
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
            updateCachedFavoriteCount(listingId, -1);
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
        if (countCache.has(listingId)) {
            return countCache.get(listingId);
        }
        try {
            const { count, error } = await supabase
                .from('favorites')
                .select('*', { count: 'exact', head: true })
                .eq('listing_id', listingId);

            if (error) throw error;
            const res = count || 0;
            countCache.set(listingId, res);
            return res;
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
