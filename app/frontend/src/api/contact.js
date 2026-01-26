import { supabase } from '../lib/supabase';

/**
 * Saves a contact message to the database
 * @param {Object} data - { name, email, subject, message }
 * @returns {Promise<Object>} The saved message data
 */
export const saveContactMessage = async (data) => {
    const { data: result, error } = await supabase
        .from('contact_messages')
        .insert([
            {
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message
            }
        ]);

    if (error) {
        console.error('Error saving contact message:', error);
        throw error;
    }

    return result;
};
