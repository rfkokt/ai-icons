-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Icon Packs table
CREATE TABLE icon_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  theme TEXT NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated Icons table
CREATE TABLE generated_icons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  pack_id UUID REFERENCES icon_packs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  prompt TEXT,
  style VARCHAR(50),
  svg_content TEXT,
  svg_url TEXT,
  svg_key TEXT,
  png_url TEXT,
  png_key TEXT,
  format VARCHAR(10) DEFAULT 'both',
  is_public BOOLEAN DEFAULT FALSE,
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE icon_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_icons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for icon_packs
CREATE POLICY "Users can view their own packs" ON icon_packs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create packs" ON icon_packs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own packs" ON icon_packs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own packs" ON icon_packs
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public packs" ON icon_packs
  FOR SELECT USING (is_public = true);

-- RLS Policies for generated_icons
CREATE POLICY "Users can view their own icons" ON generated_icons
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public icons" ON generated_icons
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create icons" ON generated_icons
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own icons" ON generated_icons
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own icons" ON generated_icons
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_icon_packs_user_id ON icon_packs(user_id);
CREATE INDEX idx_icon_packs_is_public ON icon_packs(is_public);
CREATE INDEX idx_generated_icons_pack_id ON generated_icons(pack_id);
CREATE INDEX idx_generated_icons_user_id ON generated_icons(user_id);
CREATE INDEX idx_generated_icons_is_public ON generated_icons(is_public);
