from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path='app/backend/.env')

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL or SUPABASE_KEY not found in .env")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Updates map: 'Old German Value': 'New Turkish Value'
updates = {
    'Betten & Wiegen': 'Yatak & Beşik',
    'Hochstühle & Laufställe': 'Mama Sandalyesi & Oyun Parkı',
    'Schränke & Kommoden': 'Dolap & Şifonyer',
    'Wickeltische & Zubehör': 'Alt Değiştirme Masası & Aksesuar',
    'Wippen & Schaukeln': 'Ana Kucağı & Salıncak',
    'Weitere Kinderzimmermöbel': 'Diğer Çocuk Odası Mobilyaları'
}

for old, new in updates.items():
    print(f"Updating '{old}' to '{new}'...")
    try:
        response = supabase.table("listings").update({"kinderzimmermobel_art": new}).eq("kinderzimmermobel_art", old).execute()
        # print(response) # Minimal output
    except Exception as e:
        print(f"Error updating {old}: {e}")

print("Update complete via client.")
