#!/usr/bin/env python3
"""
Script to update category counts in components.js to be dynamic from Supabase.
This will add a useEffect to fetch real category counts.
"""

import re

COMPONENTS_FILE = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src/components.js'

# Read the file
with open(COMPONENTS_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the CategorySidebar component and add useEffect for dynamic counts
# We'll add it right after the useState declarations

pattern = r"(export const CategorySidebar = \({ selectedCategory, setSelectedCategory }\) => \{\s+const \[expandedCategories, setExpandedCategories\] = useState\(\[\]\);\s+const navigate = useNavigate\(\);)"

replacement = r"""\1
  const [categoryCounts, setCategoryCounts] = useState({});

  // Fetch real category counts from Supabase
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const { supabase } = await import('./lib/supabase');
        
        // Get counts for each main category
        const counts = {};
        
        for (const category of categories) {
          if (category.name === 'Alle Kategorien') {
            // Get total count
            const { count } = await supabase
              .from('listings')
              .select('*', { count: 'exact', head: true });
            counts['Alle Kategorien'] = count || 0;
          } else {
            // Get count for specific category
            const { count } = await supabase
              .from('listings')
              .select('*', { count: 'exact', head: true })
              .eq('category', category.name);
            counts[category.name] = count || 0;
            
            // Get counts for subcategories
            if (category.subcategories) {
              for (const sub of category.subcategories) {
                const { count: subCount } = await supabase
                  .from('listings')
                  .select('*', { count: 'exact', head: true })
                  .eq('category', category.name)
                  .eq('sub_category', sub.name);
                counts[`${category.name}:${sub.name}`] = subCount || 0;
              }
            }
          }
        }
        
        setCategoryCounts(counts);
      } catch (error) {
        console.error('Error fetching category counts:', error);
      }
    };
    
    fetchCategoryCounts();
  }, []);"""

content = re.sub(pattern, replacement, content)

# Now update the category.count display to use dynamic counts
# Replace {category.count.toLocaleString('de-DE')} with {(categoryCounts[category.name] || category.count).toLocaleString('de-DE')}
content = re.sub(
    r'\{category\.count\.toLocaleString\(\'de-DE\'\)\}',
    r'{(categoryCounts[category.name] || category.count).toLocaleString(\'de-DE\')}',
    content
)

# Write back
with open(COMPONENTS_FILE, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Updated CategorySidebar to use dynamic counts from Supabase!")
print("📝 Category counts will now be fetched in real-time from the database.")
