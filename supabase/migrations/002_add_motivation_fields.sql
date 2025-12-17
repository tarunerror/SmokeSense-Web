-- Add motivation fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS motivation_reason TEXT,
ADD COLUMN IF NOT EXISTS motivation_image TEXT; -- Storing base64 string (max 1MB limit enforced by frontend)
