import { supabase } from '../supabaseClient';

/**
 * Report a listing as spam
 * @param {string} listingId 
 * @param {string} reason 
 * @param {string} details 
 * @returns {Promise}
 */
export const reportSpam = async (listingId, reason, details = '') => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('Kullanıcı girişi gerekli');
        }

        const { data, error } = await supabase
            .from('spam_reports')
            .insert([{
                listing_id: listingId,
                reporter_id: user.id,
                reason,
                details,
                status: 'pending'
            }])
            .select()
            .single();

        if (error) throw error;

        // Increment spam report count on listing
        await supabase.rpc('increment_spam_reports', { listing_id: listingId });

        return data;
    } catch (error) {
        console.error('Error reporting spam:', error);
        throw error;
    }
};

/**
 * Get spam reports (admin only)
 * @param {string} status - Filter by status
 * @returns {Promise<Array>}
 */
export const getSpamReports = async (status = 'pending') => {
    try {
        let query = supabase
            .from('spam_reports')
            .select(`
        *,
        listing:listings(*),
        reporter:profiles!spam_reports_reporter_id_fkey(id, full_name, email)
      `)
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching spam reports:', error);
        throw error;
    }
};

/**
 * Mark listing as spam (admin only)
 * @param {string} listingId 
 * @returns {Promise}
 */
export const markAsSpam = async (listingId) => {
    try {
        const { data, error } = await supabase
            .from('listings')
            .update({
                is_spam: true,
                auto_hidden: true,
                reviewed_by_admin: true
            })
            .eq('id', listingId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error marking as spam:', error);
        throw error;
    }
};

/**
 * Mark listing as safe (admin only)
 * @param {string} listingId 
 * @returns {Promise}
 */
export const markAsSafe = async (listingId) => {
    try {
        const { data, error } = await supabase
            .from('listings')
            .update({
                is_spam: false,
                auto_hidden: false,
                reviewed_by_admin: true,
                spam_score: 0,
                spam_flags: []
            })
            .eq('id', listingId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error marking as safe:', error);
        throw error;
    }
};

/**
 * Update spam report status (admin only)
 * @param {string} reportId 
 * @param {string} status 
 * @returns {Promise}
 */
export const updateSpamReportStatus = async (reportId, status) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('spam_reports')
            .update({
                status,
                reviewed_at: new Date().toISOString(),
                reviewed_by: user?.id
            })
            .eq('id', reportId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating spam report:', error);
        throw error;
    }
};

/**
 * Get listings that need review (high spam score)
 * @returns {Promise<Array>}
 */
export const getListingsNeedingReview = async () => {
    try {
        const { data, error } = await supabase
            .from('listings')
            .select('*, profiles(full_name, email)')
            .gte('spam_score', 31)
            .eq('reviewed_by_admin', false)
            .order('spam_score', { ascending: false })
            .limit(100);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching listings needing review:', error);
        throw error;
    }
};

export default {
    reportSpam,
    getSpamReports,
    markAsSpam,
    markAsSafe,
    updateSpamReportStatus,
    getListingsNeedingReview
};
