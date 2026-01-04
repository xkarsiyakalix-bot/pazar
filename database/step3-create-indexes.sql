/* ADIM 3: İndeksler Ekle */

/* Transactions indeksleri */
CREATE INDEX idx_transactions_seller ON transactions(seller_id);
CREATE INDEX idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX idx_transactions_listing ON transactions(listing_id);
CREATE INDEX idx_transactions_status ON transactions(status);

/* Seller Ratings indeksleri */
CREATE INDEX idx_seller_ratings_seller ON seller_ratings(seller_id);
CREATE INDEX idx_seller_ratings_buyer ON seller_ratings(buyer_id);
CREATE INDEX idx_seller_ratings_created ON seller_ratings(created_at DESC);

/* Seller Badges indeksleri */
CREATE INDEX idx_seller_badges_user ON seller_badges(user_id);
CREATE INDEX idx_seller_badges_type ON seller_badges(badge_type);

/* User Ratings indeksi */
CREATE INDEX idx_user_ratings_user ON user_ratings(user_id);
CREATE INDEX idx_user_ratings_average ON user_ratings(average_rating DESC);
