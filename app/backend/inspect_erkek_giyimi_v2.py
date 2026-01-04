
import collections
from supabase import create_client, Client

# Configuration
URL = "https://akyxtjqgvrzzbfogsdnd.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreXh0anFndnJ6emJmb2dzZG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NzAxNDcsImV4cCI6MjA4MjE0NjE0N30.vcSCQVRNsgW0Jw_dMT7kWucBgYa9qTDGQTqI7jTa-Tw"

supabase: Client = create_client(URL, KEY)

def inspect_erkek_giyimi_extra():
    print("Fetching 'Erkek Giyimi' and 'Herrenbekleidung' listings...")
    
    try:
        response = supabase.table("listings") \
            .select("sub_category, condition, versand_art, offer_type, seller_type") \
            .in_("sub_category", ["Erkek Giyimi", "Herrenbekleidung"]) \
            .execute()
        
        listings = response.data
        print(f"Total listings found: {len(listings)}")
        
        if not listings:
            return

        cond_counts = collections.Counter()
        versand_counts = collections.Counter()
        offer_counts = collections.Counter()
        seller_counts = collections.Counter()

        for l in listings:
            cond_counts[l.get('condition')] += 1
            versand_counts[l.get('versand_art')] += 1
            offer_counts[l.get('offer_type')] += 1
            seller_counts[l.get('seller_type')] += 1

        print("\n--- Condition ---")
        for k, v in cond_counts.most_common():
            print(f"'{k}': {v}")

        print("\n--- Versand ---")
        for k, v in versand_counts.most_common():
            print(f"'{k}': {v}")

        print("\n--- Offer Type ---")
        for k, v in offer_counts.most_common():
            print(f"'{k}': {v}")

        print("\n--- Seller Type ---")
        for k, v in seller_counts.most_common():
            print(f"'{k}': {v}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_erkek_giyimi_extra()
