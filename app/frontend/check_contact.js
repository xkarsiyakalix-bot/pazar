const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function run() {
  const { data, error } = await supabase
        .from('contact_messages')
        .insert([
            {
                name: "Test User",
                email: "test@example.com",
                subject: "Test Subject",
                message: "Test Message"
            }
        ]);
  console.log("Error:", error);
}

run();
