#!/bin/bash

# Script to update all category pages from mockListings to Supabase
# This script will update all .js files in the frontend/src directory

SRC_DIR="/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src"
BACKUP_DIR="/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/backup_$(date +%Y%m%d_%H%M%S)"

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "🔄 Starting batch update of category pages..."
echo "📁 Backup directory: $BACKUP_DIR"

# Counter
updated=0
skipped=0

# Process each .js file
for file in "$SRC_DIR"/*.js; do
    filename=$(basename "$file")
    
    # Skip certain files
    if [[ "$filename" == "components.js" ]] || \
       [[ "$filename" == "index.js" ]] || \
       [[ "$filename" == "App.js" ]] || \
       [[ "$filename" == "SEO.js" ]] || \
       [[ "$filename" == "LazyLoad.js" ]]; then
        continue
    fi
    
    # Check if file contains mockListings
    if grep -q "import { mockListings } from './components';" "$file"; then
        # Create backup
        cp "$file" "$BACKUP_DIR/$filename"
        
        # Remove mockListings import
        sed -i '' "/import { mockListings } from '.\/components';/d" "$file"
        
        # Replace fetchListings function
        # This is a simplified replacement - may need manual review
        perl -i -pe 'BEGIN{undef $/;} s/const fetchListings = async \(\) => \{\s*setListings\(mockListings\);\s*setLoading\(false\);\s*\};/const fetchListings = async () => {\n        try {\n            const response = await fetch('\''http:\/\/localhost:8000\/api\/listings'\'');\n            if (response.ok) {\n                const data = await response.json();\n                setListings(data);\n            }\n        } catch (error) {\n            console.error('\''Error fetching listings:'\'', error);\n        } finally {\n            setLoading(false);\n        }\n    };/gs' "$file"
        
        echo "✅ Updated: $filename"
        ((updated++))
    else
        ((skipped++))
    fi
done

echo ""
echo "📊 Summary:"
echo "   ✅ Updated: $updated files"
echo "   ⏭️  Skipped: $skipped files"
echo "   💾 Backups saved to: $BACKUP_DIR"
echo ""
echo "⚠️  Please review the changes and test the application!"
