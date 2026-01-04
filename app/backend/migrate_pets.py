import os
from supabase import create_client, Client

url = "https://akyxtjqgvrzzbfogsdnd.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreXh0anFndnJ6emJmb2dzZG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NzAxNDcsImV4cCI6MjA4MjE0NjE0N30.vcSCQVRNsgW0Jw_dMT7kWucBgYa9qTDGQTqI7jTa-Tw"
supabase: Client = create_client(url, key)

# Mapping of current singular sub_category to target plural sub_category
mapping = {
    "Balık": "Balıklar",
    "Köpek": "Köpekler",
    "Kedi": "Kediler",
    "Küçükbaş Hayvanlar": "Küçük Hayvanlar",
    "Kümes Hayvanları": "Çiftlik Hayvanları",
    "At": "Atlar",
    "Kuş": "Kuşlar",
    "Hayvan Aksesuarları": "Aksesuarlar"
}

total_updated = 0

for singular, plural in mapping.items():
    print(f"Checking for sub_category: '{singular}' in Category: 'Evcil Hayvanlar'...")
    # Fetch rows to see if they exist
    rows = supabase.table("listings") \
        .select("id, title, sub_category") \
        .eq("category", "Evcil Hayvanlar") \
        .eq("sub_category", singular) \
        .execute()
    
    if rows.data:
        print(f"  Found {len(rows.data)} rows. Updating to '{plural}'...")
        for row in rows.data:
            print(f"    Updating ID {row['id']} ({row['title']})")
            upd = supabase.table("listings") \
                .update({"sub_category": plural}) \
                .eq("id", row['id']) \
                .execute()
            if upd.data:
                total_updated += 1
    else:
        print("  No rows found.")

print(f"\nMigration finished. Total pet listings updated: {total_updated}")
