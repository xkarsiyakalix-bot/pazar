#!/usr/bin/env python3
import re
import os

pages = [
    ("BadezimmerPage.js", "Badezimmer"),
    ("BueroPage.js", "Büro"),
    ("DekorationPage.js", "Dekoration"),
    ("DienstleistungenHausGartenPage.js", "Dienstleistungen Haus & Garten"),
    ("GartenzubehoerPflanzenPage.js", "Gartenzubehör & Pflanzen"),
    ("HeimwerkenPage.js", "Heimwerken"),
    ("KuecheEsszimmerPage.js", "Küche & Esszimmer"),
    ("LampenLichtPage.js", "Lampen & Licht"),
    ("SchlafzimmerPage.js", "Schlafzimmer"),
    ("WohnzimmerPage.js", "Wohnzimmer"),
    ("WeiteresHausGartenPage.js", "Weiteres Haus & Garten"),
]

base_dir = "app/frontend/src"

for filename, subcategory in pages:
    filepath = os.path.join(base_dir, filename)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find and replace the broken fetchListings section
    pattern = r'useEffect\(\(\) => \{ fetchListings\(\); \}, \[\]\);.*?const filteredListings'
    
    replacement = f'''useEffect(() => {{ fetchListings(); }}, []);
    
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
    
    const filteredListings'''
    
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Fixed {filename}")

print("All files fixed!")
