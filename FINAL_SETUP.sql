-- Kleinanzeigen / LokalPazar Consolidated Database Schema
-- Execute this in Supabase SQL Editor

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean up existing tables (Optional but recommended for schema reset)
-- WARNING: This will delete all data in these tables!
DROP TABLE IF EXISTS seller_ratings CASCADE;
DROP TABLE IF EXISTS seller_badges CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS subcategories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 3. Create Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  street TEXT,
  postal_code TEXT,
  city TEXT,
  legal_info TEXT,
  seller_type TEXT, -- Private or Commercial
  status TEXT DEFAULT 'active',
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  communication_avg DECIMAL(3,2) DEFAULT 0,
  description_avg DECIMAL(3,2) DEFAULT 0,
  delivery_avg DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Categories & Subcategories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

-- 4. Create Listings Table with all custom fields
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  category TEXT NOT NULL,
  sub_category TEXT,
  city TEXT,
  postal_code TEXT,
  address TEXT,
  federal_state TEXT,
  condition TEXT,
  images TEXT[], 
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'deleted')),
  views INTEGER DEFAULT 0,
  seller_type TEXT,
  offer_type TEXT,
  price_type TEXT DEFAULT 'fixed',
  is_top BOOLEAN DEFAULT false,
  -- Real Estate
  floor INTEGER,
  construction_year INTEGER,
  plot_area DECIMAL,
  commission TEXT,
  wohnungstyp TEXT,
  haustyp TEXT,
  grundstuecksart TEXT,
  objektart TEXT,
  garage_type TEXT,
  area DECIMAL,
  price_per_sqm DECIMAL,
  lage TEXT,
  apartment_features TEXT[],
  house_features TEXT[],
  -- Vehicles
  angebotsart TEXT,
  kraftstoff TEXT,
  leistung INTEGER,
  marke TEXT,
  kilometerstand INTEGER,
  erstzulassung INTEGER,
  hubraum INTEGER,
  getriebe TEXT,
  -- Art fields for various categories
  schlafzimmer_art TEXT,
  wohnzimmer_art TEXT,
  wohnwagen_art TEXT,
  modellbau_art TEXT,
  handarbeit_art TEXT,
  kuenstler_musiker_art TEXT,
  reise_eventservices_art TEXT,
  tierbetreuung_training_art TEXT,
  dienstleistungen_haus_garten_art TEXT,
  buecher_zeitschriften_art TEXT,
  sammeln_art TEXT,
  sport_camping_art TEXT,
  dekoration_art TEXT,
  bau_handwerk_produktion_art TEXT,
  beauty_gesundheit_art TEXT,
  audio_hifi_art TEXT,
  handy_telefon_art TEXT,
  foto_art TEXT,
  haushaltsgeraete_art TEXT,
  konsolen_art TEXT,
  pc_zubehoer_software_art TEXT,
  tablets_reader_art TEXT,
  tv_video_art TEXT,
  notebooks_art TEXT,
  pcs_art TEXT,
  videospiele_art TEXT,
  dienstleistungen_elektronik_art TEXT,
  sozialer_sektor_pflege_art TEXT,
  bau_handwerk_art TEXT,
  buero_verwaltung_art TEXT,
  gastronomie_tourismus_art TEXT,
  transport_logistik_verkehr_art TEXT,
  immobilien_makler_art TEXT,
  vertrieb_einkauf_verkauf_art TEXT,
  weitere_jobs_art TEXT,
  -- Jobs
  stundenlohn DECIMAL,
  hourly_wage DECIMAL, -- Adding for backend compatibility
  working_time TEXT,
  -- Reservations
  reserved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reserved_until TIMESTAMP WITH TIME ZONE,
  reservation_count INTEGER DEFAULT 0,
  -- Fashion & Kids
  baby_kinderkleidung_art TEXT,
  baby_kinderkleidung_size TEXT,
  baby_kinderkleidung_gender TEXT,
  baby_kinderkleidung_color TEXT,
  baby_kinderschuhe_art TEXT,
  baby_kinderschuhe_size TEXT,
  kinderwagen_buggys_art TEXT,
  kinderwagen_buggys_color TEXT,
  babyschalen_kindersitze_color TEXT,
  kinderzimmermobel_art TEXT,
  spielzeug_art TEXT,
  -- Pets
  fische_art TEXT,
  hunde_art TEXT,
  hunde_age TEXT,
  hunde_geimpft TEXT,
  hunde_erlaubnis TEXT,
  katzen_art TEXT,
  katzen_age TEXT,
  katzen_geimpft TEXT,
  katzen_erlaubnis TEXT,
  kleintiere_art TEXT,
  nutztiere_art TEXT,
  pferde_art TEXT,
  vermisstetiere_status TEXT,
  voegel_art TEXT,
  haustier_zubehoer_art TEXT,
  -- Others
  taschen_accessoires_art TEXT,
  uhren_schmuck_art TEXT,
  kueche_esszimmer_art TEXT,
  gartenzubehoer_art TEXT,
  versand_art TEXT,
  last_seen TIMESTAMP WITH TIME ZONE,
  invoice_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Additional Tables
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES listings ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES listings ON DELETE SET NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    package_type TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'expired')),
  seller_confirmed BOOLEAN DEFAULT false,
  buyer_confirmed BOOLEAN DEFAULT false,
  seller_confirmed_at TIMESTAMP,
  buyer_confirmed_at TIMESTAMP,
  seller_rated BOOLEAN DEFAULT false,
  buyer_rated BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 days',
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(listing_id, seller_id, buyer_id)
);

CREATE TABLE IF NOT EXISTS seller_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  description_rating INTEGER CHECK (description_rating >= 1 AND description_rating <= 5),
  delivery_rating INTEGER CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(transaction_id, buyer_id)
);

CREATE TABLE IF NOT EXISTS seller_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type VARCHAR(50) NOT NULL,
  earned_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, badge_type)
);

CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'expired')),
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing_id ON favorites(listing_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_promotions_listing_id ON promotions(listing_id);
CREATE INDEX IF NOT EXISTS idx_promotions_user_id ON promotions(user_id);
CREATE INDEX IF NOT EXISTS idx_promotions_status ON promotions(status);
CREATE INDEX IF NOT EXISTS idx_promotions_created_at ON promotions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_seller ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_listing ON transactions(listing_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_seller_ratings_seller ON seller_ratings(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_ratings_buyer ON seller_ratings(buyer_id);
CREATE INDEX IF NOT EXISTS idx_seller_ratings_created ON seller_ratings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seller_badges_user ON seller_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_seller_badges_type ON seller_badges(badge_type);
CREATE INDEX IF NOT EXISTS idx_reservations_listing_id ON reservations(listing_id);
CREATE INDEX IF NOT EXISTS idx_reservations_buyer_id ON reservations(buyer_id);
CREATE INDEX IF NOT EXISTS idx_reservations_seller_id ON reservations(seller_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_expiry_date ON reservations(expiry_date);

-- 7. RLS Enabling
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies
-- Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Categories & Subcategories
DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON categories;
CREATE POLICY "Public categories are viewable by everyone" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public subcategories are viewable by everyone" ON subcategories;
CREATE POLICY "Public subcategories are viewable by everyone" ON subcategories FOR SELECT USING (true);

-- Listings
DROP POLICY IF EXISTS "Active listings are viewable by everyone" ON listings;
CREATE POLICY "Active listings are viewable by everyone" ON listings FOR SELECT USING (status = 'active');
DROP POLICY IF EXISTS "Users can insert own listings" ON listings;
CREATE POLICY "Users can insert own listings" ON listings FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own listings" ON listings;
CREATE POLICY "Users can update own listings" ON listings FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own listings" ON listings;
CREATE POLICY "Users can delete own listings" ON listings FOR DELETE USING (auth.uid() = user_id);

-- Favorites
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own favorites" ON favorites;
CREATE POLICY "Users can insert own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Messages
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
DROP POLICY IF EXISTS "Users can update own received messages (mark as read)" ON messages;
CREATE POLICY "Users can update own received messages (mark as read)" ON messages FOR UPDATE USING (auth.uid() = receiver_id);

-- Promotions
DROP POLICY IF EXISTS "Users can view own promotions" ON promotions;
CREATE POLICY "Users can view own promotions" ON promotions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can purchase promotions" ON promotions;
CREATE POLICY "Users can purchase promotions" ON promotions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
CREATE POLICY "Users can view their own transactions" ON transactions FOR SELECT USING (auth.uid() = seller_id OR auth.uid() = buyer_id);
DROP POLICY IF EXISTS "Users can create transactions" ON transactions;
CREATE POLICY "Users can create transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = seller_id OR auth.uid() = buyer_id);
DROP POLICY IF EXISTS "Users can update their own transactions" ON transactions;
CREATE POLICY "Users can update their own transactions" ON transactions FOR UPDATE USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

-- Ratings & Badges
DROP POLICY IF EXISTS "Anyone can view ratings" ON seller_ratings;
CREATE POLICY "Anyone can view ratings" ON seller_ratings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Buyers can create ratings" ON seller_ratings;
CREATE POLICY "Buyers can create ratings" ON seller_ratings FOR INSERT WITH CHECK (auth.uid() = buyer_id);
DROP POLICY IF EXISTS "Anyone can view badges" ON seller_badges;
CREATE POLICY "Anyone can view badges" ON seller_badges FOR SELECT USING (true);

-- Reservations
DROP POLICY IF EXISTS "Users can view their own reservations" ON reservations;
CREATE POLICY "Users can view their own reservations" ON reservations FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
DROP POLICY IF EXISTS "Users can create reservations" ON reservations;
CREATE POLICY "Users can create reservations" ON reservations FOR INSERT WITH CHECK (auth.uid() = buyer_id);
DROP POLICY IF EXISTS "Users can update their own reservations" ON reservations;
CREATE POLICY "Users can update their own reservations" ON reservations FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- 9. Functions & Triggers
-- Handle New User Profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update Updated At
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_listings_updated_at ON listings;
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update Transaction Status
CREATE OR REPLACE FUNCTION update_transaction_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.seller_confirmed = true AND NEW.buyer_confirmed = true THEN
    NEW.status = 'completed';
    NEW.completed_at = NOW();
  END IF;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS transaction_status_update ON transactions;
CREATE TRIGGER transaction_status_update BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_transaction_status();

-- Update Seller Averages
CREATE OR REPLACE FUNCTION update_seller_averages()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET 
    total_ratings = (SELECT COUNT(*) FROM seller_ratings WHERE seller_id = NEW.seller_id),
    communication_avg = (SELECT ROUND(AVG(communication_rating)::numeric, 2) FROM seller_ratings WHERE seller_id = NEW.seller_id),
    description_avg = (SELECT ROUND(AVG(description_rating)::numeric, 2) FROM seller_ratings WHERE seller_id = NEW.seller_id),
    delivery_avg = (SELECT ROUND(AVG(delivery_rating)::numeric, 2) FROM seller_ratings WHERE seller_id = NEW.seller_id),
    average_rating = (SELECT ROUND(AVG(overall_rating)::numeric, 2) FROM seller_ratings WHERE seller_id = NEW.seller_id)
  WHERE id = NEW.seller_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS seller_rating_update ON seller_ratings;
CREATE TRIGGER seller_rating_update AFTER INSERT OR UPDATE ON seller_ratings FOR EACH ROW EXECUTE FUNCTION update_seller_averages();

-- 10. Storage Setup
-- Note: Requires storage schema access (usually available in Supabase)
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Anyone can view listing images" ON storage.objects;
CREATE POLICY "Anyone can view listing images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-images');

DROP POLICY IF EXISTS "Authenticated users can upload listing images" ON storage.objects;
CREATE POLICY "Authenticated users can upload listing images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'listing-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own listing images" ON storage.objects;
CREATE POLICY "Users can update own listing images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete own listing images" ON storage.objects;
CREATE POLICY "Users can delete own listing images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CATEGORIES AND SUBCATEGORIES SEED DATA (FIXED UUID)

-- 1. Create Tables if not exist

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, slug)
);


-- 2. Clean existing data (optional)
TRUNCATE subcategories CASCADE;
TRUNCATE categories CASCADE;

-- 3. Insert Categories
INSERT INTO categories (id, name, slug, icon, display_order) VALUES ('a8953ed9-e1e2-41ff-8746-0285affe801b', 'Otomobil, Bisiklet & Tekne', 'Auto-Rad-Boot', NULL, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, slug, icon, display_order) VALUES ('f92b707f-b713-498d-97f0-a4e67abac8d8', 'Elektronik', 'Elektronik', NULL, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, slug, icon, display_order) VALUES ('ec7734c8-72d3-4179-bb0a-2ea55efdf9dd', 'Aile, Çocuk & Bebek', 'Familie-Kind-Baby', NULL, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, slug, icon, display_order) VALUES ('bee6a61e-9f24-443a-9f76-63e44697839c', 'Eğlence, Hobi & Mahalle', 'Freizeit-Hobby-Nachbarschaft', NULL, 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, slug, icon, display_order) VALUES ('1749f8be-9507-4ece-9499-9b9cd573f3ac', 'Ev & Bahçe', 'Haus-Garten', NULL, 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, slug, icon, display_order) VALUES ('722f5009-7bb5-477b-a2e4-8844567432bf', 'Evcil Hayvanlar', 'Haustiere', NULL, 6) ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, slug, icon, display_order) VALUES ('a91f7072-bdfe-4c68-88ec-213f89daa1a8', 'Emlak', 'Immobilien', NULL, 7) ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, slug, icon, display_order) VALUES ('39514af3-056f-4830-a363-2706933687b1', 'İş İlanları', 'Jobs', NULL, 8) ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, slug, icon, display_order) VALUES ('8bfde1ab-e25d-4267-9766-23344ac369f9', 'Moda & Güzellik', 'Mode-Beauty', NULL, 9) ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, slug, icon, display_order) VALUES ('78e40e34-001a-443e-8f52-b4ac27703892', 'Müzik, Film & Kitap', 'Musik-Film-Buecher', NULL, 10) ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, slug, icon, display_order) VALUES ('13597657-0d12-4751-bf6c-c405f0dfb940', 'Hizmetler', 'Dienstleistungen', NULL, 11) ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, slug, icon, display_order) VALUES ('02c117ac-6a21-4d71-960d-cb43e1254390', 'Ücretsiz & Takas', 'Verschenken-Tauschen', NULL, 12) ON CONFLICT (id) DO NOTHING;

-- 4. Insert Subcategories
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('dcfdaeb8-694a-4bee-b7e0-18cbf4ec27d4', '722f5009-7bb5-477b-a2e4-8844567432bf', 'Köpekler', 'Hunde', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('3f7eabf2-a60c-4db6-80f7-0d4bbb421bc7', 'bee6a61e-9f24-443a-9f76-63e44697839c', 'Sanat & Antikalar', 'Kunst-Antiquitaeten', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('305093ab-06cf-490e-bd81-618169ae39fa', '1749f8be-9507-4ece-9499-9b9cd573f3ac', 'Dekorasyon', 'Dekoration', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('9e85b367-d305-49f6-ae21-3d314bba0f8e', '02c117ac-6a21-4d71-960d-cb43e1254390', 'Ücretsiz', 'Zu-verschenken', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('8e5be3a7-dc2e-47f6-aa74-3c60777623a2', '39514af3-056f-4830-a363-2706933687b1', 'Mesleki Eğitim', 'Ausbildung', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('f62d82ac-041d-484f-b885-e83678faaf1a', 'f92b707f-b713-498d-97f0-a4e67abac8d8', 'Ses & Hifi', 'Audio-Hifi', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('478632ab-8fac-45bb-9b7e-d544d2104601', '13597657-0d12-4751-bf6c-c405f0dfb940', 'Otomobil, Bisiklet & Tekne Hizmetleri', 'Auto-Rad-Boot-Dienstleistungen', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('87ecb87a-a775-47c5-b027-be6a4c53344c', '78e40e34-001a-443e-8f52-b4ac27703892', 'Kitap & Dergi', 'Buecher-Zeitschriften', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('73de5922-f646-4f7b-8711-f1b6894c0455', 'a91f7072-bdfe-4c68-88ec-213f89daa1a8', 'Kiralık Daireler', 'Mietwohnungen', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('5d22fe90-7265-4246-827e-5de9c55bf376', 'a8953ed9-e1e2-41ff-8746-0285affe801b', 'Otomobiller', 'Autos', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('bd129e06-4c66-47f7-ac78-0d2d0fa01b71', 'ec7734c8-72d3-4179-bb0a-2ea55efdf9dd', 'Bebek & Çocuk Giyimi', 'Baby-Kinderkleidung', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('82c29534-594d-4683-b367-0c7b0dd2e8d4', '8bfde1ab-e25d-4267-9766-23344ac369f9', 'Saat & Takı', 'Uhren-Schmuck', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('0b4dc2ee-d78f-4c85-b644-69723350b5fd', 'ec7734c8-72d3-4179-bb0a-2ea55efdf9dd', 'Oyuncaklar', 'Spielzeug', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('61c78e91-7bf8-4f5d-a526-3175f5f3bbac', '78e40e34-001a-443e-8f52-b4ac27703892', 'Çizgi Romanlar', 'Comics', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('a04c84a4-f42e-4965-8347-fd115088e2b5', 'bee6a61e-9f24-443a-9f76-63e44697839c', 'Bisiklet & Aksesuarlar', 'Fahrraeder-Zubehoer-Freizeit', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('9ec118d2-76ef-46af-a45b-ec0fafb9b190', '02c117ac-6a21-4d71-960d-cb43e1254390', 'Takas', 'Tauschen', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('92dd9389-5402-419d-a724-4fa4902ecba3', '722f5009-7bb5-477b-a2e4-8844567432bf', 'Kediler', 'Katzen', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('c396f0f8-c261-4ded-b1f0-f71cf5bfbfc7', '8bfde1ab-e25d-4267-9766-23344ac369f9', 'Kadın Giyimi', 'Damenbekleidung', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('e160a986-2fca-400e-8a4e-b40f50713246', '39514af3-056f-4830-a363-2706933687b1', 'İnşaat, El Sanatları & Üretim', 'Bau-Handwerk-Produktion-Jobs', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('7e395783-7e6c-4d7c-8f3a-4f0dd7f3492b', 'a91f7072-bdfe-4c68-88ec-213f89daa1a8', 'Kiralık Evler', 'Haeuser-zur-Miete', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('910cc06e-ae35-455d-8d47-1a2b965b1e39', '13597657-0d12-4751-bf6c-c405f0dfb940', 'İnşaat, El Sanatları & Üretim', 'Bau-Handwerk-Produktion', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('4b890f3a-ae21-4dee-9a39-69920b3f14d9', '1749f8be-9507-4ece-9499-9b9cd573f3ac', 'Bahçe Malzemeleri & Bitkiler', 'Gartenzubehoer-Pflanzen', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('02efad23-f643-4f46-8d44-14080a9ad6d9', 'f92b707f-b713-498d-97f0-a4e67abac8d8', 'Fotoğraf & Kamera', 'Foto', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('47f40dbe-babe-432f-af71-741093409518', 'a8953ed9-e1e2-41ff-8746-0285affe801b', 'Oto Parça & Lastik', 'Autoteile', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('dd7873ac-8523-42d7-9f15-0004d7ca10ed', '722f5009-7bb5-477b-a2e4-8844567432bf', 'Küçük Hayvanlar', 'Kleintiere', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('19dd3331-c772-461e-b035-675e6492a0db', 'a8953ed9-e1e2-41ff-8746-0285affe801b', 'Tekne & Tekne Malzemeleri', 'Boote-Bootszubehoer', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('d9b03735-5e23-42ca-8590-e085bd30c8a3', 'f92b707f-b713-498d-97f0-a4e67abac8d8', 'Cep Telefonu & Telefon', 'Handy-Telefon', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('00f64509-142f-48aa-81ed-47e84b66a231', 'ec7734c8-72d3-4179-bb0a-2ea55efdf9dd', 'Bebek Arabaları & Pusetler', 'Kinderwagen-Buggys', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('0c47520e-2bb4-4c72-8cdb-f418e5cdd7ec', 'bee6a61e-9f24-443a-9f76-63e44697839c', 'Koleksiyon', 'Sammeln', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('6d965928-e04d-41d7-b92a-cfcbc2deefa1', '1749f8be-9507-4ece-9499-9b9cd573f3ac', 'Ev Tadilatı', 'Heimwerken', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('61a2fc92-7c9d-41e7-ae2b-ab33ad0bde91', 'a91f7072-bdfe-4c68-88ec-213f89daa1a8', 'Satılık Daireler', 'Eigentumswohnungen', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('60e4cb3f-703b-4f52-b343-d7a9c24293a1', '8bfde1ab-e25d-4267-9766-23344ac369f9', 'Erkek Giyimi', 'Herrenbekleidung', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('cd1bd8f5-3491-4d5a-a369-fb97f2f5b0a6', '78e40e34-001a-443e-8f52-b4ac27703892', 'Ders Kitapları, Okul & Eğitim', 'Fachbuecher-Schule-Studium', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('def73576-d48b-4fcc-b517-6e126cc07e07', '13597657-0d12-4751-bf6c-c405f0dfb940', 'Ev Hizmetleri', 'Dienstleistungen-rund-ums-Haus', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('61d233c5-9c3e-48a9-9948-01ee520ce1e1', '39514af3-056f-4830-a363-2706933687b1', 'Büro İşleri & Yönetim', 'Buero-Verwaltung', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('223dc5cb-2531-423c-aa7a-ad161b502616', '1749f8be-9507-4ece-9499-9b9cd573f3ac', 'Mutfak & Yemek Odası', 'Kueche-Esszimmer', 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('720bcae8-7b77-4d74-92f0-74eaa0ee4169', '8bfde1ab-e25d-4267-9766-23344ac369f9', 'Ayakkabılar', 'Schuhe', 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('afeec9a7-5f69-4e56-a6c4-387d1ebfea87', 'bee6a61e-9f24-443a-9f76-63e44697839c', 'Spor & Kamp', 'Sport-Camping', 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('cebe06aa-46f6-4fc4-a8d6-43f0712e9a69', 'ec7734c8-72d3-4179-bb0a-2ea55efdf9dd', 'Oto Koltukları', 'Autositze', 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('3e398c2d-f070-48f0-b1a9-4f3e47f5be7e', '722f5009-7bb5-477b-a2e4-8844567432bf', 'Balıklar', 'Fische', 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('8a4296f5-f3f9-4a49-9d4a-7200ab585262', '13597657-0d12-4751-bf6c-c405f0dfb940', 'Sağlık & Kozmetik', 'Gesundheit-Kosmetik', 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('cb47d0c4-e131-45f3-b802-e13ad9cb0474', 'a91f7072-bdfe-4c68-88ec-213f89daa1a8', 'Satılık Evler', 'Haeuser-zum-Kauf', 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('60691b59-c539-4d61-abaa-240eff1dabf6', '39514af3-056f-4830-a363-2706933687b1', 'Gastronomi & Turizm', 'Gastronomie-Tourismus', 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('c1178bcf-fdd7-4a5a-b52a-f0e08952e289', 'f92b707f-b713-498d-97f0-a4e67abac8d8', 'Ev Aletleri', 'Haushaltsgeraete', 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('841a049b-0090-4912-8db6-7522ae67154a', '78e40e34-001a-443e-8f52-b4ac27703892', 'Film & DVD', 'Film-DVD', 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('7fd8b0ca-3360-41c2-94f1-0f72ff90c27f', 'a8953ed9-e1e2-41ff-8746-0285affe801b', 'Bisiklet & Aksesuarlar', 'Fahrraeder-Zubehoer', 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('523bac78-d4f1-4fb1-ab92-2750f27a13cd', '78e40e34-001a-443e-8f52-b4ac27703892', 'Müzik & CD''ler', 'Musik-CDs', 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('8b5f7eab-a584-453f-be3a-58e463653e2b', 'a8953ed9-e1e2-41ff-8746-0285affe801b', 'Motosiklet & Scooter', 'Motorraeder-Motorroller', 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('61d4c873-207d-4659-b1ac-8ee8a7017f95', '8bfde1ab-e25d-4267-9766-23344ac369f9', 'Diğer Moda & Güzellik', 'Weiteres-Mode-Beauty', 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('7e2ec061-0083-42ec-9a64-ea9750aa3e6b', 'ec7734c8-72d3-4179-bb0a-2ea55efdf9dd', 'Diğer Aile, Çocuk & Bebek', 'Weiteres-Familie-Kind-Baby', 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('8a06ee81-cdc3-4243-8e68-338fcbca3a2e', 'f92b707f-b713-498d-97f0-a4e67abac8d8', 'Konsollar', 'Konsolen', 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('7461cc80-e482-4a21-8e2a-15d052967564', 'a91f7072-bdfe-4c68-88ec-213f89daa1a8', 'Arsa & Bahçe', 'Grundstuecke-Gaerten', 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('f386afda-b1af-40e7-ab3b-fbc422d6b5ec', 'bee6a61e-9f24-443a-9f76-63e44697839c', 'Mahalle Yardımı', 'Nachbarschaftshilfe', 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('2f6c9025-2fc4-4b69-9da4-9572b8bec0bb', '39514af3-056f-4830-a363-2706933687b1', 'Sağlık & Sosyal Hizmetler', 'Gesundheit-Soziales', 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('de697661-04a9-41df-8e75-7279d20cf882', '1749f8be-9507-4ece-9499-9b9cd573f3ac', 'Lamba & Aydınlatma', 'Lampen-Licht', 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('a35a6bfa-3131-4ce8-aa0e-7ccf5906d2ca', '722f5009-7bb5-477b-a2e4-8844567432bf', 'Diğer Evcil Hayvanlar', 'Weiteres-Haustiere', 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('11d32d6c-b829-4ffe-91e0-fd52dc0ebcec', '13597657-0d12-4751-bf6c-c405f0dfb940', 'Eğitim & Kurslar', 'Unterricht-Kurse', 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('0055d777-37f4-4289-936b-5d2ad8edcbde', 'f92b707f-b713-498d-97f0-a4e67abac8d8', 'Dizüstü Bilgisayarlar', 'Notebooks', 6) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('ef984932-4d82-43fb-b469-28393e26127f', '1749f8be-9507-4ece-9499-9b9cd573f3ac', 'Mobilya', 'Moebel', 6) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('bdf7dc59-c020-4da4-8b85-e40f45005db8', 'a91f7072-bdfe-4c68-88ec-213f89daa1a8', 'Ticari Emlak', 'Gewerbeimmobilien', 6) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('cb46a619-a9c7-4a02-97a2-242ecf0f29aa', 'a8953ed9-e1e2-41ff-8746-0285affe801b', 'Motosiklet Parça & Aksesuarlar', 'Motorradteile-Zubehoer', 6) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('8edadd98-62b5-4ed9-abcb-829989ed388a', '78e40e34-001a-443e-8f52-b4ac27703892', 'Müzik Enstrümanları', 'Musikinstrumente', 6) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('ee12b7bd-e16a-45be-8255-767a83199f6d', '13597657-0d12-4751-bf6c-c405f0dfb940', 'Etkinlikler & Sanatçılar', 'Veranstaltungen-Kuenstler', 6) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('4f4d0db2-0540-4a00-be6e-d4727f3c0bd8', '39514af3-056f-4830-a363-2706933687b1', 'Ek İşler', 'Mini-Nebenjobs', 6) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('4c42a6fd-378a-435d-8622-df9afafcfdca', 'bee6a61e-9f24-443a-9f76-63e44697839c', 'Biletler', 'Eintrittskarten-Tickets', 6) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('e8effbcf-5e01-4cc4-ac39-1faca6010684', 'a8953ed9-e1e2-41ff-8746-0285affe801b', 'Ticari Araçlar & Römorklar', 'Nutzfahrzeuge-Anhaenger', 6) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('4a5352f5-b9a4-49e4-a606-33c40aa1e0a1', 'a91f7072-bdfe-4c68-88ec-213f89daa1a8', 'Garaj & Otopark', 'Garagen-Stellplaetze', 7) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('4d62666c-6327-4313-939c-ab1345d24794', 'a8953ed9-e1e2-41ff-8746-0285affe801b', 'Tamir & Servis', 'Reparaturen-Dienstleistungen', 7) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('f5950745-3439-42ca-af50-79b1da96e93c', '39514af3-056f-4830-a363-2706933687b1', 'Staj', 'Praktikum', 7) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('acda2d81-4881-4548-bbd0-75cde6d9a02e', '1749f8be-9507-4ece-9499-9b9cd573f3ac', 'Taşımacılık & Nakliye', 'Umzug-Transport', 7) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('95c788bf-030a-40ee-8c19-4fbaf7e8b9c2', 'f92b707f-b713-498d-97f0-a4e67abac8d8', 'Bilgisayarlar', 'PCs', 7) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('16df5a26-622f-41f4-b94a-79c511dbc386', 'bee6a61e-9f24-443a-9f76-63e44697839c', 'Diğer Eğlence, Hobi & Mahalle', 'Weiteres-Freizeit-Hobby-Nachbarschaft', 7) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('f5d02b59-3daa-4e1c-9695-abea1870bd16', '13597657-0d12-4751-bf6c-c405f0dfb940', 'Diğer Hizmetler', 'Weitere-Dienstleistungen', 7) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('224943f7-9b7e-4c30-9b8d-9f73e3160124', 'a91f7072-bdfe-4c68-88ec-213f89daa1a8', 'Geçici Konaklama & Paylaşımlı Ev', 'Auf-Zeit-WG', 8) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('7cffdb7f-5ac0-497e-86a2-efd9ac2a02aa', 'f92b707f-b713-498d-97f0-a4e67abac8d8', 'Bilgisayar Aksesuarları & Yazılım', 'PC-Zubehoer-Software', 8) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('62b2d22a-ecbd-40e3-97d5-3ff098c1af27', 'a8953ed9-e1e2-41ff-8746-0285affe801b', 'Karavan & Motokaravan', 'Wohnwagen-Wohnmobile', 8) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('fcb8ffc3-09ff-4eab-b933-3881b320964d', '1749f8be-9507-4ece-9499-9b9cd573f3ac', 'Diğer Ev & Bahçe', 'Weiteres-Haus-Garten', 8) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('fdbe5721-89db-4b67-b05e-2b3e2194fe32', '39514af3-056f-4830-a363-2706933687b1', 'Diğer İş İlanları', 'Weitere-Jobs', 8) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('8b59f8f2-744a-4c02-aac1-6b3fcbef1c20', 'a91f7072-bdfe-4c68-88ec-213f89daa1a8', 'Tatil Evi & Yurt Dışı Emlak', 'Ferien-Auslandsimmobilien', 9) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('3c33895c-0b44-4f87-9758-0b98e73e68bf', 'f92b707f-b713-498d-97f0-a4e67abac8d8', 'Tabletler & E-Okuyucular', 'Tablets-Reader', 9) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('2e9af87e-39a6-4bd7-9032-cec008d7b57b', 'a8953ed9-e1e2-41ff-8746-0285affe801b', 'Diğer Otomobil, Bisiklet & Tekne', 'Weiteres-Auto-Rad-Boot', 9) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('5c5d47fa-109d-4a36-9a3c-003687f86a78', 'f92b707f-b713-498d-97f0-a4e67abac8d8', 'TV & Video', 'TV-Video', 10) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('5ae1d7ce-12c2-43c7-8db7-12507a81aa19', 'a91f7072-bdfe-4c68-88ec-213f89daa1a8', 'Yeni Projeler', 'Neubauprojekte', 10) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('c1b3d2f4-44c5-40eb-9c47-8d8f2cbffd8a', 'f92b707f-b713-498d-97f0-a4e67abac8d8', 'Elektronik Hizmetler', 'Dienstleistungen-Elektronik', 11) ON CONFLICT (id) DO NOTHING;
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES ('879c963b-d2cb-4baf-b90e-2cfac2d2b6c3', 'a91f7072-bdfe-4c68-88ec-213f89daa1a8', 'Diğer Emlak', 'Weitere-Immobilien', 11) ON CONFLICT (id) DO NOTHING;

-- 5. Enable RLS and add public policy

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON categories;
CREATE POLICY "Public categories are viewable by everyone" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public subcategories are viewable by everyone" ON subcategories;
CREATE POLICY "Public subcategories are viewable by everyone" ON subcategories FOR SELECT USING (true);


-- 11. Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  search_bg_color TEXT DEFAULT '#dc2626',
  site_name TEXT DEFAULT 'ExVitrin',
  site_description TEXT DEFAULT 'Türkiye''nin en büyük ilan pazaryeri.',
  contact_email TEXT DEFAULT 'kerem_aydin@aol.com',
  contact_phone TEXT DEFAULT '+90 212 123 45 67',
  maintenance_mode BOOLEAN DEFAULT false,
  allow_registration BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_settings (id, search_bg_color) 
VALUES (1, '#dc2626')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin update site_settings" ON site_settings FOR UPDATE USING (true);
CREATE POLICY "Admin insert site_settings" ON site_settings FOR INSERT WITH CHECK (true);

