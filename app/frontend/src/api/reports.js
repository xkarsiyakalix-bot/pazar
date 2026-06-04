import { supabase } from '../lib/supabase';

/**
 * Report a listing
 */
export const reportListing = async (listingId, reason, description = '') => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Sie müssen angemeldet sein, um eine Anzeige zu melden.');
    }

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
        if (error.code === '42P01' || (error.message && error.message.includes('does not exist'))) {
            throw new Error('Bildirim sistemi henüz kurulmamış. Lütfen yöneticiyle iletişime geçin.');
        }
        throw error;
    }

    return data;
};

/**
 * Get all reports (Admin only)
 */
export const getAllReports = async () => {
    const { data, error } = await supabase
        .from('reports')
        .select('*, listings(id, title, category)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Supabase error:', error);
        if (error.code === '42P01' || (error.message && error.message.includes('does not exist'))) {
            throw new Error('Reports tablosu henüz oluşturulmamış. Lütfen setup_reports_table.sql dosyasını çalıştırın.');
        }
        throw error;
    }

    return data || [];
};

/**
 * Update report status (Admin only)
 */
export const updateReportStatus = async (reportId, status) => {
    const updateData = { status };

    // Try with updated_at first, fall back without it if column doesn't exist
    const { data, error } = await supabase
        .from('reports')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', reportId)
        .select()
        .single();

    if (error) {
        // If updated_at column doesn't exist, try without it
        if (error.message && error.message.includes('updated_at')) {
            const { data: data2, error: error2 } = await supabase
                .from('reports')
                .update(updateData)
                .eq('id', reportId)
                .select()
                .single();
            if (error2) throw error2;
            return data2;
        }
        console.error('Error updating report status:', error);
        throw error;
    }

    return data;
};

/**
 * Delete a report (Admin only)
 */
export const deleteReport = async (reportId) => {
    const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportId);

    if (error) {
        console.error('Error deleting report:', error);
        throw error;
    }
};

