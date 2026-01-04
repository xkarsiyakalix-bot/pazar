-- Consolidated migration for all vehicle/car/motorcycle/caravan columns
-- Standardizing on names used in filtering pages (AutosPage.js, MotorradPage.js)

ALTER TABLE listings 
-- Basic Vehicle Stats
ADD COLUMN IF NOT EXISTS marke text,
ADD COLUMN IF NOT EXISTS modell text,
ADD COLUMN IF NOT EXISTS kilometerstand integer,
ADD COLUMN IF NOT EXISTS hubraum integer,
ADD COLUMN IF NOT EXISTS power integer,
ADD COLUMN IF NOT EXISTS fuel_type text,
ADD COLUMN IF NOT EXISTS getriebe text,

-- Detailed Vehicle Specs
ADD COLUMN IF NOT EXISTS vehicle_type text,
ADD COLUMN IF NOT EXISTS door_count text,
ADD COLUMN IF NOT EXISTS emission_sticker text,
ADD COLUMN IF NOT EXISTS emission_class text,
ADD COLUMN IF NOT EXISTS interior_material text,
ADD COLUMN IF NOT EXISTS exterior_color text,
ADD COLUMN IF NOT EXISTS hu text,

-- Status/Condition Flags
ADD COLUMN IF NOT EXISTS unfallfrei boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS scheckheftgepflegt boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS nichtraucher_fahrzeug boolean DEFAULT false,

-- Specific Category Art fields
ADD COLUMN IF NOT EXISTS motorrad_art text,
ADD COLUMN IF NOT EXISTS wohnwagen_art text,

-- Amenities
ADD COLUMN IF NOT EXISTS car_amenities text[];

-- Ensure erstzulassung is TEXT to handle "MM/YYYY" or "YYYY"
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='erstzulassung') THEN
        ALTER TABLE listings ALTER COLUMN erstzulassung TYPE text;
    ELSE
        ALTER TABLE listings ADD COLUMN erstzulassung text;
    END IF;
END $$;

-- Create/Update Indexes
CREATE INDEX IF NOT EXISTS idx_listings_marke ON listings(marke);
CREATE INDEX IF NOT EXISTS idx_listings_modell ON listings(modell);
CREATE INDEX IF NOT EXISTS idx_listings_kilometerstand ON listings(kilometerstand);
CREATE INDEX IF NOT EXISTS idx_listings_fuel_type ON listings(fuel_type);
CREATE INDEX IF NOT EXISTS idx_listings_vehicle_type ON listings(vehicle_type);

-- Reload Schema Cache
NOTIFY pgrst, 'reload schema';
