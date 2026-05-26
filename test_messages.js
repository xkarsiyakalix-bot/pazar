require('dotenv').config({ path: 'app/frontend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testMessages() {
  console.log("Checking if messages table exists and is accessible...");
  const { data, error } = await supabase
    .from('messages')
    .select('id')
    .limit(1);

  if (error) {
    console.error("SUPABASE ERROR:", error);
  } else {
    console.log("Success! Data:", data);
  }
}

testMessages();
