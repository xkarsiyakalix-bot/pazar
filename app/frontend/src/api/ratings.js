import { supabase } from '../lib/supabase';

/**
 * Submit a rating for a user
 * @param {string} ratedId - ID of user being rated
 * @param {number} rating - 1 to 5 stars
 * @param {string} comment - Optional text comment
 */
export const submitRating = async (ratedId, rating, comment) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Check eligibility first
        const canRate = await checkRatingEligibility(ratedId);
        if (!canRate) {
            throw new Error('Rating eligibility requirement not met (min 5 messages)');
        }

        // Use upsert to update existing rating or insert new one
        const { data, error } = await supabase
            .from('ratings')
            .upsert({
                rater_id: user.id,
                rated_id: ratedId,
                rating,
                comment
            }, {
                onConflict: 'rater_id,rated_id'
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error submitting rating:', error);
        throw error;
    }
};

/**
 * Check if current user can rate target user
 * @param {string} targetUserId - ID of user to rate
 * @returns {Promise<boolean>} True if eligible
 */
export const checkRatingEligibility = async (targetUserId) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        // Use RPC function if available for secure server-side check
        const { data, error } = await supabase
            .rpc('check_rating_eligibility', {
                user1_id: user.id,
                user2_id: targetUserId
            });

        if (error) {
            // Fallback: Client-side count if RPC missing (less secure but works for MVP)
            console.warn('RPC check failed, falling back to client-side count:', error);

            // Count messages sent by ME to HIM
            const { count: sentCount } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('sender_id', user.id)
                .eq('receiver_id', targetUserId);

            // Count messages sent by HIM to ME
            const { count: receivedCount } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('sender_id', targetUserId)
                .eq('receiver_id', user.id);

            const total = (sentCount || 0) + (receivedCount || 0);
            return total >= 5;
        }

        return data;
    } catch (error) {
        console.error('Error checking rating eligibility:', error);
        return false;
    }
};

/**
 * Fetch ratings for a specific user
 * @param {string} userId - User ID
 */
export const getRatings = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('ratings')
            .select(`
                *,
                rater:profiles!rater_id(full_name, avatar_url, store_logo)
            `)
            .eq('rated_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching ratings:', error);
        return [];
    }
};

/**
 * Get average rating for a user
 * @param {string} userId 
 */
export const getUserAverageRating = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('ratings')
            .select('rating')
            .eq('rated_id', userId);

        if (error) throw error;

        if (!data || data.length === 0) return { average: 0, count: 0 };

        const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
        const average = sum / data.length;

        return {
            average: parseFloat(average.toFixed(1)),
            count: data.length
        };
    } catch (error) {
        console.error('Error calculating average rating:', error);
        return { average: 0, count: 0 };
    }
};

// Alias for backward compatibility
export const getUserRating = getUserAverageRating;

/**
 * Check if the current user has already rated the target user
 * @param {string} ratedId - ID of the user being rated
 * @returns {Promise<boolean>} True if already rated
 */
export const hasUserRated = async (ratedId) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data, error } = await supabase
            .from('ratings')
            .select('id')
            .eq('rater_id', user.id)
            .eq('rated_id', ratedId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            // console.error('Error checking if user rated:', error);
            return false;
        }

        return !!data;
    } catch (error) {
        console.error('Error checking if user rated:', error);
        return false;
    }
};
