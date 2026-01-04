
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('sub_category', 'Handarbeit, Basteln & Kunsthandwerk')
        .limit(5);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Found', data.length, 'listings');
    data.forEach(l => {
        console.log('ID:', l.id);
        console.log('Title:', l.title);
        console.log('Versand:', l.versand, typeof l.versand);
        console.log('Versand Art:', l.versand_art, typeof l.versand_art);
        console.log('---');
    });
}

checkData();
