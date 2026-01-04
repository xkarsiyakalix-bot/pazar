-- SQL migration to add Auf Zeit & WG specific columns to the listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS auf_zeit_wg_art text,
ADD COLUMN IF NOT EXISTS rental_type text,
ADD COLUMN IF NOT EXISTS living_space decimal(10,2),
ADD COLUMN IF NOT EXISTS rooms decimal(5,1),
ADD COLUMN IF NOT EXISTS roommates integer,
ADD COLUMN IF NOT EXISTS available_from date,
ADD COLUMN IF NOT EXISTS online_viewing text,
ADD COLUMN IF NOT EXISTS warm_rent decimal(10,2),
ADD COLUMN IF NOT EXISTS amenities text[],
ADD COLUMN IF NOT EXISTS general_features text[];

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_auf_zeit_wg_art ON listings(auf_zeit_wg_art);
CREATE INDEX IF NOT EXISTS idx_listings_rental_type ON listings(rental_type);

-- Reload Schema Cache
NOTIFY pgrst, 'reload schema';
