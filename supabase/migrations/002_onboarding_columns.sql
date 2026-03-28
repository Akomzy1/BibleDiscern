-- Add onboarding-specific columns to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS onboarding_season TEXT,
  ADD COLUMN IF NOT EXISTS daily_scale_time   TEXT DEFAULT '08:00';
