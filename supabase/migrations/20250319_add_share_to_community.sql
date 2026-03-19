-- Migration to add share to community functionality
-- Run this in Supabase SQL Editor

-- Add is_public and shared_at columns to generated_icons table
ALTER TABLE generated_icons
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS shared_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Add user_id column if it doesn't exist (based on generate route usage)
ALTER TABLE generated_icons
  ADD COLUMN IF NOT EXISTS user_id UUID NOT NULL DEFAULT uuid_generate_v4();

-- Add prompt column if it doesn't exist (used in generate route)
ALTER TABLE generated_icons
  ADD COLUMN IF NOT EXISTS prompt TEXT;

-- Add style column if it doesn't exist (used in generate route)
ALTER TABLE generated_icons
  ADD COLUMN IF NOT EXISTS style VARCHAR(50);

-- Add png_key and svg_key columns if they don't exist
ALTER TABLE generated_icons
  ADD COLUMN IF NOT EXISTS png_key TEXT,
  ADD COLUMN IF NOT EXISTS svg_key TEXT;

-- Create index on is_public for community queries
CREATE INDEX IF NOT EXISTS idx_generated_icons_is_public ON generated_icons(is_public);
CREATE INDEX IF NOT EXISTS idx_generated_icons_user_id ON generated_icons(user_id);

-- Update RLS policy to allow viewing public icons
DROP POLICY IF EXISTS "Anyone can view public icons" ON generated_icons;

CREATE POLICY "Anyone can view public icons" ON generated_icons
  FOR SELECT USING (is_public = true);
