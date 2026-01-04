import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL:
    print("SUPABASE_URL not found in env")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

CATEGORY = "Aile, Çocuk & Bebek"
SUBCATEGORY = "Bebek & Çocuk Giyimi"

print(f"Checking columns for {CATEGORY} > {SUBCATEGORY}...")

columns = [
    "baby_kinderkleidung_art",
    "baby_kinderkleidung_size",
    "baby_kinderkleidung_gender",
    "baby_kinderkleidung_color",
    "condition",
    "offer_type",
    "seller_type",
    "address" # to check federal state issues if any, usually city or federal_state column
]

# Fetch data
response = supabase.table("listings").select("*").eq("category", CATEGORY).eq("sub_category", SUBCATEGORY).execute()

data = response.data
print(f"Found {len(data)} listings.")

def count_values(key):
    counts = {}
    for item in data:
        val = item.get(key)
        # Normalize
        if isinstance(val, list):
             for v in val:
                 counts[str(v)] = counts.get(str(v), 0) + 1
        else:
             counts[str(val)] = counts.get(str(val), 0) + 1
    return counts

# Check Art
print("\n--- Art ---")
for k, v in count_values("baby_kinderkleidung_art").items():
    print(f"'{k}': {v}")

# Check Size
print("\n--- Size ---")
for k, v in count_values("baby_kinderkleidung_size").items():
    print(f"'{k}': {v}")

# Check Gender
print("\n--- Gender ---")
for k, v in count_values("baby_kinderkleidung_gender").items():
    print(f"'{k}': {v}")

# Check Color
print("\n--- Color ---")
for k, v in count_values("baby_kinderkleidung_color").items():
    print(f"'{k}': {v}")

# Check Condition
print("\n--- Condition ---")
for k, v in count_values("condition").items():
    print(f"'{k}': {v}")

# Check Seller Type
print("\n--- Seller Type ---")
for k, v in count_values("seller_type").items():
    print(f"'{k}': {v}")
