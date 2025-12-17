-- SmokeSense Database Schema
-- Run this in the Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profile extension
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  pin_hash TEXT,
  app_disguise_enabled BOOLEAN DEFAULT false,
  disguise_name TEXT DEFAULT 'Notes',
  phase TEXT DEFAULT 'awareness' CHECK (phase IN ('awareness', 'control', 'reduction')),
  daily_budget INTEGER,
  cigarette_price DECIMAL(10,2) DEFAULT 15.00,
  currency TEXT DEFAULT 'INR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cigarette logs
CREATE TABLE IF NOT EXISTS cigarette_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  mood TEXT,
  activity TEXT,
  location TEXT,
  was_delayed BOOLEAN DEFAULT false,
  delay_duration INTEGER, -- seconds
  notes TEXT,
  synced BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger patterns (analyzed)
CREATE TABLE IF NOT EXISTS trigger_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  trigger_type TEXT NOT NULL,
  description TEXT,
  frequency INTEGER DEFAULT 1,
  last_occurred TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reduction goals
CREATE TABLE IF NOT EXISTS reduction_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  target_daily INTEGER,
  start_date DATE,
  end_date DATE,
  strategy TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cigarette_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE trigger_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE reduction_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for cigarette_logs
DROP POLICY IF EXISTS "Users can view own logs" ON cigarette_logs;
CREATE POLICY "Users can view own logs" ON cigarette_logs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own logs" ON cigarette_logs;
CREATE POLICY "Users can insert own logs" ON cigarette_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own logs" ON cigarette_logs;
CREATE POLICY "Users can update own logs" ON cigarette_logs
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own logs" ON cigarette_logs;
CREATE POLICY "Users can delete own logs" ON cigarette_logs
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for trigger_patterns
DROP POLICY IF EXISTS "Users can manage own triggers" ON trigger_patterns;
CREATE POLICY "Users can manage own triggers" ON trigger_patterns
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for reduction_goals
DROP POLICY IF EXISTS "Users can manage own goals" ON reduction_goals;
CREATE POLICY "Users can manage own goals" ON reduction_goals
  FOR ALL USING (auth.uid() = user_id);

-- Enable realtime for cigarette_logs
ALTER PUBLICATION supabase_realtime ADD TABLE cigarette_logs;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cigarette_logs_user_logged 
  ON cigarette_logs(user_id, logged_at DESC);

CREATE INDEX IF NOT EXISTS idx_cigarette_logs_logged_at 
  ON cigarette_logs(logged_at DESC);

CREATE INDEX IF NOT EXISTS idx_trigger_patterns_user 
  ON trigger_patterns(user_id);

CREATE INDEX IF NOT EXISTS idx_reduction_goals_user_active 
  ON reduction_goals(user_id, is_active);

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
