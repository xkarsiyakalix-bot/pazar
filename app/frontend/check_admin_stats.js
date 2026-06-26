const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAllQueries() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const promises = [
        { name: 'listingsCount', query: supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active').or(`expiry_date.gt.${now.toISOString()},expiry_date.is.null`) },
        { name: 'profilesCount', query: supabase.from('profiles').select('*', { count: 'exact', head: true }) },
        { name: 'profilesDaily', query: supabase.from('profiles').select('id').gte('created_at', startOfDay) },
        { name: 'profilesMonthly', query: supabase.from('profiles').select('id').gte('created_at', startOfMonth) },
        { name: 'profilesYearly', query: supabase.from('profiles').select('id').gte('created_at', startOfYear) },
        { name: 'promosDaily', query: supabase.from('promotions').select('price, status').gte('created_at', startOfDay) },
        { name: 'promosMonthly', query: supabase.from('promotions').select('price, status').gte('created_at', startOfMonth) },
        { name: 'promosYearly', query: supabase.from('promotions').select('price, status').gte('created_at', startOfYear) },
        { name: 'visitsDaily', query: supabase.from('page_visits').select('user_id, session_id').gte('created_at', startOfDay) },
        { name: 'visitsMonthly', query: supabase.from('page_visits').select('user_id, session_id').gte('created_at', startOfMonth) },
        { name: 'visitsYearly', query: supabase.from('page_visits').select('user_id, session_id').gte('created_at', startOfYear) },
        { name: 'promosTrend', query: supabase.from('promotions').select('price, created_at, status').gte('created_at', sevenDaysAgo) },
        { name: 'listingsTrend', query: supabase.from('listings').select('created_at').gte('created_at', sevenDaysAgo) }
    ];

    for (let p of promises) {
        const { data, error, count } = await p.query;
        if (error) {
            console.error(`Error in ${p.name}:`, error);
        } else {
            console.log(`Success ${p.name}: data length ${data ? data.length : 0}, count: ${count}`);
        }
    }
}

testAllQueries();
