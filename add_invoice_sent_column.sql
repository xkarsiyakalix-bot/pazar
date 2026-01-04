-- Add invoice tracking column to promotions table
ALTER TABLE promotions 
ADD COLUMN IF NOT EXISTS invoice_sent_at TIMESTAMP WITH TIME ZONE;
