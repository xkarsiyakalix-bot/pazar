
import os
from supabase import create_client, Client

url = 'https://ynleaatvkftkafiyqufv.supabase.co'
key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubGVhYXR2a2Z0a2FmaXlxdWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MzA4ODIsImV4cCI6MjA4MDMwNjg4Mn0.Ym945vCX_d2eL1-RlE4xXVwo4uGrxWUZeJgyOiHgVEA'

supabase: Client = create_client(url, key)

def get_data():
    # Fetch categories
    res_cat = supabase.table('categories').select('*').order('display_order').execute()
    categories = res_cat.data

    # Fetch subcategories
    res_sub = supabase.table('subcategories').select('*').order('display_order').execute()
    subs = res_sub.data

    print("-- CATEGORIES AND SUBCATEGORIES SEED DATA (FIXED UUID)")
    
    # Table definitions
    print("\n-- 1. Create Tables if not exist")
    print("""
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, slug)
);
""")

    print("\n-- 2. Clean existing data (optional)")
    print("TRUNCATE subcategories CASCADE;")
    print("TRUNCATE categories CASCADE;")

    print("\n-- 3. Insert Categories")
    for cat in categories:
        icon = f"'{cat['icon']}'" if cat['icon'] else "NULL"
        print(f"INSERT INTO categories (id, name, slug, icon, display_order) VALUES ('{cat['id']}', '{cat['name']}', '{cat['slug']}', {icon}, {cat['display_order']}) ON CONFLICT (id) DO NOTHING;")

    print("\n-- 4. Insert Subcategories")
    for sub in subs:
        print(f"INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('{sub['id']}', '{sub['category_id']}', '{sub['name']}', '{sub['slug']}', {sub['display_order']}) ON CONFLICT (id) DO NOTHING;")

    print("\n-- 5. Enable RLS and add public policy")
    print("""
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON categories;
CREATE POLICY "Public categories are viewable by everyone" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public subcategories are viewable by everyone" ON subcategories;
CREATE POLICY "Public subcategories are viewable by everyone" ON subcategories FOR SELECT USING (true);
""")

if __name__ == "__main__":
    get_data()
