/* ADIM 2: Tabloları Oluştur */

/* 1. TRANSACTIONS TABLOSU */
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  status VARCHAR(20) DEFAULT 'pending',
  
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

/* 2. SELLER_RATINGS TABLOSU */
CREATE TABLE seller_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
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

/* 3. SELLER_BADGES TABLOSU */
CREATE TABLE seller_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_type VARCHAR(50) NOT NULL,
  
  earned_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  
  UNIQUE(user_id, badge_type)
);

/* 4. USERS TABLOSUNA KOLONLAR EKLE */
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_ratings INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS communication_avg DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS description_avg DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS delivery_avg DECIMAL(3,2) DEFAULT 0;
