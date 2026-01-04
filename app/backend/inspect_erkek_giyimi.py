
import collections
from supabase import create_client, Client

# Configuration
URL = "https://akyxtjqgvrzzbfogsdnd.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreXh0anFndnJ6emJmb2dzZG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NzAxNDcsImV4cCI6MjA4MjE0NjE0N30.vcSCQVRNsgW0Jw_dMT7kWucBgYa9qTDGQTqI7jTa-Tw"

supabase: Client = create_client(URL, KEY)

def inspect_erkek_giyimi():
    print("Fetching 'Erkek Giyimi' and 'Herrenbekleidung' listings...")
    
    # Fetch all relevant listings
    try:
        response = supabase.table("listings") \
            .select("sub_category, herrenbekleidung_art, herrenbekleidung_marke, herrenbekleidung_size, herrenbekleidung_color") \
            .in_("sub_category", ["Erkek Giyimi", "Herrenbekleidung"]) \
            .execute()
        
        listings = response.data
        print(f"Total listings found: {len(listings)}")
        
        if not listings:
            return

        # Aggregate counts
        art_counts = collections.Counter()
        marke_counts = collections.Counter()
        size_counts = collections.Counter()
        color_counts = collections.Counter()
        subcat_counts = collections.Counter()

        for l in listings:
            subcat_counts[l.get('sub_category')] += 1
            art_counts[l.get('herrenbekleidung_art')] += 1
            marke_counts[l.get('herrenbekleidung_marke')] += 1
            size_counts[l.get('herrenbekleidung_size')] += 1
            color_counts[l.get('herrenbekleidung_color')] += 1

        print("\n--- Subcategories ---")
        for k, v in subcat_counts.most_common():
            print(f"'{k}': {v}")

        print("\n--- Art (Type) ---")
        for k, v in art_counts.most_common():
            print(f"'{k}': {v}")

        print("\n--- Marke (Brand) ---")
        for k, v in marke_counts.most_common():
            print(f"'{k}': {v}")

        print("\n--- Size ---")
        for k, v in size_counts.most_common():
            print(f"'{k}': {v}")

        print("\n--- Color ---")
        for k, v in color_counts.most_common():
            print(f"'{k}': {v}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_erkek_giyimi()
