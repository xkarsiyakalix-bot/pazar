-- ============================================
-- KLEINANZEIGEN PUANLAMA SİSTEMİ
-- Veritabanı Tabloları
-- ============================================

-- 1. TRANSACTIONS TABLOSU
-- İşlem takibi için
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- İşlem durumu
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'expired')),
  
  -- Onaylar
  seller_confirmed BOOLEAN DEFAULT false,
  buyer_confirmed BOOLEAN DEFAULT false,
  seller_confirmed_at TIMESTAMP,
  buyer_confirmed_at TIMESTAMP,
  
  -- Puanlama durumu
  seller_rated BOOLEAN DEFAULT false,
  buyer_rated BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 days',
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Bir ilan için bir alıcı-satıcı çifti sadece bir işlem yapabilir
  UNIQUE(listing_id, seller_id, buyer_id)
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_transactions_seller ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_listing ON transactions(listing_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- ============================================

-- 2. SELLER_RATINGS TABLOSU
-- Satıcı puanlamaları
CREATE TABLE IF NOT EXISTS seller_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  
  -- Puanlar (1-5)
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  description_rating INTEGER CHECK (description_rating >= 1 AND description_rating <= 5),
  delivery_rating INTEGER CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  
  -- Yorum
  review_text TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Bir işlem için sadece bir puanlama
  UNIQUE(transaction_id, buyer_id)
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_seller_ratings_seller ON seller_ratings(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_ratings_buyer ON seller_ratings(buyer_id);
CREATE INDEX IF NOT EXISTS idx_seller_ratings_created ON seller_ratings(created_at DESC);

-- ============================================

-- 3. SELLER_BADGES TABLOSU
-- Satıcı rozetleri
CREATE TABLE IF NOT EXISTS seller_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_type VARCHAR(50) NOT NULL,
  -- Badge types: 'new_seller', 'trusted', 'super_seller', 'elite', 
  --              'fast_response', 'fast_delivery', 'verified'
  
  earned_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  
  -- Bir kullanıcı her rozetten sadece bir tane alabilir
  UNIQUE(user_id, badge_type)
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_seller_badges_user ON seller_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_seller_badges_type ON seller_badges(badge_type);

-- ============================================

-- 4. USERS TABLOSUNA KOLONLAR EKLE
-- Satıcı ortalama puanları
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_ratings INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS communication_avg DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS description_avg DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS delivery_avg DECIMAL(3,2) DEFAULT 0;

-- İndeks
CREATE INDEX IF NOT EXISTS idx_users_average_rating ON users(average_rating DESC);

-- ============================================

-- 5. TRIGGER: Transaction durumu güncellendiğinde
CREATE OR REPLACE FUNCTION update_transaction_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Her iki taraf da onayladıysa
  IF NEW.seller_confirmed = true AND NEW.buyer_confirmed = true THEN
    NEW.status = 'completed';
    NEW.completed_at = NOW();
  END IF;
  
  -- Güncelleme zamanını ayarla
  NEW.updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transaction_status_update
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_transaction_status();

-- ============================================

-- 6. TRIGGER: Satıcı ortalama puanını güncelle
CREATE OR REPLACE FUNCTION update_seller_averages()
RETURNS TRIGGER AS $$
BEGIN
  -- Satıcının ortalama puanlarını hesapla
  UPDATE users
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

CREATE TRIGGER seller_rating_update
  AFTER INSERT OR UPDATE ON seller_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_seller_averages();

-- ============================================

-- 7. TRIGGER: Zaman aşımı kontrolü (Opsiyonel - Cron job ile de yapılabilir)
CREATE OR REPLACE FUNCTION check_transaction_expiry()
RETURNS void AS $$
BEGIN
  UPDATE transactions
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================

-- 8. RLS (Row Level Security) Politikaları

-- Transactions tablosu
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

CREATE POLICY "Users can create transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = seller_id OR auth.uid() = buyer_id);

CREATE POLICY "Users can update their own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

-- Seller Ratings tablosu
ALTER TABLE seller_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ratings"
  ON seller_ratings FOR SELECT
  USING (true);

CREATE POLICY "Buyers can create ratings"
  ON seller_ratings FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Seller Badges tablosu
ALTER TABLE seller_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges"
  ON seller_badges FOR SELECT
  USING (true);

-- ============================================

-- TAMAMLANDI!
-- Bu scripti Supabase SQL Editor'de çalıştırın.
