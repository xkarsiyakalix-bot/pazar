-- Migration to add car-specific columns for detailed vehicle listings
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS fahrzeugtyp text,
ADD COLUMN IF NOT EXISTS door_count text,
ADD COLUMN IF NOT EXISTS emission_badge text,
ADD COLUMN IF NOT EXISTS schadstoffklasse text,
ADD COLUMN IF NOT EXISTS hu text,
ADD COLUMN IF NOT EXISTS exterior_color text,
ADD COLUMN IF NOT EXISTS interior_material text,
ADD COLUMN IF NOT EXISTS unfallfrei boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS scheckheftgepflegt boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS nichtraucher_fahrzeug boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS car_amenities text[],
ADD COLUMN IF NOT EXISTS modell text;

-- Index for searching/filtering
CREATE INDEX IF NOT EXISTS idx_listings_car_brand ON listings(car_brand);
CREATE INDEX IF NOT EXISTS idx_listings_car_model ON listings(car_model);
CREATE INDEX IF NOT EXISTS idx_listings_fahrzeugtyp ON listings(fahrzeugtyp);

-- Reload Schema Cache
NOTIFY pgrst, 'reload schema';
