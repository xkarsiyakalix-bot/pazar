-- ============================================================
-- Migration: Create notifications table + favorite trigger
-- Description: Notify listing owner when someone favorites their listing (like Vinted)
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. CREATE NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type        TEXT NOT NULL DEFAULT 'info',
    title       TEXT,
    message     TEXT NOT NULL,
    listing_id  UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    actor_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_read     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INDEX for fast per-user queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES
-- Users can only read their own notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

-- Users can mark their own notifications as read
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own notifications
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
CREATE POLICY "Users can delete own notifications"
    ON public.notifications FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- 5. TRIGGER FUNCTION: Notify owner when listing is favorited
-- ============================================================
CREATE OR REPLACE FUNCTION notify_listing_favorited()
RETURNS TRIGGER AS $$
DECLARE
    v_listing_owner_id  UUID;
    v_listing_title     TEXT;
    v_actor_name        TEXT;
BEGIN
    -- Get listing owner and title
    SELECT user_id, title
    INTO v_listing_owner_id, v_listing_title
    FROM public.listings
    WHERE id = NEW.listing_id;

    -- Don't notify if:
    -- a) listing not found
    -- b) user is favoriting their own listing
    IF v_listing_owner_id IS NULL OR v_listing_owner_id = NEW.user_id THEN
        RETURN NEW;
    END IF;

    -- Get actor (favoriting user) display name
    SELECT COALESCE(full_name, username, 'Bir kullanıcı')
    INTO v_actor_name
    FROM public.profiles
    WHERE id = NEW.user_id;

    -- Insert notification for listing owner
    INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message,
        listing_id,
        actor_id,
        is_read
    ) VALUES (
        v_listing_owner_id,
        'favorite',
        'İlanınız favorilere eklendi ❤️',
        v_actor_name || ', "' || COALESCE(v_listing_title, 'İlanınız') || '" adlı ilanınızı favorilerine ekledi.',
        NEW.listing_id,
        NEW.user_id,
        FALSE
    );

    -- Auto-cleanup: Keep only the last 50 notifications per user
    DELETE FROM public.notifications
    WHERE id IN (
        SELECT id
        FROM public.notifications
        WHERE user_id = v_listing_owner_id
        ORDER BY created_at DESC
        OFFSET 50
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. ATTACH TRIGGER to favorites table
DROP TRIGGER IF EXISTS on_listing_favorited ON public.favorites;
CREATE TRIGGER on_listing_favorited
    AFTER INSERT ON public.favorites
    FOR EACH ROW
    EXECUTE FUNCTION notify_listing_favorited();

-- ============================================================
-- 7. RE-CREATE PRICE DROP TRIGGER (in case it existed before)
-- ============================================================
CREATE OR REPLACE FUNCTION notify_price_drop()
RETURNS TRIGGER AS $$
DECLARE
    fav_record              RECORD;
    v_notification_message  TEXT;
BEGIN
    IF NEW.status = 'active' AND NEW.price < OLD.price THEN
        FOR fav_record IN
            SELECT user_id
            FROM public.favorites
            WHERE listing_id = NEW.id
              AND user_id != NEW.user_id
        LOOP
            v_notification_message :=
                '"' || COALESCE(NEW.title, 'İlan') || '" adlı favori ilanınızın fiyatı '
                || OLD.price::TEXT || ' TL''den '
                || NEW.price::TEXT || ' TL''ye düştü.';

            INSERT INTO public.notifications (
                user_id, type, title, message, listing_id, actor_id, is_read
            ) VALUES (
                fav_record.user_id,
                'price_drop',
                '💸 Fiyat Düştü! ' || COALESCE(NEW.title, 'İlan'),
                v_notification_message,
                NEW.id,
                NEW.user_id,
                FALSE
            );

            DELETE FROM public.notifications
            WHERE id IN (
                SELECT id FROM public.notifications
                WHERE user_id = fav_record.user_id
                ORDER BY created_at DESC
                OFFSET 50
            );
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_price_drop ON public.listings;
CREATE TRIGGER on_price_drop
    AFTER UPDATE OF price ON public.listings
    FOR EACH ROW
    WHEN (OLD.price IS DISTINCT FROM NEW.price)
    EXECUTE FUNCTION notify_price_drop();


-- ============================================================
-- 7. FAVORITES RLS: ALLOW PUBLIC/ANONYMOUS TO READ FAVORITE COUNTS
-- Allows both mobile & desktop (logged in or logged out) to
-- see the correct favorite count on any listing.
-- ============================================================
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Favorites are viewable by everyone" ON public.favorites;
CREATE POLICY "Favorites are viewable by everyone"
    ON public.favorites FOR SELECT
    USING (true);

-- Allow authenticated users to add favorites
DROP POLICY IF EXISTS "Users can insert own favorites" ON public.favorites;
CREATE POLICY "Users can insert own favorites"
    ON public.favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to remove favorites
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.favorites;
CREATE POLICY "Users can delete own favorites"
    ON public.favorites FOR DELETE
    USING (auth.uid() = user_id);

-- Public helper function to get favorite count with security definer
CREATE OR REPLACE FUNCTION public.get_listing_favorite_count(target_id UUID)
RETURNS BIGINT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT COUNT(*) FROM public.favorites WHERE listing_id = target_id;
$$;
