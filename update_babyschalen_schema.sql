-- Add babyschalen_kindersitze_color column to listings table
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS babyschalen_kindersitze_color text;
