const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env' }); // Adjust path if needed

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('listings')
    .select('*, profiles:user_id(*)')
    .limit(1)
    .single();
  
  if (error) {
    console.error('Error:', error.message);
    console.error('Details:', error.details);
    console.error('Hint:', error.hint);
  } else {
    console.log('Data found:', !!data);
    console.log('Joined Profile:', !!data.profiles);
  }
}

test();
