import { supabase } from '../lib/supabase';

/**
 * Report a listing
 * @param {string} listingId - ID of the listing to report
 * @param {string} reason - Reason for reporting
 * @param {string} description - Additional description
 * @returns {Promise<Object>} Created report
 */
export const reportListing = async (listingId, reason, description = '') => {
    try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('Sie müssen angemeldet sein, um eine Anzeige zu melden.');
        }

        // Create report
        const { data, error } = await supabase
            .from('reports')
            .insert([
                {
                    listing_id: listingId,
                    reported_by: user.id,
                    reason: reason,
                    description: description,
                    status: 'pending',
                    created_at: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);

            // Check if table doesn't exist
            if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('does not exist')) {
                throw new Error('Die Reports-Tabelle existiert noch nicht in der Datenbank. Bitte kontaktieren Sie den Administrator.');
            }

            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error reporting listing:', error);
        throw error;
    }
};

/**
 * Get all reports (Admin only)
 * @returns {Promise<Array>} List of reports
 */
export const getAllReports = async () => {
    try {
        // First, try to get reports with listings
        const { data, error } = await supabase
            .from('reports')
            .select('*, listings(*)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);

            // Check if table doesn't exist
            if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('does not exist')) {
                throw new Error('Die Reports-Tabelle existiert noch nicht in der Datenbank. Bitte erstellen Sie die Tabelle zuerst.');
            }

            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching reports:', error);
        throw error;
    }
};

/**
 * Update report status (Admin only)
 * @param {string} reportId - ID of the report
 * @param {string} status - New status (pending, reviewed, resolved, rejected)
 * @returns {Promise<Object>} Updated report
 */
export const updateReportStatus = async (reportId, status) => {
    try {
        const { data, error } = await supabase
            .from('reports')
            .update({
                status: status,
                updated_at: new Date().toISOString()
            })
            .eq('id', reportId)
            .select()
            .single();

        if (error) throw error;

        return data;
    } catch (error) {
        console.error('Error updating report status:', error);
        throw error;
    }
};

/**
 * Delete a report (Admin only)
 * @param {string} reportId - ID of the report to delete
 * @returns {Promise<void>}
 */
export const deleteReport = async (reportId) => {
    try {
        const { error } = await supabase
            .from('reports')
            .delete()
            .eq('id', reportId);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting report:', error);
        throw error;
    }
};
