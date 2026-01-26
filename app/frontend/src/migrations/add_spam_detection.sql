-- Add spam detection columns to listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS spam_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_spam BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS spam_flags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS reviewed_by_admin BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS auto_hidden BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS spam_checked_at TIMESTAMP WITH TIME ZONE;

-- Create index for spam queries
CREATE INDEX IF NOT EXISTS idx_listings_spam_score ON listings(spam_score);
CREATE INDEX IF NOT EXISTS idx_listings_is_spam ON listings(is_spam);
CREATE INDEX IF NOT EXISTS idx_listings_needs_review ON listings(spam_score) WHERE spam_score >= 31;

-- Create spam_reports table for user reports
CREATE TABLE IF NOT EXISTS spam_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES profiles(id),
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending', -- pending, reviewed, resolved
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES profiles(id)
);

-- Create indexes for spam_reports
CREATE INDEX IF NOT EXISTS idx_spam_reports_listing ON spam_reports(listing_id);
CREATE INDEX IF NOT EXISTS idx_spam_reports_status ON spam_reports(status);
CREATE INDEX IF NOT EXISTS idx_spam_reports_created ON spam_reports(created_at DESC);

-- Enable RLS on spam_reports
ALTER TABLE spam_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Users can report spam
CREATE POLICY "Users can report spam"
  ON spam_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

-- Policy: Users can view their own reports
CREATE POLICY "Users can view own reports"
  ON spam_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

-- Policy: Admins can view all reports
CREATE POLICY "Admins can view all reports"
  ON spam_reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Policy: Admins can update reports
CREATE POLICY "Admins can update reports"
  ON spam_reports FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
