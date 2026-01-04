#!/bin/bash
# Bulk fix for all Eğitim & Kurslar subcategory pages
# This script updates subCategory props to match database values

echo "Fixing all Education subcategory pages..."

# Array of files and their corrections
declare -A fixes=(
    ["MusikGesangPage.js"]='s/subCategory="Müzik & Şan Dersleri"/subCategory="Müzik & Şan"/'
    ["NachhilfePage.js"]='s/subCategory="Özel Ders"/subCategory="Özel Ders"/'  # Already correct
    ["SportkursePage.js"]='s/subCategory="Spor Kursları"/subCategory="Spor Kursları"/'  # Already correct
    ["SprachkursePage.js"]='s/subCategory="Dil Kursları"/subCategory="Dil Kursları"/'  # Already correct
    ["TanzkursePage.js"]='s/subCategory="Dans Kursları"/subCategory="Dans Kursları"/'  # Already correct
    ["WeiterbildungPage.js"]='s/subCategory="Sürekli Eğitim"/subCategory="Sürekli Eğitim"/'  # Already correct
    ["WeitereUnterrichtKursePage.js"]='s/subCategory="Diğer Dersler & Kurslar"/subCategory="Diğer Eğitim & Kurslar"/'
    ["ComputerkursePage.js"]='s/subCategory="Bilgisayar Kursları"/subCategory="Bilgisayar Kursları"/'  # Already correct
    ["EsoterikSpirituellesPage.js"]='s/subCategory="Ezoterizm & Spiritüalizm"/subCategory="Ezoterizm & Spiritüalizm"/'  # Already correct
)

cd "/Volumes/Kerem Aydin/Projeler/Kleinanzegen/12.12.2025/app/frontend/src"

for file in "${!fixes[@]}"; do
    if [ -f "$file" ]; then
        echo "Processing $file..."
        sed -i '' "${fixes[$file]}" "$file"
    fi
done

echo "Done! All files updated."
