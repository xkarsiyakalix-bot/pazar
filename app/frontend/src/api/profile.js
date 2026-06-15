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
        return null; // Don't throw – let the caller handle null gracefully
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

        // Listings created in the current cyclic 30-day period (for limit calculation)
        const { data: profile } = await supabase
            .from('profiles')
            .select('first_listing_at')
            .eq('id', userId)
            .single();

        let periodStart;
        if (profile?.first_listing_at) {
            const firstListingDate = new Date(profile.first_listing_at);
            const now = new Date();
            const diffInDays = (now - firstListingDate) / (1000 * 60 * 60 * 24);
            const periodIndex = Math.floor(diffInDays / 30);
            periodStart = new Date(firstListingDate.getTime() + periodIndex * 30 * 24 * 60 * 60 * 1000);
        } else {
            periodStart = new Date();
            periodStart.setDate(periodStart.getDate() - 30); // Fallback to last 30 days if no first_listing_at
        }

        const { count: monthlyListings } = await supabase
            .from('listings')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', periodStart.toISOString());

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
            monthlyListings: monthlyListings || 0,
            totalViews,
            totalFavorites: receivedFavorites || 0, // This is technically "received" favorites
            watchlistCount: watchlistCount || 0   // This is the "given" favorites (Merkliste)
        };
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return {
            totalListings: 0,
            activeListings: 0,
            monthlyListings: 0,
            totalViews: 0,
            totalFavorites: 0
        };
    }
};

/**
 * Fetch total number of registered users
 * @returns {Promise<number>} Total user count
 */
export const fetchTotalUserCount = async () => {
    try {
        const { count, error } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;
        return count;
    } catch (error) {
        console.error('Error fetching total user count:', error);
        return 0;
    }
};

/**
 * Delete user profile (soft delete or status update)
 * Note: Real Auth deletion should be done via Edge Functions for security,
 * here we mark the profile as 'deleted' so the user can no longer log in.
 * @param {string} userId - User ID
 */
export const deleteUserProfile = async (userId) => {
    // 1. Mark profile as deleted
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            status: 'deleted',
            full_name: 'Silinmiş Hesap',
            phone: null,
            bio: null,
            avatar_url: null,
            store_slug: null
        })
        .eq('id', userId);

    if (profileError) throw profileError;

    // 2. Deactivate all listings
    const { error: listingsError } = await supabase
        .from('listings')
        .update({ status: 'deleted' })
        .eq('user_id', userId);

    if (listingsError) console.warn('Error deleting user listings:', listingsError);

    // 3. Sign out the user
    await supabase.auth.signOut();

    return true;
};

/**
 * Cancel user subscription (Disable auto-renewal)
 * @param {string} userId - User ID
 */
export const cancelSubscription = async (userId) => {
    // Set cancel_at_period_end to true
    // Benefits remain until subscription_expiry
    const { data, error } = await supabase
        .from('profiles')
        .update({
            cancel_at_period_end: true
        })
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;

    // Optional: Mark subscription promotion as pending_cancellation if needed
    // For now, we just update the profile flag which the UI will use

    return data;
};

/**
 * Re-activate user subscription renewal
 * @param {string} userId - User ID
 */
export const reactivateSubscription = async (userId) => {
    const { data, error } = await supabase
        .from('profiles')
        .update({
            cancel_at_period_end: false
        })
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
};
