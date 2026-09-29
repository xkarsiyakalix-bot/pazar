import { supabase } from '../lib/supabase';

/**
 * Get recent notifications for current user
 * @param {number} limit - Number of notifications to fetch
 * @returns {Promise<Array>} List of notifications
 */
export const getUnreadNotifications = async (limit = 10) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }

    return data || [];
};

/**
 * Get all notifications for current user (with pagination)
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 * @returns {Promise<{notifications: Array, total: number}>}
 */
export const getAllNotifications = async (page = 1, limit = 20) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { notifications: [], total: 0 };

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        console.error('Error fetching all notifications:', error);
        return { notifications: [], total: 0 };
    }

    return { notifications: data || [], total: count || 0 };
};

/**
 * Get notification count for current user
 * @returns {Promise<number>} Count of unread notifications
 */
export const getNotificationCount = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

    if (error) {
        console.error('Error getting notification count:', error);
        return 0;
    }

    return count || 0;
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<boolean>} Success status
 */
export const markNotificationAsRead = async (notificationId) => {
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

    if (error) {
        console.error('Error marking notification as read:', error);
        return false;
    }

    return true;
};

/**
 * Mark all notifications as read
 * @returns {Promise<boolean>} Success status
 */
export const markAllNotificationsAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

    if (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
    }

    return true;
};

/**
 * Delete a notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteNotification = async (notificationId) => {
    const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

    if (error) {
        console.error('Error deleting notification:', error);
        return false;
    }

    return true;
};

/**
 * Subscribe to realtime notifications for a user
 * @param {string} userId - User ID
 * @param {Function} callback - Callback function on new notification
 * @returns {Function} Unsubscribe function
 */
export const subscribeToNotifications = (userId, callback) => {
    if (!userId) return () => {};

    const channel = supabase
        .channel(`user-notifications-${userId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${userId}`
            },
            (payload) => {
                if (callback && payload.new) {
                    callback(payload.new);
                }
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};
