#!/usr/bin/env python3
import os

# Template from HeimtextilienPage.js (first 30 lines)
template_start = '''import React, {{ useState, useEffect }} from 'react';
import {{ mockListings }} from './components';
import {{ useNavigate }} from 'react-router-dom';

function {function_name}() {{
    const navigate = useNavigate();
    const [category, setCategory] = useState('');
    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites') || '[]'));

    useEffect(() => {{ fetchListings(); }}, []);

    const fetchListings = async () => {{
        // Use mockListings as fallback when API is not available
        setListings(mockListings);
        setLoading(false);
    }};

    const toggleFavorite = (listingId) => {{
        setFavorites(prev => {{
            const newFavorites = prev.includes(listingId) ? prev.filter(id => id !== listingId) : [...prev, listingId];
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            return newFavorites;
        }});
    }};

    const filteredListings = listings.filter(listing => listing.category === 'Haus & Garten' && listing.subCategory === '{subcategory}' && (!category || listing.category === category) && (!priceFrom || listing.price >= parseFloat(priceFrom)) && (!priceTo || listing.price <= parseFloat(priceTo)));
'''

pages = [
    ("BadezimmerPage", "Badezimmer"),
    ("BueroPage", "Büro"),
    ("DekorationPage", "Dekoration"),
    ("DienstleistungenHausGartenPage", "Dienstleistungen Haus & Garten"),
    ("GartenzubehoerPflanzenPage", "Gartenzubehör & Pflanzen"),
    ("HeimwerkenPage", "Heimwerken"),
    ("KuecheEsszimmerPage", "Küche & Esszimmer"),
    ("LampenLichtPage", "Lampen & Licht"),
    ("SchlafzimmerPage", "Schlafzimmer"),
    ("WohnzimmerPage", "Wohnzimmer"),
    ("WeiteresHausGartenPage", "Weiteres Haus & Garten"),
]

base_dir = "app/frontend/src"

for function_name, subcategory in pages:
    filename = f"{function_name}.js"
    filepath = os.path.join(base_dir, filename)
    
    # Read the original file to keep everything after line 30
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Find where the return statement starts (should be around line 30-40)
    return_line_idx = None
    for i, line in enumerate(lines):
        if 'return (' in line and i > 20:
            return_line_idx = i
            break
    
    if return_line_idx:
        # Keep everything from the return statement onwards
        rest_of_file = ''.join(lines[return_line_idx:])
        
        # Create new file content
        new_content = template_start.format(function_name=function_name, subcategory=subcategory)
        new_content += "\n    " + rest_of_file
        
        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✓ Fixed {filename}")
    else:
        print(f"✗ Could not find return statement in {filename}")

print("All files fixed!")
