-- Migration: Price Drop Notifications
-- Description: Automatically notify users when a favorited listing's price decreases.

CREATE OR REPLACE FUNCTION notify_price_drop()
RETURNS TRIGGER AS $$
DECLARE
    fav_record RECORD;
    notification_title TEXT;
    notification_message TEXT;
BEGIN
    -- Only process if price has decreased and listing is active
    IF NEW.status = 'active' AND NEW.price < OLD.price THEN
        -- Find all users who have favorited this listing
        FOR fav_record IN 
            SELECT user_id 
            FROM favorites 
            WHERE listing_id = NEW.id
            AND user_id != NEW.user_id  -- Don't notify the owner
        LOOP
            -- Create notification title and message
            notification_title := 'Fiyat Düştü! ' || COALESCE(NEW.title, 'İlan');
            notification_message := '"' || COALESCE(NEW.title, 'İlan') || '" başlıklı favori ilanınızın fiyatı ' || OLD.price || ' TL''den ' || NEW.price || ' TL''ye düştü.';
            
            -- Insert notification
            INSERT INTO notifications (
                user_id,
                type,
                title,
                message,
                listing_id,
                is_read
            ) VALUES (
                fav_record.user_id,
                'price_drop',
                notification_title,
                notification_message,
                NEW.id,
                FALSE
            );

            -- Auto-cleanup: Keep only last 5 notifications for this user (matching existing behavior)
            DELETE FROM notifications
            WHERE id IN (
                SELECT id
                FROM notifications
                WHERE user_id = fav_record.user_id
                ORDER BY created_at DESC
                OFFSET 5
            );
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Trigger
DROP TRIGGER IF EXISTS on_price_drop ON public.listings;
CREATE TRIGGER on_price_drop
    AFTER UPDATE OF price ON public.listings
    FOR EACH ROW
    WHEN (OLD.price IS DISTINCT FROM NEW.price)
    EXECUTE FUNCTION notify_price_drop();
