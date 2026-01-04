-- Migration: Add beauty_gesundheit_art to listings table
ALTER TABLE listings ADD COLUMN IF NOT EXISTS beauty_gesundheit_art TEXT;
