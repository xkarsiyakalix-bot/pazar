-- Create "Mahalle Yardımı" as a standalone main category
-- This script will:
-- 1. Create a new main category for "Mahalle Yardımı"
-- 2. Move the existing subcategory from "Eğlence, Hobi & Mahalle" to the new category
-- 3. Update existing listings to use the new category structure

-- Step 1: Create new main category "Mahalle Yardımı"
INSERT INTO categories (id, name, slug, icon, display_order)
VALUES (
  gen_random_uuid(),
  'Mahalle Yardımı',
  'Mahalle-Yardimi',
  '🤝',
  13
)
ON CONFLICT (slug) DO NOTHING;

-- Step 2: Get the ID of the new category and the old "Eğlence, Hobi & Mahalle" category
DO $$
DECLARE
  new_category_id UUID;
  old_category_id UUID;
  old_subcategory_id UUID;
BEGIN
  -- Get the new "Mahalle Yardımı" category ID
  SELECT id INTO new_category_id FROM categories WHERE slug = 'Mahalle-Yardimi';
  
  -- Get the old "Eğlence, Hobi & Mahalle" category ID
  SELECT id INTO old_category_id FROM categories WHERE slug = 'Freizeit-Hobby-Nachbarschaft';
  
  -- Get the "Mahalle Yardımı" subcategory ID from "Eğlence, Hobi & Mahalle"
  SELECT id INTO old_subcategory_id FROM subcategories 
  WHERE category_id = old_category_id AND name = 'Mahalle Yardımı';
  
  -- Step 3: Create new subcategory under the new main category
  IF new_category_id IS NOT NULL THEN
    INSERT INTO subcategories (id, category_id, name, slug, display_order)
    VALUES (
      COALESCE(old_subcategory_id, gen_random_uuid()),
      new_category_id,
      'Mahalle Yardımı',
      'Mahalle-Yardimi',
      1
    )
    ON CONFLICT (id) DO UPDATE SET
      category_id = new_category_id,
      name = 'Mahalle Yardımı',
      slug = 'Mahalle-Yardimi';
  END IF;
  
  -- Step 4: Update existing listings
  IF new_category_id IS NOT NULL THEN
    UPDATE listings
    SET 
      category = 'Mahalle Yardımı',
      sub_category = 'Mahalle Yardımı'
    WHERE category = 'Eğlence, Hobi & Mahalle' 
      AND sub_category = 'Mahalle Yardımı';
  END IF;
  
  -- Step 5: Delete old subcategory from "Eğlence, Hobi & Mahalle" if it exists
  IF old_subcategory_id IS NOT NULL AND old_category_id IS NOT NULL THEN
    DELETE FROM subcategories 
    WHERE id = old_subcategory_id AND category_id = old_category_id;
  END IF;
  
END $$;

-- Verify the changes
SELECT 'Main Category Created:' as status, name, slug FROM categories WHERE slug = 'Mahalle-Yardimi';
SELECT 'Subcategory:' as status, s.name, s.slug, c.name as parent_category 
FROM subcategories s 
JOIN categories c ON s.category_id = c.id 
WHERE c.slug = 'Mahalle-Yardimi';
SELECT 'Listings Updated:' as status, COUNT(*) as count 
FROM listings 
WHERE category = 'Mahalle Yardımı';
