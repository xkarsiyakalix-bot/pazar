-- ============================================================
-- TAM MIGRATION - Tüm eksik sütunları yeni veritabanına ekle
-- wwzeqleaekdugsnknbbl projesinde SQL Editor'de çalıştır
-- ============================================================

-- 1. listings tablosuna TÜM eksik sütunları ekle
ALTER TABLE listings 

-- Hizmetler & İş İlanları
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
ADD COLUMN IF NOT EXISTS buero_verwaltung_art text,
ADD COLUMN IF NOT EXISTS immobilien_makler_art text,
ADD COLUMN IF NOT EXISTS reise_eventservices_art text,
ADD COLUMN IF NOT EXISTS tierbetreuung_training_art text,
ADD COLUMN IF NOT EXISTS kuenstler_musiker_art text,
ADD COLUMN IF NOT EXISTS dienstleistungen_haus_garten_art text,
ADD COLUMN IF NOT EXISTS dienstleistungen_elektronik_art text,
ADD COLUMN IF NOT EXISTS bau_handwerk_art text,

-- Hobi, Eğlence & Müzik
ADD COLUMN IF NOT EXISTS modellbau_art text,
ADD COLUMN IF NOT EXISTS handarbeit_art text,
ADD COLUMN IF NOT EXISTS sammeln_art text,
ADD COLUMN IF NOT EXISTS sport_camping_art text,
ADD COLUMN IF NOT EXISTS buecher_zeitschriften_art text,
ADD COLUMN IF NOT EXISTS foto_art text,
ADD COLUMN IF NOT EXISTS lamba_aydinlatma_art text,

-- Moda & Güzellik
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

-- Aile & Bebek
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

-- Evcil Hayvanlar
ADD COLUMN IF NOT EXISTS fische_art text,
ADD COLUMN IF NOT EXISTS hunde_art text,
ADD COLUMN IF NOT EXISTS hunde_age text,
ADD COLUMN IF NOT EXISTS hunde_alter text,
ADD COLUMN IF NOT EXISTS hunde_geimpft text,
ADD COLUMN IF NOT EXISTS hunde_erlaubnis text,
ADD COLUMN IF NOT EXISTS katzen_art text,
ADD COLUMN IF NOT EXISTS katzen_age text,
ADD COLUMN IF NOT EXISTS katzen_alter text,
ADD COLUMN IF NOT EXISTS katzen_geimpft text,
ADD COLUMN IF NOT EXISTS katzen_erlaubnis text,
ADD COLUMN IF NOT EXISTS kleintiere_art text,
ADD COLUMN IF NOT EXISTS nutztiere_art text,
ADD COLUMN IF NOT EXISTS pferde_art text,
ADD COLUMN IF NOT EXISTS voegel_art text,
ADD COLUMN IF NOT EXISTS vermisste_tiere_status text,
ADD COLUMN IF NOT EXISTS vermisstetiere_status text,
ADD COLUMN IF NOT EXISTS haustier_zubehoer_art text,

-- Elektronik
ADD COLUMN IF NOT EXISTS audio_hifi_art text,
ADD COLUMN IF NOT EXISTS handy_telefon_art text,
ADD COLUMN IF NOT EXISTS haushaltsgeraete_art text,
ADD COLUMN IF NOT EXISTS konsolen_art text,
ADD COLUMN IF NOT EXISTS pc_zubehoer_software_art text,
ADD COLUMN IF NOT EXISTS tablets_reader_art text,
ADD COLUMN IF NOT EXISTS tv_video_art text,
ADD COLUMN IF NOT EXISTS notebooks_art text,
ADD COLUMN IF NOT EXISTS pcs_art text,
ADD COLUMN IF NOT EXISTS videospiele_art text,
ADD COLUMN IF NOT EXISTS weitere_elektronik_art text,

-- Ev & Bahçe
ADD COLUMN IF NOT EXISTS dekoration_art text,
ADD COLUMN IF NOT EXISTS gartenzubehoer_art text,
ADD COLUMN IF NOT EXISTS kueche_esszimmer_art text,
ADD COLUMN IF NOT EXISTS schlafzimmer_art text,
ADD COLUMN IF NOT EXISTS wohnzimmer_art text,
ADD COLUMN IF NOT EXISTS weiteres_haus_garten_art text,

-- Araç & Bisiklet
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
ADD COLUMN IF NOT EXISTS hubraum integer,
ADD COLUMN IF NOT EXISTS erstzulassung integer,
ADD COLUMN IF NOT EXISTS kilometerstand integer,
ADD COLUMN IF NOT EXISTS getriebe text,
ADD COLUMN IF NOT EXISTS marke text,

-- Emlak
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
ADD COLUMN IF NOT EXISTS auf_zeit_wg_art text,

-- Ortak/Global Alanlar
ADD COLUMN IF NOT EXISTS amenities text[],
ADD COLUMN IF NOT EXISTS car_amenities text[],
ADD COLUMN IF NOT EXISTS general_features text[],
ADD COLUMN IF NOT EXISTS apartment_features text[],
ADD COLUMN IF NOT EXISTS house_features text[],
ADD COLUMN IF NOT EXISTS is_top boolean default false,
ADD COLUMN IF NOT EXISTS is_gallery boolean default false,
ADD COLUMN IF NOT EXISTS is_highlighted boolean default false,
ADD COLUMN IF NOT EXISTS is_multi_bump boolean default false,
ADD COLUMN IF NOT EXISTS views integer default 0,
ADD COLUMN IF NOT EXISTS reserved_by uuid references auth.users(id),
ADD COLUMN IF NOT EXISTS reserved_until timestamp with time zone,
ADD COLUMN IF NOT EXISTS reservation_count integer default 0,
ADD COLUMN IF NOT EXISTS last_seen timestamp with time zone,
ADD COLUMN IF NOT EXISTS invoice_sent boolean default false,
ADD COLUMN IF NOT EXISTS versand_art text,
ADD COLUMN IF NOT EXISTS offer_type text,
ADD COLUMN IF NOT EXISTS seller_type text,
ADD COLUMN IF NOT EXISTS price_type text default 'fixed',
ADD COLUMN IF NOT EXISTS contact_name text,
ADD COLUMN IF NOT EXISTS contact_phone text,
ADD COLUMN IF NOT EXISTS show_phone_number boolean default true,
ADD COLUMN IF NOT EXISTS show_location boolean default true,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS district text,
ADD COLUMN IF NOT EXISTS region text,
ADD COLUMN IF NOT EXISTS federal_state text,
ADD COLUMN IF NOT EXISTS slug text,
ADD COLUMN IF NOT EXISTS listing_number bigint,
ADD COLUMN IF NOT EXISTS package_type text,
ADD COLUMN IF NOT EXISTS promotion_expiry timestamp with time zone,
ADD COLUMN IF NOT EXISTS expiry_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS auto_hidden boolean default false,
ADD COLUMN IF NOT EXISTS is_spam boolean default false,
ADD COLUMN IF NOT EXISTS spam_score integer default 0,
ADD COLUMN IF NOT EXISTS spam_flags text[],
ADD COLUMN IF NOT EXISTS spam_checked_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS reviewed_by_admin boolean default false,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone default now();

-- 2. site_settings tablosunu oluştur
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  search_bg_color TEXT DEFAULT '#2ca2dd',
  site_name TEXT DEFAULT 'ExVitrin',
  site_description TEXT DEFAULT 'Türkiye''nin en büyük ilan pazaryeri.',
  contact_email TEXT DEFAULT 'kerem_aydin@aol.com',
  contact_phone TEXT DEFAULT '+90 212 123 45 67',
  maintenance_mode BOOLEAN DEFAULT false,
  allow_registration BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.site_settings (id, search_bg_color)
VALUES (1, '#2ca2dd')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin update site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin insert site_settings" ON public.site_settings;

CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin update site_settings" ON public.site_settings FOR UPDATE USING (true);
CREATE POLICY "Admin insert site_settings" ON public.site_settings FOR INSERT WITH CHECK (true);

-- 3. İndexler
CREATE INDEX IF NOT EXISTS idx_listings_altenpflege_art ON listings(altenpflege_art);
CREATE INDEX IF NOT EXISTS idx_listings_art_type ON listings(art_type);
CREATE INDEX IF NOT EXISTS idx_listings_bike_type ON listings(bike_type);
CREATE INDEX IF NOT EXISTS idx_listings_federal_state ON listings(federal_state);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_sub_category ON listings(sub_category);

-- 4. Şema önbelleğini yenile
NOTIFY pgrst, 'reload schema';
