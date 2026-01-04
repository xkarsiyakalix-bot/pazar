
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env vars
const envPath = path.resolve(__dirname, 'app/frontend/.env');
console.log('Loading .env from:', envPath);
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('Checking profiles table schema...');

    // We can't directly query schema via client easily without admin rights or specific function, 
    // but we can try to selecting the columns.

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, subscription_tier, subscription_expiry, extra_paid_listings, is_pro, is_commercial')
            .limit(1);

        if (error) {
            console.error('Error selecting subscription columns:', error);
            console.log('Likely cause: Columns do not exist or RLS triggers error.');
        } else {
            console.log('Success! Columns exist. Data sample:', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkSchema();
