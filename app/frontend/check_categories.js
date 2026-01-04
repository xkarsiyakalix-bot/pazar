require('dotenv').config({ path: '../../.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCategories() {
    const { data: categories, error } = await supabase
        .from('categories')
        .select('id, name');

    if (error) {
        console.error("Error fetching categories:", error);
        return;
    }

    console.log("Categories:");
    for (const cat of categories) {
        console.log(`- "${cat.name}"`);
        if (cat.name.includes('Musik')) {
            const { data: subs, error: subError } = await supabase
                .from('subcategories')
                .select('name')
                .eq('category_id', cat.id);
            if (subs) {
                console.log("  Subcategories:");
                subs.forEach(s => console.log(`    - "${s.name}"`));
            }
        }
    }
}

checkCategories();
