require('dotenv').config({ path: '../../.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugListings() {
    console.log("Fetching listings invalidating cache...");

    // Check what categories start with Musik
    const { data: listings, error } = await supabase
        .from('listings')
        .select('id, title, category, sub_category, status, created_at')
        .ilike('category', '%Musik%')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching listings:", error);
        return;
    }

    console.log(`Found ${listings.length} listings in 'Musik...' categories:`);
    listings.forEach(l => {
        console.log(`ID: ${l.id}`);
        console.log(`  Title: "${l.title}"`);
        console.log(`  Category: "${l.category}"`);
        console.log(`  SubCategory: "${l.sub_category}"`);
        console.log(`  Status: "${l.status}"`);
        console.log(`  Created: ${l.created_at}`);
        console.log('---');
    });

}

debugListings();
