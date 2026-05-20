
/*
  # Quran Companion AI - Initial Schema

  ## Overview
  Creates all tables required for the Quran Companion AI app.

  ## New Tables

  ### profiles
  - Extended user data linked to auth.users
  - Stores display name, avatar, language, reciter preference, streak, total points

  ### bookmarks
  - Stores user-bookmarked ayahs with optional notes
  - Columns: user_id, surah_number, ayah_number, note, created_at

  ### favorites
  - Stores user-favorited ayahs
  - Columns: user_id, surah_number, ayah_number, created_at

  ### recitation_sessions
  - Logs each recitation attempt with accuracy score and feedback
  - Columns: user_id, surah_number, ayah_number, accuracy_score, tajwid_feedback, mistakes_json, audio_url, created_at

  ### memorization_progress
  - Tracks which ayahs a user has memorized
  - Columns: user_id, surah_number, ayah_number, status (learning/memorized/reviewing), last_practiced, streak_count

  ### daily_goals
  - Stores per-user daily goals and completion status
  - Columns: user_id, goal_date, target_ayahs, completed_ayahs, is_completed

  ## Security
  - RLS enabled on all tables
  - Authenticated users can only access their own data
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text DEFAULT '',
  avatar_url text DEFAULT '',
  language text DEFAULT 'en',
  reciter text DEFAULT 'mishary_alafasy',
  streak_days integer DEFAULT 0,
  total_points integer DEFAULT 0,
  dark_mode boolean DEFAULT false,
  notifications_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- BOOKMARKS
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  surah_number integer NOT NULL,
  ayah_number integer NOT NULL,
  note text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, surah_number, ayah_number)
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks"
  ON bookmarks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- FAVORITES
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  surah_number integer NOT NULL,
  ayah_number integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, surah_number, ayah_number)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RECITATION SESSIONS
CREATE TABLE IF NOT EXISTS recitation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  surah_number integer NOT NULL,
  ayah_number integer NOT NULL,
  accuracy_score numeric(5,2) DEFAULT 0,
  tajwid_feedback jsonb DEFAULT '[]',
  mistakes_json jsonb DEFAULT '[]',
  audio_url text DEFAULT '',
  duration_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE recitation_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON recitation_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON recitation_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- MEMORIZATION PROGRESS
CREATE TABLE IF NOT EXISTS memorization_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  surah_number integer NOT NULL,
  ayah_number integer NOT NULL,
  status text DEFAULT 'learning' CHECK (status IN ('learning', 'memorized', 'reviewing')),
  last_practiced timestamptz DEFAULT now(),
  streak_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, surah_number, ayah_number)
);

ALTER TABLE memorization_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own memorization"
  ON memorization_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own memorization"
  ON memorization_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own memorization"
  ON memorization_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own memorization"
  ON memorization_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- DAILY GOALS
CREATE TABLE IF NOT EXISTS daily_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_date date DEFAULT CURRENT_DATE,
  target_ayahs integer DEFAULT 5,
  completed_ayahs integer DEFAULT 0,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, goal_date)
);

ALTER TABLE daily_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals"
  ON daily_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON daily_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON daily_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_recitation_sessions_user_id ON recitation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_recitation_sessions_created_at ON recitation_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_memorization_progress_user_id ON memorization_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_goals_user_date ON daily_goals(user_id, goal_date);

-- AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
