
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEsoterikData() {
    const { data, error } = await supabase
        .from('listings')
        .select('id, title, seller_type, federal_state, condition')
        .eq('category', 'Unterricht & Kurse')
        .eq('sub_category', 'Esoterik & Spirituelles');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Found ${data.length} listings.`);
    if (data.length > 0) {
        console.log('Sample Data (First 5):');
        console.table(data.slice(0, 5));
    } else {
        console.log('No listings found.');
    }
}

checkEsoterikData();
