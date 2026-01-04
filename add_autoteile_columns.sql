-- Add missing columns for Autoteile & Reifen
-- Run this in your Supabase SQL Editor

ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS autoteile_art text,
ADD COLUMN IF NOT EXISTS autoteile_angebotstyp text,
ADD COLUMN IF NOT EXISTS versand_art text;

-- Refresh the schema cache (Supabase specific, standard is notifying postgrest)
NOTIFY pgrst, 'reload config';
