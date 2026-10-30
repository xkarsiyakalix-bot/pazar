-- Migration: Add EİDS and Taşınmaz Ticareti Yetki Belgesi fields to listings table
-- Created at: 2026-10-30

ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS real_estate_from text,
ADD COLUMN IF NOT EXISTS authority_cert_no text,
ADD COLUMN IF NOT EXISTS eids_number text;

-- Add comment for documentation
COMMENT ON COLUMN listings.real_estate_from IS 'Emlak ilanını veren taraf (Sahibinden, Emlak Ofisinden, İnşaat Firmasından, Bankadan)';
COMMENT ON COLUMN listings.authority_cert_no IS 'Taşınmaz Ticareti Yetki Belgesi Numarası (TTBS / EİDS)';
COMMENT ON COLUMN listings.eids_number IS 'Elektronik İlan Doğrulama Sistemi (EİDS) Kayıt Numarası';

