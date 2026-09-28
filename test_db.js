const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'app/frontend/.env' });

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function check() {
  const { data, error } = await supabase.from('profiles').select('id, email, last_seen').limit(5);
  console.log(data);
  console.log(error);
}
check();
