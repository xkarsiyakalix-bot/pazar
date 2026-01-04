-- KLEINANZEIGEN / LOKALPAZAR - FULL PROJECT REPLICATION SCRIPT
-- RUN THIS IN THE SUPABASE SQL EDITOR

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Base Tables
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
  condition TEXT,
  images TEXT[], 
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'deleted')),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- 3. Add Custom Columns to Listings
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS federal_state TEXT,
ADD COLUMN IF NOT EXISTS seller_type TEXT,
ADD COLUMN IF NOT EXISTS offer_type TEXT,
ADD COLUMN IF NOT EXISTS price_type TEXT DEFAULT 'fixed',
ADD COLUMN IF NOT EXISTS is_top BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS floor INTEGER,
ADD COLUMN IF NOT EXISTS construction_year INTEGER,
ADD COLUMN IF NOT EXISTS plot_area DECIMAL,
ADD COLUMN IF NOT EXISTS commission TEXT,
ADD COLUMN IF NOT EXISTS wohnungstyp TEXT,
ADD COLUMN IF NOT EXISTS haustyp TEXT,
ADD COLUMN IF NOT EXISTS grundstuecksart TEXT,
ADD COLUMN IF NOT EXISTS objektart TEXT,
ADD COLUMN IF NOT EXISTS garage_type TEXT,
ADD COLUMN IF NOT EXISTS area DECIMAL,
ADD COLUMN IF NOT EXISTS price_per_sqm DECIMAL,
ADD COLUMN IF NOT EXISTS lage TEXT,
ADD COLUMN IF NOT EXISTS apartment_features TEXT[],
ADD COLUMN IF NOT EXISTS house_features TEXT[],
ADD COLUMN IF NOT EXISTS angebotsart TEXT,
ADD COLUMN IF NOT EXISTS kraftstoff TEXT,
ADD COLUMN IF NOT EXISTS leistung INTEGER,
ADD COLUMN IF NOT EXISTS marke TEXT,
ADD COLUMN IF NOT EXISTS kilometerstand INTEGER,
ADD COLUMN IF NOT EXISTS erstzulassung INTEGER,
ADD COLUMN IF NOT EXISTS hubraum INTEGER,
ADD COLUMN IF NOT EXISTS getriebe TEXT,
ADD COLUMN IF NOT EXISTS schlafzimmer_art TEXT,
ADD COLUMN IF NOT EXISTS wohnzimmer_art TEXT,
ADD COLUMN IF NOT EXISTS wohnwagen_art TEXT,
ADD COLUMN IF NOT EXISTS modellbau_art TEXT,
ADD COLUMN IF NOT EXISTS handarbeit_art TEXT,
ADD COLUMN IF NOT EXISTS kuenstler_musiker_art TEXT,
ADD COLUMN IF NOT EXISTS reise_eventservices_art TEXT,
ADD COLUMN IF NOT EXISTS tierbetreuung_training_art TEXT,
ADD COLUMN IF NOT EXISTS dienstleistungen_haus_garten_art TEXT,
ADD COLUMN IF NOT EXISTS buecher_zeitschriften_art TEXT,
ADD COLUMN IF NOT EXISTS sammeln_art TEXT,
ADD COLUMN IF NOT EXISTS sport_camping_art TEXT,
ADD COLUMN IF NOT EXISTS dekoration_art TEXT,
ADD COLUMN IF NOT EXISTS bau_handwerk_produktion_art TEXT,
ADD COLUMN IF NOT EXISTS beauty_gesundheit_art TEXT,
ADD COLUMN IF NOT EXISTS audio_hifi_art TEXT,
ADD COLUMN IF NOT EXISTS handy_telefon_art TEXT,
ADD COLUMN IF NOT EXISTS foto_art TEXT,
ADD COLUMN IF NOT EXISTS haushaltsgeraete_art TEXT,
ADD COLUMN IF NOT EXISTS konsolen_art TEXT,
ADD COLUMN IF NOT EXISTS pc_zubehoer_software_art TEXT,
ADD COLUMN IF NOT EXISTS tablets_reader_art TEXT,
ADD COLUMN IF NOT EXISTS tv_video_art TEXT,
ADD COLUMN IF NOT EXISTS notebooks_art TEXT,
ADD COLUMN IF NOT EXISTS pcs_art TEXT,
ADD COLUMN IF NOT EXISTS videospiele_art TEXT,
ADD COLUMN IF NOT EXISTS dienstleistungen_elektronik_art TEXT,
ADD COLUMN IF NOT EXISTS sozialer_sektor_pflege_art TEXT,
ADD COLUMN IF NOT EXISTS bau_handwerk_art TEXT,
ADD COLUMN IF NOT EXISTS buero_verwaltung_art TEXT,
ADD COLUMN IF NOT EXISTS gastronomie_tourismus_art TEXT,
ADD COLUMN IF NOT EXISTS transport_logistik_verkehr_art TEXT,
ADD COLUMN IF NOT EXISTS immobilien_makler_art TEXT,
ADD COLUMN IF NOT EXISTS vertrieb_einkauf_verkauf_art TEXT,
ADD COLUMN IF NOT EXISTS weitere_jobs_art TEXT,
ADD COLUMN IF NOT EXISTS stundenlohn DECIMAL,
ADD COLUMN IF NOT EXISTS working_time TEXT,
ADD COLUMN IF NOT EXISTS baby_kinderkleidung_art TEXT,
ADD COLUMN IF NOT EXISTS baby_kinderkleidung_size TEXT,
ADD COLUMN IF NOT EXISTS baby_kinderkleidung_gender TEXT,
ADD COLUMN IF NOT EXISTS baby_kinderkleidung_color TEXT,
ADD COLUMN IF NOT EXISTS baby_kinderschuhe_art TEXT,
ADD COLUMN IF NOT EXISTS baby_kinderschuhe_size TEXT,
ADD COLUMN IF NOT EXISTS kinderwagen_buggys_art TEXT,
ADD COLUMN IF NOT EXISTS kinderwagen_buggys_color TEXT,
ADD COLUMN IF NOT EXISTS babyschalen_kindersitze_color TEXT,
ADD COLUMN IF NOT EXISTS kinderzimmermobel_art TEXT,
ADD COLUMN IF NOT EXISTS spielzeug_art TEXT,
ADD COLUMN IF NOT EXISTS fische_art TEXT,
ADD COLUMN IF NOT EXISTS hunde_art TEXT,
ADD COLUMN IF NOT EXISTS hunde_age TEXT,
ADD COLUMN IF NOT EXISTS hunde_geimpft TEXT,
ADD COLUMN IF NOT EXISTS hunde_erlaubnis TEXT,
ADD COLUMN IF NOT EXISTS katzen_art TEXT,
ADD COLUMN IF NOT EXISTS katzen_age TEXT,
ADD COLUMN IF NOT EXISTS katzen_geimpft TEXT,
ADD COLUMN IF NOT EXISTS katzen_erlaubnis TEXT,
ADD COLUMN IF NOT EXISTS kleintiere_art TEXT,
ADD COLUMN IF NOT EXISTS nutztiere_art TEXT,
ADD COLUMN IF NOT EXISTS pferde_art TEXT,
ADD COLUMN IF NOT EXISTS vermisstetiere_status TEXT,
ADD COLUMN IF NOT EXISTS voegel_art TEXT,
ADD COLUMN IF NOT EXISTS haustier_zubehoer_art TEXT,
ADD COLUMN IF NOT EXISTS taschen_accessoires_art TEXT,
ADD COLUMN IF NOT EXISTS uhren_schmuck_art TEXT,
ADD COLUMN IF NOT EXISTS kueche_esszimmer_art TEXT,
ADD COLUMN IF NOT EXISTS gartenzubehoer_art TEXT,
ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS invoice_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS versand_art TEXT;

-- 4. Ensure Profiles columns are also added if table already existed without them
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS street TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS legal_info TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 5. Enable RLS and add public policy for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON categories;
CREATE POLICY "Public categories are viewable by everyone" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public subcategories are viewable by everyone" ON subcategories;
CREATE POLICY "Public subcategories are viewable by everyone" ON subcategories FOR SELECT USING (true);

-- 4. Indexes
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

-- 5. RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Active listings are viewable by everyone" ON listings;
CREATE POLICY "Active listings are viewable by everyone" ON listings FOR SELECT USING (status = 'active');
DROP POLICY IF EXISTS "Users can insert own listings" ON listings;
CREATE POLICY "Users can insert own listings" ON listings FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own listings" ON listings;
CREATE POLICY "Users can update own listings" ON listings FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own listings" ON listings;
CREATE POLICY "Users can delete own listings" ON listings FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own favorites" ON favorites;
CREATE POLICY "Users can insert own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own messages" ON messages;
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
DROP POLICY IF EXISTS "Users can update own received messages (mark as read)" ON messages;
CREATE POLICY "Users can update own received messages (mark as read)" ON messages FOR UPDATE USING (auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can view own promotions" ON promotions;
CREATE POLICY "Users can view own promotions" ON promotions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can purchase promotions" ON promotions;
CREATE POLICY "Users can purchase promotions" ON promotions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
CREATE POLICY "Users can view their own transactions" ON transactions FOR SELECT USING (auth.uid() = seller_id OR auth.uid() = buyer_id);
DROP POLICY IF EXISTS "Users can create transactions" ON transactions;
CREATE POLICY "Users can create transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = seller_id OR auth.uid() = buyer_id);
DROP POLICY IF EXISTS "Users can update their own transactions" ON transactions;
CREATE POLICY "Users can update their own transactions" ON transactions FOR UPDATE USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Anyone can view ratings" ON seller_ratings;
CREATE POLICY "Anyone can view ratings" ON seller_ratings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Buyers can create ratings" ON seller_ratings;
CREATE POLICY "Buyers can create ratings" ON seller_ratings FOR INSERT WITH CHECK (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Anyone can view badges" ON seller_badges;
CREATE POLICY "Anyone can view badges" ON seller_badges FOR SELECT USING (true);

-- 6. Functions & Triggers
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

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Rating specific triggers
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
