-- Migration: Notification Deduplication and Auto-Cleanup
-- Description: Ensures one notification per user per listing and limits history to last 5.

CREATE OR REPLACE FUNCTION notify_matching_saved_searches()
RETURNS TRIGGER AS $$
DECLARE
    search_record RECORD;
    notification_title TEXT;
    notification_message TEXT;
BEGIN
    -- Only process if listing is active
    IF NEW.status = 'active' THEN
        -- Find all users who have at least one matching saved search for this listing
        -- Deduplicated by user_id to prevent "duplicate notifications for matching multiple searches"
        FOR search_record IN 
            SELECT DISTINCT ss.user_id, ss.category
            FROM saved_searches ss
            WHERE ss.category = NEW.category
            AND ss.user_id != NEW.user_id  -- Don't notify the listing creator
        LOOP
            -- Create notification title and message
            notification_title := 'Yeni İlan: ' || COALESCE(NEW.title, 'Başlıksız İlan');
            notification_message := 'Kaydettiğiniz "' || search_record.category || '" aramasına uygun yeni bir ilan eklendi.';
            
            -- Insert notification (only if it doesn't already exist for this user and listing)
            -- This is an extra safety check
            IF NOT EXISTS (
                SELECT 1 FROM notifications 
                WHERE user_id = search_record.user_id 
                AND listing_id = NEW.id
            ) THEN
                INSERT INTO notifications (
                    user_id,
                    type,
                    title,
                    message,
                    listing_id,
                    is_read
                ) VALUES (
                    search_record.user_id,
                    'new_listing',
                    notification_title,
                    notification_message,
                    NEW.id,
                    FALSE
                );

                -- Auto-cleanup: Keep only last 5 notifications for this user
                DELETE FROM notifications
                WHERE id IN (
                    SELECT id
                    FROM notifications
                    WHERE user_id = search_record.user_id
                    ORDER BY created_at DESC
                    OFFSET 5
                );
            END IF;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
