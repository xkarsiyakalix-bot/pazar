
import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

try:
    # Fetch all listings in 'Ev & Bahçe' to check subcategories
    response = supabase.table("listings") \
        .select("sub_category") \
        .eq("category", "Ev & Bahçe") \
        .execute()
    
    unique_subs = set()
    lamba_counts = {}

    for row in response.data:
        sub = row.get("sub_category")
        unique_subs.add(sub)
        
        if sub and ("Lamba" in sub or sub == "Aydınlatma"):
             key = f"{sub}"
             lamba_counts[key] = lamba_counts.get(key, 0) + 1

    print("Unique Subcategories in 'Ev & Bahçe':")
    for sub in sorted(list(unique_subs)):
        print(f" - '{sub}'")

    print("\nLamba Related Counts:")
    for key, count in lamba_counts.items():
        print(f" {key}: {count}")

except Exception as e:
    print(f"Error: {e}")
