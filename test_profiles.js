require('dotenv').config({ path: 'app/frontend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfiles() {
  console.log("Checking profiles table...");
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, store_logo, is_pro, is_commercial, subscription_tier, subscription_expiry, store_slug, user_number')
    .limit(1);

  if (error) {
    console.error("PROFILES SELECT ERROR:", error);
  } else {
    console.log("PROFILES DATA SUCCESS! Found:", data);
  }
}

checkProfiles();
