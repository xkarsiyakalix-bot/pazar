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

