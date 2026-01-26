-- Migration: Add invoice_sent_at column to promotions
-- Description: Adds a timestamp column to track when an invoice email was sent.

ALTER TABLE public.promotions 
ADD COLUMN IF NOT EXISTS invoice_sent_at TIMESTAMPTZ;

-- Comment for clarity
COMMENT ON COLUMN public.promotions.invoice_sent_at IS 'Timestamp of when the invoice e-mail was last sent to the customer.';
