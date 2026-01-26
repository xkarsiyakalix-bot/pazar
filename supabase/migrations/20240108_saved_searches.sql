-- Migration: Save Search Notifications
-- Description: Creates tables and triggers for saved search notifications
-- Date: 2024-01-08

-- 1. Create saved_searches table
CREATE TABLE IF NOT EXISTS saved_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    search_name TEXT,
    category TEXT NOT NULL,
    subcategory TEXT,
    filters JSONB DEFAULT '{}'::jsonb,
    search_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, search_url)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_category ON saved_searches(category);

-- Enable RLS
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for saved_searches
CREATE POLICY "Users can view their own saved searches"
    ON saved_searches FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved searches"
    ON saved_searches FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved searches"
    ON saved_searches FOR DELETE
    USING (auth.uid() = user_id);

-- 2. Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'new_listing',
    title TEXT NOT NULL,
    message TEXT,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    saved_search_id UUID REFERENCES saved_searches(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
    ON notifications FOR DELETE
    USING (auth.uid() = user_id);

-- 3. Create function to check for matching saved searches
CREATE OR REPLACE FUNCTION notify_matching_saved_searches()
RETURNS TRIGGER AS $$
DECLARE
    search_record RECORD;
    notification_title TEXT;
    notification_message TEXT;
BEGIN
    -- Only process if listing is active
    IF NEW.status = 'active' THEN
        -- Find all saved searches that match this listing's category
        FOR search_record IN 
            SELECT DISTINCT ss.id, ss.user_id, ss.category, ss.search_name
            FROM saved_searches ss
            WHERE ss.category = NEW.category
            AND ss.user_id != NEW.user_id  -- Don't notify the listing creator
        LOOP
            -- Create notification title and message
            notification_title := 'Yeni İlan: ' || COALESCE(NEW.title, 'Başlıksız İlan');
            notification_message := 'Kaydettiğiniz "' || search_record.category || '" aramasına uygun yeni bir ilan eklendi.';
            
            -- Insert notification
            INSERT INTO notifications (
                user_id,
                type,
                title,
                message,
                listing_id,
                saved_search_id,
                is_read
            ) VALUES (
                search_record.user_id,
                'new_listing',
                notification_title,
                notification_message,
                NEW.id,
                search_record.id,
                FALSE
            );
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create trigger on listings table
DROP TRIGGER IF EXISTS trigger_notify_saved_searches ON listings;
CREATE TRIGGER trigger_notify_saved_searches
    AFTER INSERT ON listings
    FOR EACH ROW
    EXECUTE FUNCTION notify_matching_saved_searches();

-- Grant necessary permissions
GRANT SELECT, INSERT, DELETE ON saved_searches TO authenticated;
GRANT SELECT, UPDATE, DELETE ON notifications TO authenticated;
