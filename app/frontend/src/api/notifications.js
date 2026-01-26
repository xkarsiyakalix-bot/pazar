import { supabase } from '../lib/supabase';

/**
 * Get recent notifications for current user
 * @returns {Promise<Array>} List of notifications
 */
export const getUnreadNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }

    return data || [];
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
