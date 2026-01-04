#!/bin/bash

# Find all page components that use GenericCategoryPage
echo "=== Page Components Using GenericCategoryPage ==="
grep -r "GenericCategoryPage" /Volumes/Kerem\ Aydin/Projeler/Kleinanzegen/12.12.2025/app/frontend/src/*.js | grep -v "components.js" | grep -v "App.js" | cut -d: -f1 | sort -u

echo ""
echo "=== Checking subCategory values in each page ==="
for file in $(grep -l "GenericCategoryPage" /Volumes/Kerem\ Aydin/Projeler/Kleinanzegen/12.12.2025/app/frontend/src/*.js | grep -v "components.js" | grep -v "App.js"); do
    echo ""
    echo "File: $(basename $file)"
    grep "subCategory=" "$file" | head -1
done
