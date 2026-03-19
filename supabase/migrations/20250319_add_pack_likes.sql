-- Migration to add pack_likes table for community like functionality
-- Run this in Supabase SQL Editor

-- Create pack_likes table
CREATE TABLE IF NOT EXISTS pack_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pack_id TEXT NOT NULL, -- Using prompt as pack_id for consistency
  user_id TEXT NOT NULL, -- Changed to TEXT to support Clerk user IDs (user_xxx format)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one like per user per pack
  UNIQUE(pack_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pack_likes_pack_id ON pack_likes(pack_id);
CREATE INDEX IF NOT EXISTS idx_pack_likes_user_id ON pack_likes(user_id);

-- Enable RLS
ALTER TABLE pack_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view all likes (needed for count)
CREATE POLICY "Anyone can view likes" ON pack_likes
  FOR SELECT USING (true);

-- Users can insert their own likes (using Clerk user_id from client)
CREATE POLICY "Users can insert own likes" ON pack_likes
  FOR INSERT WITH CHECK (true);

-- Users can delete their own likes (handled in API)
CREATE POLICY "Users can delete own likes" ON pack_likes
  FOR DELETE USING (true);
