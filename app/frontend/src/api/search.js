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
                const locations = params.location.split(',').filter(Boolean);
                if (locations.length > 0) {
                    query = query.in('federal_state', locations);
                }
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
     * Get suggestions based on a search term
     */
    async getSuggestions(term) {
        if (!term || term.trim().length < 2) return { categories: [], listings: [] };

        try {
            const queryTerm = term.trim();

            // 1. Fetch matching listings titles
            const { data: listings, error: listingsError } = await supabase
                .from('listings')
                .select('id, title, category')
                .ilike('title', `%${queryTerm}%`)
                .eq('status', 'active')
                .limit(5);

            if (listingsError) throw listingsError;

            // 2. Fetch unique categories that match the term
            const { data: categories, error: catsError } = await supabase
                .from('listings')
                .select('category')
                .ilike('category', `%${queryTerm}%`)
                .eq('status', 'active');

            if (catsError) throw catsError;

            // Get unique category names
            const uniqueCategories = [...new Set(categories.map(item => item.category))].slice(0, 3);

            return {
                categories: uniqueCategories,
                listings: listings || []
            };
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            return { categories: [], listings: [] };
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
    },

    /**
     * Get listing counts grouped by category for the current search context
     */
    async getCategoryCounts(params = {}) {
        try {
            let query = supabase.from('listings').select('category');

            // Text search on title and description
            if (params.q) {
                query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%`);
            }

            // Location filter
            if (params.location && params.location !== 'Türkiye' && params.location !== 'Tüm Şehirler') {
                const locations = params.location.split(',').filter(Boolean);
                if (locations.length > 0) {
                    query = query.in('federal_state', locations);
                }
            }

            const { data, error } = await query;

            if (error) throw error;

            // Group and count
            const counts = (data || []).reduce((acc, item) => {
                const cat = item.category;
                acc[cat] = (acc[cat] || 0) + 1;
                return acc;
            }, {});

            return counts;
        } catch (error) {
            console.error('Error fetching category counts:', error);
            return {};
        }
    },

    /**
     * Get listing counts grouped by city for the current search context
     */
    async getCityCounts(params = {}) {
        try {
            let query = supabase.from('listings').select('federal_state');

            // Text search on title and description
            if (params.q) {
                query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%`);
            }

            // Category filter
            if (params.category && params.category !== 'Tüm Kategoriler') {
                query = query.eq('category', params.category);
            }

            const { data, error } = await query;

            if (error) throw error;

            // Group and count
            const counts = (data || []).reduce((acc, item) => {
                const city = item.federal_state;
                if (city) {
                    acc[city] = (acc[city] || 0) + 1;
                }
                return acc;
            }, {});

            return counts;
        } catch (error) {
            console.error('Error fetching city counts:', error);
            return {};
        }
    }
};

export default searchApi;
