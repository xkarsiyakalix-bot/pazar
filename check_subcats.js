
const { createClient } = require('@supabase/supabase-js');

// Mock environment variables since we are running a standalone script
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSubcategories() {
    const { data, error } = await supabase
        .from('listings')
        .select('sub_category')
        .eq('category', 'Unterricht & Kurse');

    if (error) {
        console.error('Error:', error);
        return;
    }

    // Get distinct subcategories
    const subs = [...new Set(data.map(i => i.sub_category))];
    console.log('Subcategories found:', subs);
}

checkSubcategories();
