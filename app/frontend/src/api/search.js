// Search API Service - Supabase Implementation
import { supabase } from '../lib/supabase';

export const searchApi = {
    /**
     * Search listings with filters using Supabase
     */
    async search(params = {}) {
        try {
            let query = supabase.from('listings').select('*');

            // Text search on title and description
            if (params.q) {
                query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%`);
            }

            // Category filter
            if (params.category && params.category !== 'Tüm Kategoriler') {
                query = query.eq('category', params.category);
            }

            // Location filter
            if (params.location && params.location !== 'Türkiye' && params.location !== 'Tüm Şehirler') {
                query = query.ilike('city', `%${params.location}%`);
            }

            // Price range filters
            if (params.min_price) {
                query = query.gte('price', params.min_price);
            }
            if (params.max_price) {
                query = query.lte('price', params.max_price);
            }

            // Condition filter
            if (params.condition) {
                query = query.eq('condition', params.condition);
            }

            // Sorting
            const sortBy = params.sort_by || 'created_at';
            const sortOrder = params.sort_order === 'asc' ? { ascending: true } : { ascending: false };
            query = query.order(sortBy, sortOrder);

            const { data, error } = await query;

            if (error) throw error;

            console.log(`✅ Found ${data?.length || 0} results`);
            return data || [];
        } catch (error) {
            console.error('Error searching listings:', error);
            return [];
        }
    },

    /**
     * Build search params object
     */
    buildParams({
        query = '',
        category = '',
        location = '',
        minPrice = null,
        maxPrice = null,
        condition = null,
        sortBy = 'created_at',
        sortOrder = 'desc'
    } = {}) {
        return {
            q: query,
            category,
            location,
            min_price: minPrice,
            max_price: maxPrice,
            condition,
            sort_by: sortBy,
            sort_order: sortOrder
        };
    }
};

export default searchApi;
