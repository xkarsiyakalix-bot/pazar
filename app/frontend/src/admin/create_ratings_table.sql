-- Create Ratings Table
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rater_id UUID REFERENCES public.profiles(id) NOT NULL,
    rated_id UUID REFERENCES public.profiles(id) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(rater_id, rated_id) -- One rating per pair
);

-- Enable RLS
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view ratings" 
ON public.ratings FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create ratings" 
ON public.ratings FOR INSERT 
WITH CHECK (auth.uid() = rater_id);

CREATE POLICY "Users can update their own ratings" 
ON public.ratings FOR UPDATE 
USING (auth.uid() = rater_id);

CREATE POLICY "Users can delete their own ratings" 
ON public.ratings FOR DELETE 
USING (auth.uid() = rater_id);

-- Function to check eligibility (at least 5 messages)
CREATE OR REPLACE FUNCTION public.check_rating_eligibility(user1_id UUID, user2_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    message_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO message_count
    FROM messages
    WHERE (sender_id = user1_id AND receiver_id = user2_id)
       OR (sender_id = user2_id AND receiver_id = user1_id);
       
    RETURN message_count >= 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
