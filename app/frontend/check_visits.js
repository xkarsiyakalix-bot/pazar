require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('page_visits').select('*').limit(1);
  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Success, data:", data);
  }
}
check();
