-- Create page_visits table for analytics
CREATE TABLE IF NOT EXISTS public.page_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    page_path TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL,
    user_agent TEXT
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_page_visits_created_at ON public.page_visits (created_at);
CREATE INDEX IF NOT EXISTS idx_page_visits_session_id ON public.page_visits (session_id);

-- Enable RLS
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid errors
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.page_visits;
DROP POLICY IF EXISTS "Allow admins to select" ON public.page_visits;

-- Allow anonymous inserts (anyone can record a visit)
CREATE POLICY "Allow anonymous inserts" ON public.page_visits FOR INSERT WITH CHECK (true);

-- Only admins can select (for the dashboard)
CREATE POLICY "Allow admins to select" ON public.page_visits FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND (profiles.is_admin = true OR profiles.admin_role IN ('super_admin', 'admin'))
    )
);
