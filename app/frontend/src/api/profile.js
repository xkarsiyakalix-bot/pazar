import { supabase } from '../lib/supabase';

/**
 * Fetch user profile
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile
 */
export const fetchUserProfile = async (userId) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }

    return data;
};

/**
 * Fetch user profile by user_number
 * @param {number} userNumber - User number (e.g., 1000)
 * @returns {Promise<Object>} User profile
 */
export const fetchUserProfileByNumber = async (userNumber) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_number', parseInt(userNumber))
        .single();

    if (error) {
        console.error('Error fetching user profile by number:', error);
        throw error;
    }

    return data;
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updates - Profile updates
 * @returns {Promise<Object>} Updated profile
 */
export const updateUserProfile = async (userId, updates) => {
    console.log('Updating profile for:', userId, 'with updates:', JSON.stringify(updates, null, 2));
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error('Error updating profile (Supabase):', JSON.stringify(error, null, 2));
        throw error;
    }

    if (!data) {
        console.error('Update returned no data. RLS might be blocking it.');
        throw new Error('Update failed - No data returned (RLS?)');
    }

    return data;
};

/**
 * Get user statistics
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User stats
 */
export const getUserStats = async (userId) => {
    try {
        // Total listings
        const { count: totalListings } = await supabase
            .from('listings')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        // Active listings
        const { count: activeListings } = await supabase
            .from('listings')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('status', 'active');

        // Total views
        const { data: listings } = await supabase
            .from('listings')
            .select('views')
            .eq('user_id', userId);

        const totalViews = listings?.reduce((sum, l) => sum + (l.views || 0), 0) || 0;

        // Total favorites received (others liking my ads)
        const { count: receivedFavorites } = await supabase
            .from('favorites')
            .select('*, listings!inner(*)', { count: 'exact', head: true })
            .eq('listings.user_id', userId);

        // Watchlist count (ads I liked that are still active)
        const { count: watchlistCount } = await supabase
            .from('favorites')
            .select('*, listings!inner(*)', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('listings.status', 'active');

        return {
            totalListings: totalListings || 0,
            activeListings: activeListings || 0,
            totalViews,
            totalFavorites: receivedFavorites || 0, // This is technically "received" favorites
            watchlistCount: watchlistCount || 0   // This is the "given" favorites (Merkliste)
        };
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return {
            totalListings: 0,
            activeListings: 0,
            totalViews: 0,
            totalFavorites: 0
        };
    }
};
