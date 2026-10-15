-- ExVitrin: Update all image URLs from Supabase Storage to Cloudflare R2 CDN
-- Run this in your Supabase Dashboard -> SQL Editor

BEGIN;

-- 1. Update listings images array
UPDATE public.listings
SET images = array(
    SELECT replace(img, 'https://wwzeqleaekdugsnknbbl.supabase.co/storage/v1/object/public/listing-images/', 'https://images.exvitrin.com/')
    FROM unnest(images) AS img
)
WHERE images IS NOT NULL
  AND array_to_string(images, ',') LIKE '%supabase.co/storage/v1/object/public/listing-images/%';

-- 2. Update profiles avatar, store_banner and store_logo
UPDATE public.profiles
SET avatar_url = replace(avatar_url, 'https://wwzeqleaekdugsnknbbl.supabase.co/storage/v1/object/public/listing-images/', 'https://images.exvitrin.com/')
WHERE avatar_url LIKE '%supabase.co/storage/v1/object/public/listing-images/%';

UPDATE public.profiles
SET store_banner = replace(store_banner, 'https://wwzeqleaekdugsnknbbl.supabase.co/storage/v1/object/public/listing-images/', 'https://images.exvitrin.com/')
WHERE store_banner LIKE '%supabase.co/storage/v1/object/public/listing-images/%';

UPDATE public.profiles
SET store_logo = replace(store_logo, 'https://wwzeqleaekdugsnknbbl.supabase.co/storage/v1/object/public/listing-images/', 'https://images.exvitrin.com/')
WHERE store_logo LIKE '%supabase.co/storage/v1/object/public/listing-images/%';

COMMIT;

-- Verify updated count:
SELECT COUNT(*) AS total_updated_listings FROM public.listings 
WHERE array_to_string(images, ',') LIKE '%images.exvitrin.com%';
