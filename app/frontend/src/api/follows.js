import { supabase } from '../lib/supabase';

/**
 * Follow a user
 * @param {string} followingId - ID of user to follow
 * @returns {Promise<Object>} Follow record
 */
export const followUser = async (followingId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('user_follows')
        .insert({
            follower_id: user.id,
            following_id: followingId
        })
        .select()
        .single();

    if (error) {
        console.error('Error following user:', error);
        throw error;
    }

    return data;
};

/**
 * Unfollow a user
 * @param {string} followingId - ID of user to unfollow
 */
export const unfollowUser = async (followingId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', followingId);

    if (error) {
        console.error('Error unfollowing user:', error);
        throw error;
    }
};

/**
 * Check if current user follows a specific user
 * @param {string} followingId - ID of user to check
 * @returns {Promise<boolean>} True if following
 */
export const isFollowing = async (followingId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', followingId)
        .maybeSingle();

    return !error && !!data;
};

/**
 * Get followers count for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} Followers count
 */
export const getFollowersCount = async (userId) => {
    const { count, error } = await supabase
        .from('user_follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);

    if (error) {
        console.error('Error getting followers count:', error);
        return 0;
    }

    return count || 0;
};

/**
 * Get following count for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} Following count
 */
export const getFollowingCount = async (userId) => {
    const { count, error } = await supabase
        .from('user_follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);

    if (error) {
        console.error('Error getting following count:', error);
        return 0;
    }

    return count || 0;
};

/**
 * Get users that current user follows
 * @returns {Promise<Array>} List of followed users
 */
export const getFollowing = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('getFollowing - Current user:', user?.id);

    if (!user) {
        console.log('getFollowing - No user logged in');
        return [];
    }

    const { data, error } = await supabase
        .from('user_follows')
        .select(`
            following_id,
            following:profiles!following_id (
                id,
                user_number,
                full_name,
                avatar_url,
                city,
                postal_code,
                bio,
                created_at,
                phone,
                email
            )
        `)
        .eq('follower_id', user.id);

    console.log('getFollowing - Query result:', { data, error });

    if (error) {
        console.error('Error getting following:', error);
        return [];
    }

    // Get listings count for each followed user
    const followedUsers = data?.map(f => f.following).filter(Boolean) || [];
    console.log('getFollowing - Followed users:', followedUsers);

    if (followedUsers.length === 0) {
        console.log('getFollowing - No followed users found');
        return [];
    }

    // Fetch listings count for each user
    const usersWithCounts = await Promise.all(
        followedUsers.map(async (followedUser) => {
            try {
                const { count, error: countError } = await supabase
                    .from('listings')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', followedUser.id);

                if (countError) {
                    console.error('Error getting listings count:', countError);
                    return {
                        ...followedUser,
                        total_listings: 0
                    };
                }

                return {
                    ...followedUser,
                    total_listings: count || 0
                };
            } catch (err) {
                console.error('Error in listings count:', err);
                return {
                    ...followedUser,
                    total_listings: 0
                };
            }
        })
    );

    console.log('getFollowing - Users with counts:', usersWithCounts);
    return usersWithCounts;
};

/**
 * Get users that follow the current user
 * @returns {Promise<Array>} List of followers
 */
export const getFollowers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('user_follows')
        .select(`
            follower_id,
            follower:profiles!follower_id (
                id,
                user_number,
                full_name,
                avatar_url,
                city,
                postal_code,
                bio,
                created_at,
                phone,
                email
            )
        `)
        .eq('following_id', user.id);

    if (error) {
        console.error('Error getting followers:', error);
        return [];
    }

    const followers = data?.map(f => f.follower).filter(Boolean) || [];

    // Fetch listings count for each follower
    const usersWithCounts = await Promise.all(
        followers.map(async (followerUser) => {
            try {
                const { count, error: countError } = await supabase
                    .from('listings')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', followerUser.id);

                if (countError) return { ...followerUser, total_listings: 0 };
                return { ...followerUser, total_listings: count || 0 };
            } catch (err) {
                return { ...followerUser, total_listings: 0 };
            }
        })
    );

    return usersWithCounts;
};
