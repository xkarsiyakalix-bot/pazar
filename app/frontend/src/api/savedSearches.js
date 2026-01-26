import { supabase } from '../lib/supabase';

/**
 * Create a new saved search
 * @param {Object} searchData - Search criteria
 * @returns {Promise<Object>} Created saved search
 */
export const createSavedSearch = async (searchData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('saved_searches')
        .insert({
            user_id: user.id,
            search_name: searchData.searchName,
            category: searchData.category,
            subcategory: searchData.subcategory,
            filters: searchData.filters || {},
            search_url: searchData.searchUrl
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating saved search:', error);
        throw error;
    }

    return data;
};

/**
 * Delete a saved search
 * @param {string} id - Saved search ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteSavedSearch = async (id) => {
    const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting saved search:', error);
        throw error;
    }

    return true;
};

/**
 * Get all saved searches for current user
 * @returns {Promise<Array>} List of saved searches
 */
export const getUserSavedSearches = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching saved searches:', error);
        return [];
    }

    return data || [];
};

/**
 * Check if a search URL is already saved
 * @param {string} searchUrl - URL to check
 * @returns {Promise<Object|null>} Saved search if exists, null otherwise
 */
export const checkIfSearchIsSaved = async (searchUrl) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .eq('search_url', searchUrl)
        .maybeSingle();

    if (error) {
        console.error('Error checking saved search:', error);
        return null;
    }

    return data;
};

/**
 * Delete saved search by URL
 * @param {string} searchUrl - URL of the saved search
 * @returns {Promise<boolean>} Success status
 */
export const deleteSavedSearchByUrl = async (searchUrl) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('user_id', user.id)
        .eq('search_url', searchUrl);

    if (error) {
        console.error('Error deleting saved search:', error);
        throw error;
    }

    return true;
};
