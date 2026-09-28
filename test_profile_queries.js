const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'app/frontend/.env' });

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function test() {
    // 1. Get a follower
    const { data: follows } = await supabase.from('user_follows').select('*').limit(1);
    if (!follows || follows.length === 0) {
        console.log('No follows in db');
        return;
    }
    const user_id = follows[0].follower_id;
    console.log('Testing for user:', user_id);

    // 2. Mock getFollowingCount
    const { count, error } = await supabase
        .from('user_follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', user_id);
    
    console.log('Following count:', count, error);

    // 3. Mock getFollowing
    const { data: dataFollowing, error: errorFollowing } = await supabase
        .from('user_follows')
        .select(`
            following_id,
            following:profiles!following_id (
                id,
                full_name
            )
        `)
        .eq('follower_id', user_id);
        
    console.log('Following data:', JSON.stringify(dataFollowing, null, 2), errorFollowing);
    
    // 4. Transform like getFollowing
    const followedUsers = dataFollowing?.map(f => f.following).filter(Boolean) || [];
    console.log('Extracted followed users:', followedUsers);
}

test();
