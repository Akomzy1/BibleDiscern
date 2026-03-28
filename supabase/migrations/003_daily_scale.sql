-- Daily Scale: the daily discernment exercise
-- Replaces the simpler daily_moments with a 3-phase vote-and-reveal mechanic

CREATE TABLE daily_scales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,

  -- The question
  question TEXT NOT NULL,

  -- Side A
  side_a_label TEXT NOT NULL,
  side_a_argument TEXT NOT NULL,

  -- Side B
  side_b_label TEXT NOT NULL,
  side_b_argument TEXT NOT NULL,

  -- Scripture Lens (revealed after voting)
  scripture_reference TEXT NOT NULL DEFAULT '',
  scripture_text TEXT NOT NULL DEFAULT '',
  scripture_lens TEXT NOT NULL DEFAULT '',

  -- Closing prayer
  prayer TEXT NOT NULL DEFAULT '',

  -- Aggregate vote counts (atomically incremented by API)
  votes_a INTEGER NOT NULL DEFAULT 0,
  votes_b INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User votes (one per user per daily scale)
CREATE TABLE daily_scale_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scale_id UUID NOT NULL REFERENCES daily_scales(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('a', 'b')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, scale_id)
);

-- Performance indexes
CREATE INDEX idx_daily_scales_date ON daily_scales (date);
CREATE INDEX idx_daily_scale_votes_user ON daily_scale_votes (user_id);
CREATE INDEX idx_daily_scale_votes_scale ON daily_scale_votes (scale_id);

-- Row-level security
ALTER TABLE daily_scales ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_scale_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view daily scales"
  ON daily_scales FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view own votes"
  ON daily_scale_votes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own votes"
  ON daily_scale_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);
