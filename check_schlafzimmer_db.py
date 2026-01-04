
import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

try:
    # Fetch all listings in 'Ev & Bahçe' > 'Yatak Odası'
    response = supabase.table("listings") \
        .select("sub_category, schlafzimmer_art") \
        .eq("category", "Ev & Bahçe") \
        .eq("sub_category", "Yatak Odası") \
        .execute()
    
    art_counts = {}

    for row in response.data:
        art = row.get("schlafzimmer_art")
        key = f"{art}"
        art_counts[key] = art_counts.get(key, 0) + 1

    print("\nSchlafzimmer Count:")
    for key, count in art_counts.items():
        print(f" {key}: {count}")

except Exception as e:
    print(f"Error: {e}")
