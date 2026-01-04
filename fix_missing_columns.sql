-- ULTIMATE migration to add ALL missing category-specific, feature, and alias fields
-- Run this in the Supabase SQL Editor to resolve all "column not found" errors

ALTER TABLE listings 
-- Service & Jobs Categories
ADD COLUMN IF NOT EXISTS altenpflege_art text,
ADD COLUMN IF NOT EXISTS sprachkurse_art text,
ADD COLUMN IF NOT EXISTS kunst_gestaltung_art text,
ADD COLUMN IF NOT EXISTS weiteres_haus_garten_art text,
ADD COLUMN IF NOT EXISTS bau_handwerk_produktion_art text,
ADD COLUMN IF NOT EXISTS buero_arbeit_verwaltung_art text,
ADD COLUMN IF NOT EXISTS gastronomie_tourismus_art text,
ADD COLUMN IF NOT EXISTS kundenservice_call_center_art text,
ADD COLUMN IF NOT EXISTS sozialer_sektor_pflege_art text,
ADD COLUMN IF NOT EXISTS transport_logistik_verkehr_art text,
ADD COLUMN IF NOT EXISTS vertrieb_einkauf_verkauf_art text,
ADD COLUMN IF NOT EXISTS weitere_jobs_art text,
ADD COLUMN IF NOT EXISTS stundenlohn decimal,
ADD COLUMN IF NOT EXISTS hourly_wage decimal,
ADD COLUMN IF NOT EXISTS working_time text,
ADD COLUMN IF NOT EXISTS job_type text,

-- Hobby, Leisure & Music Categories
ADD COLUMN IF NOT EXISTS modellbau_art text,
ADD COLUMN IF NOT EXISTS handarbeit_art text,
ADD COLUMN IF NOT EXISTS kuenstler_musiker_art text,
ADD COLUMN IF NOT EXISTS reise_eventservices_art text,
ADD COLUMN IF NOT EXISTS tierbetreuung_training_art text,
ADD COLUMN IF NOT EXISTS sammeln_art text,
ADD COLUMN IF NOT EXISTS sport_camping_art text,
ADD COLUMN IF NOT EXISTS buecher_zeitschriften_art text,

-- Fashion & Beauty Categories
ADD COLUMN IF NOT EXISTS damenbekleidung_art text,
ADD COLUMN IF NOT EXISTS damenbekleidung_size text,
ADD COLUMN IF NOT EXISTS damenbekleidung_color text,
ADD COLUMN IF NOT EXISTS damenbekleidung_marke text,
ADD COLUMN IF NOT EXISTS damenschuhe_art text,
ADD COLUMN IF NOT EXISTS damenschuhe_size text,
ADD COLUMN IF NOT EXISTS damenschuhe_color text,
ADD COLUMN IF NOT EXISTS damenschuhe_marke text,
ADD COLUMN IF NOT EXISTS herrenbekleidung_art text,
ADD COLUMN IF NOT EXISTS herrenbekleidung_size text,
ADD COLUMN IF NOT EXISTS herrenbekleidung_color text,
ADD COLUMN IF NOT EXISTS herrenbekleidung_marke text,
ADD COLUMN IF NOT EXISTS herrenschuhe_art text,
ADD COLUMN IF NOT EXISTS herrenschuhe_size text,
ADD COLUMN IF NOT EXISTS herrenschuhe_color text,
ADD COLUMN IF NOT EXISTS herrenschuhe_marke text,
ADD COLUMN IF NOT EXISTS beauty_gesundheit_art text,
ADD COLUMN IF NOT EXISTS taschen_accessoires_art text,
ADD COLUMN IF NOT EXISTS uhren_schmuck_art text,

-- Family & Baby Categories
ADD COLUMN IF NOT EXISTS baby_kinderkleidung_art text,
ADD COLUMN IF NOT EXISTS baby_kinderkleidung_size text,
ADD COLUMN IF NOT EXISTS baby_kinderkleidung_gender text,
ADD COLUMN IF NOT EXISTS baby_kinderkleidung_color text,
ADD COLUMN IF NOT EXISTS baby_kinderschuhe_art text,
ADD COLUMN IF NOT EXISTS baby_kinderschuhe_size text,
ADD COLUMN IF NOT EXISTS baby_kinderschuhe_color text,
ADD COLUMN IF NOT EXISTS kinderwagen_buggys_color text,
ADD COLUMN IF NOT EXISTS kinderwagen_buggys_art text,
ADD COLUMN IF NOT EXISTS babyschalen_kindersitze_color text,
ADD COLUMN IF NOT EXISTS kinderzimmermobel_art text,
ADD COLUMN IF NOT EXISTS spielzeug_art text,

-- Pets Categories
ADD COLUMN IF NOT EXISTS fische_art text,
ADD COLUMN IF NOT EXISTS hunde_art text,
ADD COLUMN IF NOT EXISTS hunde_alter text,
ADD COLUMN IF NOT EXISTS hunde_geimpft text,
ADD COLUMN IF NOT EXISTS hunde_erlaubnis text,
ADD COLUMN IF NOT EXISTS katzen_art text,
ADD COLUMN IF NOT EXISTS katzen_alter text,
ADD COLUMN IF NOT EXISTS katzen_geimpft text,
ADD COLUMN IF NOT EXISTS katzen_erlaubnis text,
ADD COLUMN IF NOT EXISTS kleintiere_art text,
ADD COLUMN IF NOT EXISTS nutztiere_art text,
ADD COLUMN IF NOT EXISTS pferde_art text,
ADD COLUMN IF NOT EXISTS voegel_art text,
ADD COLUMN IF NOT EXISTS vermisste_tiere_status text,
ADD COLUMN IF NOT EXISTS haustier_zubehoer_art text,

-- Electronics Categories
ADD COLUMN IF NOT EXISTS audio_hifi_art text,
ADD COLUMN IF NOT EXISTS handy_telefon_art text,
ADD COLUMN IF NOT EXISTS foto_art text,
ADD COLUMN IF NOT EXISTS haushaltsgeraete_art text,
ADD COLUMN IF NOT EXISTS konsolen_art text,
ADD COLUMN IF NOT EXISTS pc_zubehoer_software_art text,
ADD COLUMN IF NOT EXISTS tablets_reader_art text,
ADD COLUMN IF NOT EXISTS tv_video_art text,
ADD COLUMN IF NOT EXISTS notebooks_art text,
ADD COLUMN IF NOT EXISTS pcs_art text,
ADD COLUMN IF NOT EXISTS videospiele_art text,
ADD COLUMN IF NOT EXISTS weitere_elektronik_art text,
ADD COLUMN IF NOT EXISTS dienstleistungen_elektronik_art text,

-- Home & Garden Categories
ADD COLUMN IF NOT EXISTS dekoration_art text,
ADD COLUMN IF NOT EXISTS gartenzubehoer_art text,
ADD COLUMN IF NOT EXISTS kueche_esszimmer_art text,
ADD COLUMN IF NOT EXISTS schlafzimmer_art text,
ADD COLUMN IF NOT EXISTS wohnzimmer_art text,
ADD COLUMN IF NOT EXISTS dienstleistungen_haus_garten_art text,

-- Vehicle & Bike Categories
ADD COLUMN IF NOT EXISTS autoteile_art text,
ADD COLUMN IF NOT EXISTS autoteile_angebotstyp text,
ADD COLUMN IF NOT EXISTS boote_art text,
ADD COLUMN IF NOT EXISTS motorrad_art text,
ADD COLUMN IF NOT EXISTS motorradteile_art text,
ADD COLUMN IF NOT EXISTS nutzfahrzeuge_art text,
ADD COLUMN IF NOT EXISTS wohnwagen_art text,
ADD COLUMN IF NOT EXISTS bike_art text,
ADD COLUMN IF NOT EXISTS bike_type text,
ADD COLUMN IF NOT EXISTS art_type text,
ADD COLUMN IF NOT EXISTS car_brand text,
ADD COLUMN IF NOT EXISTS car_model text,
ADD COLUMN IF NOT EXISTS modell text,
ADD COLUMN IF NOT EXISTS exterior_color text,
ADD COLUMN IF NOT EXISTS interior_material text,
ADD COLUMN IF NOT EXISTS hu text,
ADD COLUMN IF NOT EXISTS emission_badge text,
ADD COLUMN IF NOT EXISTS emission_sticker text,
ADD COLUMN IF NOT EXISTS emission_class text,
ADD COLUMN IF NOT EXISTS schadstoffklasse text,
ADD COLUMN IF NOT EXISTS unfallfrei boolean default false,
ADD COLUMN IF NOT EXISTS scheckheftgepflegt boolean default false,
ADD COLUMN IF NOT EXISTS nichtraucher_fahrzeug boolean default false,
ADD COLUMN IF NOT EXISTS fahrzeugtyp text,
ADD COLUMN IF NOT EXISTS fhz_type text,
ADD COLUMN IF NOT EXISTS vehicle_type text,
ADD COLUMN IF NOT EXISTS door_count text,
ADD COLUMN IF NOT EXISTS fuel_type text,
ADD COLUMN IF NOT EXISTS power integer,
ADD COLUMN IF NOT EXISTS leistung integer,
ADD COLUMN IF NOT EXISTS kraftstoff text,

-- Real Estate Categories
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
ADD COLUMN IF NOT EXISTS area decimal,
ADD COLUMN IF NOT EXISTS price_per_sqm decimal,
ADD COLUMN IF NOT EXISTS living_space decimal,
ADD COLUMN IF NOT EXISTS rooms decimal,
ADD COLUMN IF NOT EXISTS roommates integer,
ADD COLUMN IF NOT EXISTS available_from text,
ADD COLUMN IF NOT EXISTS warm_rent decimal,
ADD COLUMN IF NOT EXISTS online_viewing text,
ADD COLUMN IF NOT EXISTS rental_type text,
ADD COLUMN IF NOT EXISTS angebotsart text,
ADD COLUMN IF NOT EXISTS tauschangebot text,

-- Global/Common Feature Fields
ADD COLUMN IF NOT EXISTS amenities text[],
ADD COLUMN IF NOT EXISTS car_amenities text[],
ADD COLUMN IF NOT EXISTS general_features text[],
ADD COLUMN IF NOT EXISTS apartment_features text[],
ADD COLUMN IF NOT EXISTS house_features text[],

-- Promotion & Status Fields
ADD COLUMN IF NOT EXISTS is_top boolean default false,
ADD COLUMN IF NOT EXISTS is_multi_bump boolean default false,
ADD COLUMN IF NOT EXISTS views integer default 0,
ADD COLUMN IF NOT EXISTS status text default 'active',
ADD COLUMN IF NOT EXISTS reserved_by uuid references auth.users(id),
ADD COLUMN IF NOT EXISTS reserved_until timestamp with time zone,
ADD COLUMN IF NOT EXISTS reservation_count integer default 0,
ADD COLUMN IF NOT EXISTS last_seen timestamp with time zone,
ADD COLUMN IF NOT EXISTS invoice_sent boolean default false,

-- Misc & Common Search Fields
ADD COLUMN IF NOT EXISTS auf_zeit_wg_art text,
ADD COLUMN IF NOT EXISTS versand_art text,
ADD COLUMN IF NOT EXISTS offer_type text,
ADD COLUMN IF NOT EXISTS seller_type text,
ADD COLUMN IF NOT EXISTS price_type text default 'fixed';

-- Create indexes for performance on frequently filtered fields
CREATE INDEX IF NOT EXISTS idx_listings_altenpflege_art ON listings(altenpflege_art);
CREATE INDEX IF NOT EXISTS idx_listings_art_type ON listings(art_type);
CREATE INDEX IF NOT EXISTS idx_listings_bike_type ON listings(bike_type);
CREATE INDEX IF NOT EXISTS idx_listings_autoteile_angebotstyp ON listings(autoteile_angebotstyp);
CREATE INDEX IF NOT EXISTS idx_listings_federal_state ON listings(federal_state);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_sub_category ON listings(sub_category);
CREATE INDEX IF NOT EXISTS idx_listings_amenities ON listings USING gin(amenities);
CREATE INDEX IF NOT EXISTS idx_listings_car_amenities ON listings USING gin(car_amenities);

-- Reload Schema Cache
NOTIFY pgrst, 'reload schema';
