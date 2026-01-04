#!/bin/bash
# Script to update all Haus & Garten pages to use mockListings as fallback

PAGES=(
  "BadezimmerPage.js"
  "BueroPage.js"
  "DekorationPage.js"
  "DienstleistungenHausGartenPage.js"
  "GartenzubehoerPflanzenPage.js"
  "HeimtextilienPage.js"
  "HeimwerkenPage.js"
  "KuecheEsszimmerPage.js"
  "LampenLichtPage.js"
  "SchlafzimmerPage.js"
  "WohnzimmerPage.js"
  "WeiteresHausGartenPage.js"
)

cd "app/frontend/src"

for page in "${PAGES[@]}"; do
  echo "Updating $page..."
  
  # Add import statement after the first import line
  sed -i '' "2i\\
import { mockListings } from './components';\\
" "$page"
  
  # Replace the fetchListings function to use mockListings as fallback
  sed -i '' 's/const fetchListings = async () => {/const fetchListings = async () => {\
        \/\/ Use mockListings as fallback when API is not available\
        setListings(mockListings);\
        setLoading(false);\
        return;\
        \/\/ Original API code (commented out):\
        \/\//g' "$page"
  
  echo "✓ Updated $page"
done

echo "All pages updated!"
