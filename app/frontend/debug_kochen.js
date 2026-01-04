const { createClient } = require('@supabase/supabase-js');

// Config from .env
const SUPABASE_URL = 'https://ynleaatvkftkafiyqufv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubGVhYXR2a2Z0a2FmaXlxdWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MzA4ODIsImV4cCI6MjA4MDMwNjg4Mn0.Ym945vCX_d2eL1-RlE4xXVwo4uGrxWUZeJgyOiHgVEA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkKochenListings() {
    console.log('Querying Kochen & Backen listings...');

    // First, check basic query
    const { data, error } = await supabase
        .from('listings')
        .select('id, title, category, sub_category, seller_type, federal_state, offer_type')
        .eq('category', 'Unterricht & Kurse')
        .eq('sub_category', 'Kochen & Backen');

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    console.log(`Found ${data.length} listings in "Kochen & Backen".`);
    if (data.length > 0) {
        console.log('Sample Listing:', JSON.stringify(data[0], null, 2));
    } else {
        console.log('No listings found in "Kochen & Backen". Checking "Unterricht & Kurse"...');
        const { data: catData } = await supabase
            .from('listings')
            .select('sub_category')
            .eq('category', 'Unterricht & Kurse');

        const subCats = [...new Set(catData.map(l => l.sub_category))];
        console.log('Available sub-categories in "Unterricht & Kurse":', subCats);
    }
}

checkKochenListings();
