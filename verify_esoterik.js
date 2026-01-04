
const { createClient } = require('@supabase/supabase-js');

// Helper to check DB rows
const verifyData = async () => {
    // Just mock config for query building if needed, but we use direct client
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("No Supabase Credentials!");
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
        .from('listings')
        .select('id, sub_category, seller_type, federal_state, condition')
        .eq('category', 'Unterricht & Kurse')
        .eq('sub_category', 'Esoterik & Spirituelles')
        .limit(5);

    if (error) {
        console.error("DB Error:", error);
    } else {
        console.log("Updated Listings Sample:", data);
        if (data.length > 0) {
            console.log("Seller Type Sample:", data[0].seller_type);
            console.log("Federal State Sample:", data[0].federal_state);
        } else {
            console.log("No listings found for Esoterik & Spirituelles!");
        }
    }
};

verifyData();
