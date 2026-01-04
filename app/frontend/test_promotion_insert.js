
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testPromotionInsert() {
    console.log('Testing promotion insert with anon key (simulating client)...');

    // We need a user ID. We'll try to sign in or use a hardcoded one if env has test user, 
    // but without auth, RLS might block. 
    // Let's try to just check the RLS policy if possible by attempting an insert with a random UUID.
    // If it fails with "new row violates row-level security policy", we know RLS is on and blocking.

    const testId = '00000000-0000-0000-0000-000000000000'; // Dummy ID

    const { data, error } = await supabase
        .from('promotions')
        .insert({
            user_id: testId,
            package_type: 'test_pkg',
            price: 0,
            duration_days: 1,
            start_date: new Date().toISOString(),
            status: 'test'
        });

    if (error) {
        console.error('Insert failed:', error);
        console.log('Error code:', error.code);
        console.log('Details:', error.message);
    } else {
        console.log('Insert success (unexpected if RLS is strict without auth)! Data:', data);
    }
}

testPromotionInsert();
