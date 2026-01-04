
import collections
from supabase import create_client, Client

# Configuration
URL = "https://akyxtjqgvrzzbfogsdnd.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreXh0anFndnJ6emJmb2dzZG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NzAxNDcsImV4cCI6MjA4MjE0NjE0N30.vcSCQVRNsgW0Jw_dMT7kWucBgYa9qTDGQTqI7jTa-Tw"

supabase: Client = create_client(URL, KEY)

def fix_erkek_giyimi_data():
    print("Fetching 'Erkek Giyimi' and 'Herrenbekleidung' listings...")
    
    try:
        response = supabase.table("listings") \
            .select("*") \
            .in_("sub_category", ["Erkek Giyimi", "Herrenbekleidung"]) \
            .execute()
        
        listings = response.data
        print(f"Total listings found: {len(listings)}")
        
        updates_count = 0
        
        for l in listings:
            updated_fields = {}
            
            # Condition mapping
            cond = l.get('condition')
            if cond == 'neu': updated_fields['condition'] = 'Yeni'
            elif cond == 'neu_mit_etikett': updated_fields['condition'] = 'Yeni & Etiketli'
            elif cond == 'sehr_gut': updated_fields['condition'] = 'Çok İyi'
            elif cond == 'gut': updated_fields['condition'] = 'İyi'
            elif cond == 'in_ordnung': updated_fields['condition'] = 'Makul'
            elif cond == 'gebraucht' or cond == 'used': updated_fields['condition'] = 'İkinci El'
            elif cond == 'defekt': updated_fields['condition'] = 'Kusurlu'
            
            # Versand mapping
            versand = l.get('versand_art')
            if versand == 'Versand möglich': updated_fields['versand_art'] = 'Kargo Mümkün'
            elif versand == 'Nur Abholung': updated_fields['versand_art'] = 'Sadece Elden Teslim'
            
            # Offer type mapping
            offer = l.get('offer_type')
            if offer == 'Angebote': updated_fields['offer_type'] = 'Satılık'
            elif offer == 'Gesuche': updated_fields['offer_type'] = 'Aranıyor'
            
            # Seller type mapping
            seller = l.get('seller_type')
            if seller == 'Privatnutzer' or seller == 'Privat': updated_fields['seller_type'] = 'Bireysel'
            elif seller == 'Gewerblich': updated_fields['seller_type'] = 'Kurumsal'
            
            # Color mapping
            color = l.get('herrenbekleidung_color')
            color_map = {
                'Beige': 'Bej', 'Blau': 'Mavi', 'Braun': 'Kahverengi',
                'Bunt': 'Renkli', 'Creme': 'Krem', 'Gelb': 'Sarı',
                'Gold': 'Altın', 'Grau': 'Gri', 'Grün': 'Yeşil',
                'Khaki': 'Haki', 'Lavendel': 'Lavanta', 'Lila': 'Mor',
                'Orange': 'Turuncu', 'Pink': 'Pembe', 'Print': 'Desenli',
                'Rot': 'Kırmızı', 'Schwarz': 'Siyah', 'Silber': 'Gümüş',
                'Türkis': 'Turkuaz', 'Weiß': 'Beyaz', 'Andere Farben': 'Diğer Renkler'
            }
            if color in color_map:
                updated_fields['herrenbekleidung_color'] = color_map[color]
            
            if updated_fields:
                print(f"Updating listing {l.get('id')}: {updated_fields}")
                try:
                    response = supabase.table("listings").update(updated_fields).eq("id", l.get("id")).execute()
                    print(f"Update response: {response}")
                except Exception as e:
                    print(f"Update failed with error: {e}")
                updates_count += 1

        print(f"Total listings updated: {updates_count}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_erkek_giyimi_data()
