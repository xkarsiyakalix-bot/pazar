
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/12.12.2025/app/frontend/.env' });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkListing() {
    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', 'f840aadb-9b44-4961-8c47-b337d43e4091')
        .single();

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Full Listing Data:', JSON.stringify(data, null, 2));
}

checkListing();
