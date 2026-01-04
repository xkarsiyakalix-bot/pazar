// Temporary script to check bike listing data in Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ynleaatvkftkafiyqufv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubGVhYXR2a2Z0a2FmaXlxdWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MzA4ODIsImV4cCI6MjA4MDMwNjg4Mn0.Ym945vCX_d2eL1-RlE4xXVwo4uGrxWUZeJgyOiHgVEA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBikeListings() {
    console.log('🔍 Checking bike listings in database...\n');

    try {
        // Fetch all bike listings
        const { data: listings, error } = await supabase
            .from('listings')
            .select('id, title, art_type, bike_type, federal_state, postal_code, city, category, sub_category')
            .eq('category', 'Auto, Rad & Boot')
            .eq('sub_category', 'Fahrräder & Zubehör');

        if (error) {
            console.error('❌ Error fetching listings:', error);
            return;
        }

        console.log(`📊 Total bike listings found: ${listings.length}\n`);

        // Analyze art_type field
        const missingArtType = listings.filter(l => !l.art_type);
        const artTypeValues = {};
        listings.forEach(l => {
            if (l.art_type) {
                artTypeValues[l.art_type] = (artTypeValues[l.art_type] || 0) + 1;
            }
        });

        console.log('🎨 ART_TYPE Analysis:');
        console.log(`   - Missing art_type: ${missingArtType.length} listings`);
        console.log(`   - Existing values:`);
        Object.entries(artTypeValues).forEach(([value, count]) => {
            console.log(`     • "${value}": ${count} listings`);
        });
        console.log('');

        // Analyze federal_state field
        const missingFederalState = listings.filter(l => !l.federal_state);
        const federalStateValues = {};
        listings.forEach(l => {
            if (l.federal_state) {
                federalStateValues[l.federal_state] = (federalStateValues[l.federal_state] || 0) + 1;
            }
        });

        console.log('📍 FEDERAL_STATE Analysis:');
        console.log(`   - Missing federal_state: ${missingFederalState.length} listings`);
        console.log(`   - Existing values:`);
        Object.entries(federalStateValues).forEach(([value, count]) => {
            console.log(`     • "${value}": ${count} listings`);
        });
        console.log('');

        // Show listings with missing data
        if (missingArtType.length > 0 || missingFederalState.length > 0) {
            console.log('⚠️  Listings with missing data:');
            const problematicListings = listings.filter(l => !l.art_type || !l.federal_state);
            problematicListings.forEach(l => {
                console.log(`   ID ${l.id}: "${l.title}"`);
                console.log(`      - art_type: ${l.art_type || '❌ MISSING'}`);
                console.log(`      - federal_state: ${l.federal_state || '❌ MISSING'}`);
                console.log(`      - postal_code: ${l.postal_code || 'N/A'}`);
                console.log(`      - city: ${l.city || 'N/A'}`);
                console.log('');
            });
        } else {
            console.log('✅ All listings have complete data!');
        }

    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

checkBikeListings();
