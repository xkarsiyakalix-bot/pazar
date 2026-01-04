
import os
from supabase import create_client, Client

url = 'https://ynleaatvkftkafiyqufv.supabase.co'
key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubGVhYXR2a2Z0a2FmaXlxdWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MzA4ODIsImV4cCI6MjA4MDMwNjg4Mn0.Ym945vCX_d2eL1-RlE4xXVwo4uGrxWUZeJgyOiHgVEA'

supabase: Client = create_client(url, key)

def export_data():
    print("-- CATEGORIES AND SUBCATEGORIES SEED DATA")
    
    # Export categories
    res = supabase.table('categories').select('*').order('display_order').execute()
    categories = res.data
    
    print("\n-- Categories")
    for cat in categories:
        # Use placeholders for potentially NULL values
        icon = f"'{cat['icon']}'" if cat['icon'] else "NULL"
        display_order = cat.get('display_order', 0)
        print(f"INSERT INTO categories (id, name, slug, icon, display_order) VALUES ({cat['id']}, '{cat['name']}', '{cat['slug']}', {icon}, {display_order}) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, icon = EXCLUDED.icon, display_order = EXCLUDED.display_order;")

    # Export subcategories
    res = supabase.table('subcategories').select('*').order('display_order').execute()
    subs = res.data
    
    print("\n-- Subcategories")
    for sub in subs:
        display_order = sub.get('display_order', 0)
        print(f"INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ({sub['id']}, {sub['category_id']}, '{sub['name']}', '{sub['slug']}', {display_order}) ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, display_order = EXCLUDED.display_order;")

if __name__ == "__main__":
    export_data()
