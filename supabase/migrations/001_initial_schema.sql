-- =============================================================
-- LibratoAi — Initial Schema
-- Migration: 001_initial_schema.sql
-- =============================================================

-- =============================================================
-- TABLES
-- =============================================================

-- -------------------------------------------------------------
-- profiles
-- One row per auth.users entry. Auto-created on signup via trigger.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id                    UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name             TEXT,
  display_name          TEXT,
  timezone              TEXT        NOT NULL DEFAULT 'UTC',
  onboarding_completed  BOOLEAN     NOT NULL DEFAULT false,
  subscription_tier     TEXT        NOT NULL DEFAULT 'free'
                          CHECK (subscription_tier IN ('free', 'premium')),
  subscription_source   TEXT        NOT NULL DEFAULT 'stripe'
                          CHECK (subscription_source IN ('stripe', 'apple', 'google')),
  stripe_customer_id    TEXT,
  apple_receipt         TEXT,
  google_purchase_token TEXT,
  expo_push_token       TEXT,
  daily_moment_time     TEXT        NOT NULL DEFAULT '08:00',
  trial_started_at      TIMESTAMPTZ,
  trial_ended           BOOLEAN     NOT NULL DEFAULT false,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE profiles IS 'Extended user profile data, one row per auth.users entry.';

-- -------------------------------------------------------------
-- sessions
-- A single discernment journey initiated by a user.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sessions (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  situation             TEXT        NOT NULL,
  tone                  TEXT        NOT NULL DEFAULT 'reflective'
                          CHECK (tone IN ('reflective', 'urgent', 'encouragement', 'lament')),
  ai_response           JSONB,
  stillness_note        TEXT,
  status                TEXT        NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'completed', 'archived')),
  follow_up_1w_sent     BOOLEAN     NOT NULL DEFAULT false,
  follow_up_1m_sent     BOOLEAN     NOT NULL DEFAULT false,
  follow_up_3m_sent     BOOLEAN     NOT NULL DEFAULT false,
  follow_up_1w_response TEXT,
  follow_up_1m_response TEXT,
  follow_up_3m_response TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at          TIMESTAMPTZ
);

COMMENT ON TABLE sessions  IS 'Discernment sessions. ai_response stores the full DiscernmentResponse JSON.';
COMMENT ON COLUMN sessions.tone IS 'Tone the user selected: reflective | urgent | encouragement | lament';
COMMENT ON COLUMN sessions.ai_response IS 'Full DiscernmentResponse JSON from Claude — scriptures, narratives, examination, fruit, prayer.';

-- -------------------------------------------------------------
-- journal_entries
-- User-facing journal records. Most created automatically from sessions.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS journal_entries (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id  UUID        REFERENCES sessions(id) ON DELETE SET NULL,
  title       TEXT,
  content     TEXT,
  entry_type  TEXT        NOT NULL DEFAULT 'discernment'
                CHECK (entry_type IN ('discernment', 'reflection', 'answered_prayer', 'god_showed_up')),
  tags        TEXT[]      NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE journal_entries IS 'Immutable journal records. Discernment entries are auto-created; reflection entries are manual.';

-- -------------------------------------------------------------
-- subscriptions
-- One row per user. Server-written only (webhooks + IAP validation).
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id  TEXT,
  apple_transaction_id    TEXT,
  google_order_id         TEXT,
  tier                    TEXT        NOT NULL DEFAULT 'free'
                            CHECK (tier IN ('free', 'premium')),
  billing_interval        TEXT        NOT NULL DEFAULT 'month'
                            CHECK (billing_interval IN ('month', 'year')),
  source                  TEXT        NOT NULL DEFAULT 'stripe'
                            CHECK (source IN ('stripe', 'apple', 'google')),
  status                  TEXT        NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  sessions_used_this_month INTEGER    NOT NULL DEFAULT 0,
  sessions_limit          INTEGER     NOT NULL DEFAULT 1,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE subscriptions IS 'Subscription state. Written by server-side webhook handlers and IAP validation endpoints only.';

-- -------------------------------------------------------------
-- daily_moments
-- One row per calendar date. Pre-populated by admin/cron.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS daily_moments (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  date                DATE        UNIQUE NOT NULL,
  scripture_reference TEXT        NOT NULL,
  scripture_text      TEXT        NOT NULL,
  reflection_prompt   TEXT        NOT NULL,
  prayer              TEXT        NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE daily_moments IS 'Daily devotional content. One row per calendar date. All authenticated users can read.';

-- =============================================================
-- INDEXES
-- =============================================================

CREATE INDEX IF NOT EXISTS idx_sessions_user_id    ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_status     ON sessions(status);

CREATE INDEX IF NOT EXISTS idx_journal_user_id     ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_created_at  ON journal_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journal_session_id  ON journal_entries(session_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_daily_moments_date  ON daily_moments(date);

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================

ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_moments  ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- profiles policies
-- -------------------------------------------------------------
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- -------------------------------------------------------------
-- sessions policies
-- -------------------------------------------------------------
CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- -------------------------------------------------------------
-- journal_entries policies
-- -------------------------------------------------------------
CREATE POLICY "Users can view own journal"
  ON journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create journal entries"
  ON journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal"
  ON journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal"
  ON journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- -------------------------------------------------------------
-- subscriptions policies (read-only for users; server writes via service role)
-- -------------------------------------------------------------
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- -------------------------------------------------------------
-- daily_moments policies (all authenticated users can read)
-- -------------------------------------------------------------
CREATE POLICY "Authenticated users can view daily moments"
  ON daily_moments FOR SELECT
  USING (auth.role() = 'authenticated');

-- =============================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================

-- -------------------------------------------------------------
-- handle_new_user()
-- Auto-creates profile + free subscription row on signup.
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile row
  INSERT INTO public.profiles (id, full_name, trial_started_at)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    now()
  );

  -- Create free subscription with trial (all features, 7-day window)
  INSERT INTO public.subscriptions (
    user_id,
    tier,
    status,
    sessions_limit,
    billing_interval
  )
  VALUES (
    new.id,
    'free',
    'trialing',
    9999,
    'month'
  );

  RETURN new;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- -------------------------------------------------------------
-- update_updated_at()
-- Keeps profiles.updated_at current on every row update.
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- -------------------------------------------------------------
-- reset_monthly_sessions()
-- Resets session counters. Call via Supabase cron on the 1st of each month:
--   select cron.schedule('reset-monthly-sessions', '0 0 1 * *', 'select public.reset_monthly_sessions()');
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.reset_monthly_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.subscriptions
  SET sessions_used_this_month = 0;
END;
$$;
