
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
const envPath = path.resolve(__dirname, '.env');
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

async function checkPromotionsSchema() {
    console.log('Checking promotions table schema...');

    try {
        const { data, error } = await supabase
            .from('promotions')
            .select('*')
            .limit(1);

        if (error) {
            console.error('Error selecting promotions:', error);
            console.log('Code: ', error.code);
            console.log('Message: ', error.message);
        } else {
            console.log('Success! Table exists. Data sample:', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkPromotionsSchema();
