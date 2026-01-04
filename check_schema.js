
require('dotenv').config({ path: 'app/frontend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    const { data, error } = await supabase
        .rpc('get_columns', { table_name: 'profiles' });

    if (error) {
        // If RPC fails (likely), try a direct select to see structure of returned data
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .limit(1);

        if (profileError) {
            console.error('Error fetching profile:', profileError);
        } else {
            console.log('Profile columns:', profile && profile.length > 0 ? Object.keys(profile[0]) : 'No profiles found');
        }
    } else {
        console.log('Columns:', data);
    }
}

checkSchema();
