-- Migration to add slug column and populate it with SEO-friendly titles
ALTER TABLE listings ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS listings_slug_idx ON listings (slug);

-- Function to generate slugs (internal use for this migration)
DO $$
DECLARE
    rec RECORD;
    new_slug TEXT;
BEGIN
    FOR rec IN SELECT id, title FROM listings WHERE slug IS NULL OR slug = id::text LOOP
        -- Start with the title
        new_slug := lower(rec.title);
        
        -- Turkish character normalization
        new_slug := replace(new_slug, 'ç', 'c');
        new_slug := replace(new_slug, 'ğ', 'g');
        new_slug := replace(new_slug, 'ı', 'i');
        new_slug := replace(new_slug, 'ö', 'o');
        new_slug := replace(new_slug, 'ş', 's');
        new_slug := replace(new_slug, 'ü', 'u');
        
        -- Replace non-alphanumeric with hyphen
        new_slug := regexp_replace(new_slug, '[^a-z0-9]+', '-', 'g');
        
        -- Trim hyphens
        new_slug := trim(both '-' from new_slug);
        
        -- If resulting slug is empty, use ID
        IF new_slug = '' OR new_slug IS NULL THEN
            new_slug := rec.id::text;
        ELSE
            -- Append first 5 chars of ID to ensure uniqueness while keeping it clean
            new_slug := new_slug || '-' || left(rec.id::text, 5);
        END IF;

        UPDATE listings SET slug = new_slug WHERE id = rec.id;
    END LOOP;
END $$;

-- Make slug unique after population to ensure SEO structure
-- ALTER TABLE listings ADD CONSTRAINT listings_slug_unique UNIQUE (slug);
