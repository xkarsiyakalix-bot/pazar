const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'app/frontend/.env' });

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function test() {
    const { data: follows } = await supabase.from('user_follows').select('*').limit(1);
    const user_id = follows[0].follower_id;

    const { data, error } = await supabase
        .from('user_follows')
        .select(`
            following_id,
            following:profiles!following_id (
                id,
                user_number,
                full_name,
                avatar_url,
                store_logo,
                city,
                postal_code,
                bio,
                created_at,
                phone,
                email,
                is_pro,
                is_commercial,
                subscription_tier,
                seller_type
            )
        `)
        .eq('follower_id', user_id);
    
    console.log('Error:', error);
}

test();
