require('dotenv').config({ path: '../../.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkListings() {
    const { data, error } = await supabase
        .from('listings')
        .select('id, title, price, price_type')
        .or('price_type.eq.negotiable,price_type.eq.giveaway')
        .limit(10);

    if (error) {
        console.error("Error fetching listings:", error);
    } else {
        console.log("Fetched Listings:", JSON.stringify(data, null, 2));
    }
}

checkListings();
