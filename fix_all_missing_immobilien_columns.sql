-- Comprehensive SQL migration to add ALL Immobilien-specific columns to the listings table
-- RUN THIS IN YOUR SUPABASE SQL EDITOR TO FIX "Could not find column" ERRORS

ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS auf_zeit_wg_art text,
ADD COLUMN IF NOT EXISTS rental_type text,
ADD COLUMN IF NOT EXISTS living_space decimal,
ADD COLUMN IF NOT EXISTS rooms decimal,
ADD COLUMN IF NOT EXISTS roommates integer,
ADD COLUMN IF NOT EXISTS available_from text, -- Changed to text to support YYYY-MM and YYYY-MM-DD flexibly
ADD COLUMN IF NOT EXISTS online_viewing text,
ADD COLUMN IF NOT EXISTS warm_rent decimal,
ADD COLUMN IF NOT EXISTS amenities text[],
ADD COLUMN IF NOT EXISTS general_features text[],
ADD COLUMN IF NOT EXISTS wohnungstyp text,
ADD COLUMN IF NOT EXISTS haustyp text,
ADD COLUMN IF NOT EXISTS grundstuecksart text,
ADD COLUMN IF NOT EXISTS objektart text,
ADD COLUMN IF NOT EXISTS garage_type text,
ADD COLUMN IF NOT EXISTS floor integer,
ADD COLUMN IF NOT EXISTS construction_year integer,
ADD COLUMN IF NOT EXISTS plot_area decimal,
ADD COLUMN IF NOT EXISTS commission text,
ADD COLUMN IF NOT EXISTS lage text,
ADD COLUMN IF NOT EXISTS price_per_sqm decimal,
ADD COLUMN IF NOT EXISTS apartment_features text[],
ADD COLUMN IF NOT EXISTS house_features text[],
ADD COLUMN IF NOT EXISTS angebotsart text,
ADD COLUMN IF NOT EXISTS tauschangebot text;

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_listings_immobilien_common ON listings(category, sub_category);
CREATE INDEX IF NOT EXISTS idx_listings_auf_zeit_wg_art ON listings(auf_zeit_wg_art);
CREATE INDEX IF NOT EXISTS idx_listings_wohnungstyp ON listings(wohnungstyp);
CREATE INDEX IF NOT EXISTS idx_listings_haustyp ON listings(haustyp);

-- FORCE SCHEMA RELOAD (Crucial for Supabase to see new columns immediately)
NOTIFY pgrst, 'reload schema';
