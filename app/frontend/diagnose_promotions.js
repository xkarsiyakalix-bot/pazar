
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

// Use SERVICE ROLE KEY to bypass RLS and see raw truth if possible
// If not available in .env, we fallback to anon key but note the limitation
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function diagnose() {
    console.log('Diagnosing Promotions Table...');

    // 1. Check total count
    const { count, error: countError } = await supabase
        .from('promotions')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('Error counting promotions:', countError.message);
    } else {
        console.log(`Total rows in 'promotions' table: ${count}`);
    }

    // 2. Check if admin column exists in profiles to know if we can base RLS on it
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .limit(1);

    if (profileError) {
        console.log('Could not check is_admin column:', profileError.message);
    } else {
        console.log('is_admin column verification:', profileData);
    }

    // 3. List recent promotions
    const { data: recent, error: listError } = await supabase
        .from('promotions')
        .select('id, user_id, package_type, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

    if (listError) {
        console.error('Error listing recent promotions:', listError);
    } else {
        console.log('Recent promotions:', recent);
    }
}

diagnose();
