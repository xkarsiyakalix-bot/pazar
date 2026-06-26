-- Page Visits Analytics Table
CREATE TABLE IF NOT EXISTS public.page_visits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    page_path TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) Policies
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert visits (for tracking guests)
CREATE POLICY "Allow anonymous inserts for page_visits" 
ON public.page_visits FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read visits (for the admin panel)
CREATE POLICY "Allow anonymous read for page_visits" 
ON public.page_visits FOR SELECT 
USING (true);
