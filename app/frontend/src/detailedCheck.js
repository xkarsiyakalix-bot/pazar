// Detailed check of all bike listings
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ynleaatvkftkafiyqufv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubGVhYXR2a2Z0a2FmaXlxdWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MzA4ODIsImV4cCI6MjA4MDMwNjg4Mn0.Ym945vCX_d2eL1-RlE4xXVwo4uGrxWUZeJgyOiHgVEA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function detailedCheck() {
    console.log('🔍 Detailed check of all bike listings...\n');

    try {
        const { data: listings, error } = await supabase
            .from('listings')
            .select('*')
            .eq('category', 'Auto, Rad & Boot')
            .eq('sub_category', 'Fahrräder & Zubehör');

        if (error) {
            console.error('❌ Error:', error);
            return;
        }

        console.log(`Total listings: ${listings.length}\n`);

        listings.forEach((listing, index) => {
            console.log(`\n${index + 1}. ID: ${listing.id}`);
            console.log(`   Title: "${listing.title}"`);
            console.log(`   art_type: ${listing.art_type || '❌ NULL'}`);
            console.log(`   bike_type: ${listing.bike_type || '❌ NULL'}`);
            console.log(`   federal_state: ${listing.federal_state || '❌ NULL'}`);
            console.log(`   postal_code: ${listing.postal_code || 'N/A'}`);
            console.log(`   city: ${listing.city || 'N/A'}`);
            console.log(`   user_id: ${listing.user_id}`);
        });

    } catch (err) {
        console.error('❌ Error:', err);
    }
}

detailedCheck();
