const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'app/frontend/.env' });

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function test() {
    // Just fetch a user id that is following someone
    const { data: follows } = await supabase.from('user_follows').select('*').limit(1);
    if (!follows || follows.length === 0) {
        console.log('No follows in db');
        return;
    }
    const follower_id = follows[0].follower_id;
    console.log('Testing for follower:', follower_id);

    const { data, error } = await supabase
        .from('user_follows')
        .select(`
            following_id,
            following:profiles!following_id (
                id,
                full_name
            )
        `)
        .eq('follower_id', follower_id);
    
    console.log('Error:', error);
    console.log('Data:', JSON.stringify(data, null, 2));
    
    // Also try without the explicit foreign key name if the above fails
    const { data: data2, error: error2 } = await supabase
        .from('user_follows')
        .select(`
            following_id,
            profiles!following_id (
                id,
                full_name
            )
        `)
        .eq('follower_id', follower_id);
        
    console.log('Error2:', error2);
    console.log('Data2:', JSON.stringify(data2, null, 2));
}

test();
