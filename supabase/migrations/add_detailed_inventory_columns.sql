-- Migration: Add detailed fields to inventory_items
-- Run this in the Supabase Dashboard -> SQL Editor

ALTER TABLE inventory_items
ADD COLUMN item_code TEXT,
ADD COLUMN box_size JSONB,
ADD COLUMN top_paper TEXT,
ADD COLUMN liner TEXT,
ADD COLUMN ply TEXT,
ADD COLUMN gsm TEXT,
ADD COLUMN cutting_size TEXT,
ADD COLUMN decal_size TEXT,
ADD COLUMN printing TEXT,
ADD COLUMN stitching BOOLEAN;
