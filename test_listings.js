const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'app/frontend/.env' });

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function test() {
    const { data, error } = await supabase.from('listings').select('user_id').limit(1);
    console.log(error || data);
}

test();
