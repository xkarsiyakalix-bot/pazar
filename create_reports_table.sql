-- Create reports table for listing reports
CREATE TABLE IF NOT EXISTS reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    reported_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_reports_listing_id ON reports(listing_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- Enable Row Level Security
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can create a report (if authenticated)
CREATE POLICY "Anyone can create reports"
    ON reports
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Users can view their own reports
CREATE POLICY "Users can view their own reports"
    ON reports
    FOR SELECT
    TO authenticated
    USING (reported_by = auth.uid());

-- Policy: Admins can view all reports (user_number = 1001)
CREATE POLICY "Admins can view all reports"
    ON reports
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_number = 1001
        )
    );

-- Policy: Admins can update reports (user_number = 1001)
CREATE POLICY "Admins can update reports"
    ON reports
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_number = 1001
        )
    );

-- Policy: Admins can delete reports (user_number = 1001)
CREATE POLICY "Admins can delete reports"
    ON reports
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_number = 1001
        )
    );

-- Add comment to table
COMMENT ON TABLE reports IS 'Stores user reports for listings';
COMMENT ON COLUMN reports.reason IS 'Reason for reporting: spam, inappropriate, duplicate, wrong_category, sold, other';
COMMENT ON COLUMN reports.status IS 'Report status: pending, reviewed, resolved, rejected';
