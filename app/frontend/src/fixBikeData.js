// Script to fix missing art_type and federal_state values for bike listings
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ynleaatvkftkafiyqufv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubGVhYXR2a2Z0a2FmaXlxdWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MzA4ODIsImV4cCI6MjA4MDMwNjg4Mn0.Ym945vCX_d2eL1-RlE4xXVwo4uGrxWUZeJgyOiHgVEA';

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to get federal state from postal code
const getStateFromZip = (zip) => {
    if (!zip || zip.length < 1) return '';
    const firstTwoDigits = parseInt(zip.substring(0, 2));

    if (isNaN(firstTwoDigits)) return '';

    if (firstTwoDigits >= 1 && firstTwoDigits <= 1) return 'Brandenburg';
    if (firstTwoDigits >= 2 && firstTwoDigits <= 3) return 'Sachsen';
    if (firstTwoDigits >= 4 && firstTwoDigits <= 9) return 'Sachsen-Anhalt';
    if (firstTwoDigits >= 10 && firstTwoDigits <= 14) return 'Berlin';
    if (firstTwoDigits >= 15 && firstTwoDigits <= 19) return 'Brandenburg';
    if (firstTwoDigits >= 20 && firstTwoDigits <= 21) return 'Hamburg';
    if (firstTwoDigits >= 22 && firstTwoDigits <= 25) return 'Schleswig-Holstein';
    if (firstTwoDigits >= 26 && firstTwoDigits <= 27) return 'Bremen';
    if (firstTwoDigits >= 28 && firstTwoDigits <= 29) return 'Niedersachsen';
    if (firstTwoDigits >= 30 && firstTwoDigits <= 34) return 'Niedersachsen';
    if (firstTwoDigits >= 35 && firstTwoDigits <= 36) return 'Hessen';
    if (firstTwoDigits === 37) return 'Niedersachsen';
    if (firstTwoDigits === 38) return 'Sachsen-Anhalt';
    if (firstTwoDigits === 39) return 'Sachsen-Anhalt';
    if (firstTwoDigits >= 40 && firstTwoDigits <= 48) return 'Nordrhein-Westfalen';
    if (firstTwoDigits === 49) return 'Niedersachsen';
    if (firstTwoDigits >= 50 && firstTwoDigits <= 53) return 'Nordrhein-Westfalen';
    if (firstTwoDigits >= 54 && firstTwoDigits <= 56) return 'Rheinland-Pfalz';
    if (firstTwoDigits >= 57 && firstTwoDigits <= 59) return 'Nordrhein-Westfalen';
    if (firstTwoDigits >= 60 && firstTwoDigits <= 65) return 'Hessen';
    if (firstTwoDigits === 66) return 'Saarland';
    if (firstTwoDigits === 67) return 'Rheinland-Pfalz';
    if (firstTwoDigits >= 68 && firstTwoDigits <= 69) return 'Baden-Württemberg';
    if (firstTwoDigits >= 70 && firstTwoDigits <= 79) return 'Baden-Württemberg';
    if (firstTwoDigits >= 80 && firstTwoDigits <= 89) return 'Bayern';
    if (firstTwoDigits >= 90 && firstTwoDigits <= 96) return 'Bayern';
    if (firstTwoDigits === 97) return 'Thüringen';
    if (firstTwoDigits >= 98 && firstTwoDigits <= 99) return 'Thüringen';

    return '';
};

async function fixBikeListings() {
    console.log('🔧 Fixing missing data in bike listings...\n');

    try {
        // Fix specific listings with missing data
        const updates = [
            {
                id: '9cea72ca-3e69-4d47-b5dd-b5775944c968',
                title: 'gazelle e bike',
                art_type: 'Damen', // E-Bike Damen based on title
                postal_code: '48653'
            },
            {
                id: '5e93155e-70e8-40b1-ad2f-33e6620a73de',
                title: 'Gazelle Areoyo E-Bike Damen 57cm 7gang 28Zoll Hollandrad',
                art_type: 'Damen', // Clearly Damen from title
                postal_code: '48653'
            },
            {
                id: '6b5fbf84-da24-4d14-82c3-5f284669a57c',
                title: 'Gazelle Arroyo C7 E-​Bike Damen 53cm 7gang Hollandrad',
                art_type: 'Damen', // Clearly Damen from title
                postal_code: '48653'
            }
        ];

        for (const update of updates) {
            const federal_state = getStateFromZip(update.postal_code);

            console.log(`Updating ID ${update.id}:`);
            console.log(`  Title: "${update.title}"`);
            console.log(`  Setting art_type: "${update.art_type}"`);
            console.log(`  Setting federal_state: "${federal_state}"`);

            const { data, error } = await supabase
                .from('listings')
                .update({
                    art_type: update.art_type,
                    federal_state: federal_state
                })
                .eq('id', update.id)
                .select();

            if (error) {
                console.error(`  ❌ Error: ${error.message}`);
            } else {
                console.log(`  ✅ Updated successfully!`);
            }
            console.log('');
        }

        console.log('🎉 All updates completed!\n');

        // Verify the updates
        console.log('🔍 Verifying updates...\n');
        const { data: listings, error } = await supabase
            .from('listings')
            .select('id, title, art_type, federal_state')
            .eq('category', 'Auto, Rad & Boot')
            .eq('sub_category', 'Fahrräder & Zubehör');

        if (error) {
            console.error('❌ Error fetching listings:', error);
            return;
        }

        const missingArtType = listings.filter(l => !l.art_type);
        const missingFederalState = listings.filter(l => !l.federal_state);

        console.log('📊 Verification Results:');
        console.log(`   Total listings: ${listings.length}`);
        console.log(`   Missing art_type: ${missingArtType.length}`);
        console.log(`   Missing federal_state: ${missingFederalState.length}`);

        if (missingArtType.length === 0 && missingFederalState.length === 0) {
            console.log('\n✅ All bike listings now have complete data!');
        } else {
            console.log('\n⚠️  Some listings still have missing data.');
        }

    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

fixBikeListings();
