-- ============================================================================
-- 007: Feedback capture (launch-month insight)
-- Aggregate ratings + short messages. NEVER stores discernment/journal content.
-- Idempotent & safe to run once.
-- ============================================================================

CREATE TABLE IF NOT EXISTS feedback (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source     TEXT NOT NULL CHECK (source IN ('post_journey', 'settings', 'prompt')),
  rating     SMALLINT CHECK (rating BETWEEN 1 AND 5),
  message    TEXT CHECK (message IS NULL OR char_length(message) <= 2000)
);

CREATE INDEX IF NOT EXISTS idx_feedback_user_id    ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);

-- RLS: a user may INSERT and SELECT only their own rows. No UPDATE/DELETE policy
-- exists, so clients cannot mutate or remove feedback. The service role (admin)
-- bypasses RLS to read all.
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own feedback" ON feedback;
CREATE POLICY "Users can insert own feedback"
  ON feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own feedback" ON feedback;
CREATE POLICY "Users can read own feedback"
  ON feedback FOR SELECT
  USING (auth.uid() = user_id);

-- Refresh the REST API schema cache.
NOTIFY pgrst, 'reload schema';
