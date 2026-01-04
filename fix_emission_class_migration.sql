-- Final check and addition of missing columns for vehicles
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS emission_class text,
ADD COLUMN IF NOT EXISTS emission_sticker text,
ADD COLUMN IF NOT EXISTS marke text,
ADD COLUMN IF NOT EXISTS modell text,
ADD COLUMN IF NOT EXISTS kilometerstand integer,
ADD COLUMN IF NOT EXISTS hubraum integer,
ADD COLUMN IF NOT EXISTS power integer,
ADD COLUMN IF NOT EXISTS fuel_type text,
ADD COLUMN IF NOT EXISTS getriebe text,
ADD COLUMN IF NOT EXISTS vehicle_type text,
ADD COLUMN IF NOT EXISTS door_count text,
ADD COLUMN IF NOT EXISTS interior_material text,
ADD COLUMN IF NOT EXISTS exterior_color text,
ADD COLUMN IF NOT EXISTS hu text,
ADD COLUMN IF NOT EXISTS unfallfrei boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS scheckheftgepflegt boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS nichtraucher_fahrzeug boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS motorrad_art text,
ADD COLUMN IF NOT EXISTS wohnwagen_art text,
ADD COLUMN IF NOT EXISTS car_amenities text[];

-- Ensure PostgREST reloads the schema cache
NOTIFY pgrst, 'reload schema';
