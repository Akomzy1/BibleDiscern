-- ============================================================================
-- 006: Daily Scale publishing lifecycle (PRD §4.1 — the structural no-repeat guarantee)
-- Idempotent & safe to run once on the live daily_scales table.
-- ============================================================================

-- 1. published_date replaces v1's 'date' (nullable — Postgres allows many NULLs
--    under the existing UNIQUE, so the approved pool can sit unpublished).
--    Guarded so the migration is safe to re-run after a partial application.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name = 'daily_scales' AND column_name = 'date') THEN
    ALTER TABLE daily_scales RENAME COLUMN date TO published_date;
  END IF;
END $$;
ALTER TABLE daily_scales ALTER COLUMN published_date DROP NOT NULL;

-- 2. Lifecycle columns.
ALTER TABLE daily_scales ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved'
  CHECK (status IN ('draft','approved','scheduled','published','retired'));
ALTER TABLE daily_scales ADD COLUMN IF NOT EXISTS territory TEXT;
ALTER TABLE daily_scales ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'seeded'
  CHECK (source IN ('seeded','manual','generated'));
ALTER TABLE daily_scales ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- 3. Backfill the 30 seeded rows into the lifecycle:
--    past/today -> published, future -> scheduled (pinned), null -> approved.
UPDATE daily_scales SET
  status = CASE
    WHEN published_date IS NULL       THEN 'approved'
    WHEN published_date <= CURRENT_DATE THEN 'published'
    ELSE 'scheduled'
  END,
  approved_at = COALESCE(approved_at, created_at),
  source = COALESCE(source, 'seeded');

-- 4. Confirmed territory tags (AI-classified, founder-approved).
UPDATE daily_scales SET territory = 'doubt-certainty' WHERE id = 'fc4f9b4f-aba9-4702-95b8-924e9172c258';
UPDATE daily_scales SET territory = 'peace-vs-truth' WHERE id = '53aa0573-09ee-45e9-800e-c0a907032f5e';
UPDATE daily_scales SET territory = 'faith-vs-planning' WHERE id = 'b678d7b6-08d2-4c80-8abc-59790c8ab916';
UPDATE daily_scales SET territory = 'faith-vs-planning' WHERE id = '0d530632-bcb1-4fe1-a0a7-c72a56d7b6bc';
UPDATE daily_scales SET territory = 'forgiveness' WHERE id = 'e1ae1963-7786-4bb9-9330-9033614dadd6';
UPDATE daily_scales SET territory = 'ambition-calling' WHERE id = '74b6d419-ca4b-4105-813d-5d6544cc302b';
UPDATE daily_scales SET territory = 'doubt-certainty' WHERE id = 'e47b8809-ee52-423e-b9f7-d7dc5cdaafad';
UPDATE daily_scales SET territory = 'witness-relationships' WHERE id = '4ae139b5-4456-4fca-908b-9f5e92de224f';
UPDATE daily_scales SET territory = 'doubt-certainty' WHERE id = 'a7f34382-bcb0-4953-a09d-dca5be6b2da1';
UPDATE daily_scales SET territory = 'ambition-calling' WHERE id = '750e85bd-1ba2-49ae-94ec-4468a5cfdbf7';
UPDATE daily_scales SET territory = 'doubt-certainty' WHERE id = 'f7d5fae0-796a-45ae-9d8a-bb610d22c214';
UPDATE daily_scales SET territory = 'suffering-healing' WHERE id = '7eef1a56-0b8e-4392-bd1e-157acebbdba9';
UPDATE daily_scales SET territory = 'ambition-calling' WHERE id = 'dcbf8475-cde0-4ba8-8219-efef15350fdd';
UPDATE daily_scales SET territory = 'money-stewardship' WHERE id = '91b897cf-efa8-4ce4-9847-f021ee1a071d';
UPDATE daily_scales SET territory = 'community-vs-conviction' WHERE id = 'a2643ade-cd8b-478a-8980-b0c523d9d7cd';
UPDATE daily_scales SET territory = 'doubt-certainty' WHERE id = '4e88c045-69ad-41e9-8856-a0a1cd714380';
UPDATE daily_scales SET territory = 'mercy-vs-justice' WHERE id = 'ca5b3d11-26ac-4e2c-8c49-f4be346040ff';
UPDATE daily_scales SET territory = 'faith-vs-planning' WHERE id = '8e212932-cc13-44ab-bd1a-2f2165a10657';
UPDATE daily_scales SET territory = 'rest-vs-diligence' WHERE id = 'a5ce4b29-a6b2-4b11-bd64-00667150a778';
UPDATE daily_scales SET territory = 'community-vs-conviction' WHERE id = 'b1003682-58f8-46e3-bc46-48506ab9144b';
UPDATE daily_scales SET territory = 'peace-vs-truth' WHERE id = '316e8223-68e3-4965-8776-7316bcb0e5aa';
UPDATE daily_scales SET territory = 'contentment-vs-growth' WHERE id = '7899758b-6a57-4cf1-8f4a-5284fbcf16a0';
UPDATE daily_scales SET territory = 'rest-vs-diligence' WHERE id = '9a056214-f89c-4dad-ba62-78e9df48d4de';
UPDATE daily_scales SET territory = 'contentment-vs-growth' WHERE id = '84ba6c79-b9b7-42d9-9d3e-ad439522c981';
UPDATE daily_scales SET territory = 'forgiveness' WHERE id = '16141657-6dfc-4c6f-9095-b5acc659883f';
UPDATE daily_scales SET territory = 'suffering-healing' WHERE id = 'c95549ea-2220-4248-9672-489e6c3b14de';
UPDATE daily_scales SET territory = 'ambition-calling' WHERE id = '54b8067c-f907-4531-ad61-b334f9754601';
UPDATE daily_scales SET territory = 'family-boundaries' WHERE id = '72ce5fb6-7698-4d39-ade2-3b18c2b37ba4';
UPDATE daily_scales SET territory = 'faith-vs-planning' WHERE id = '6ac36f84-874f-47b6-be65-846064891a55';
UPDATE daily_scales SET territory = 'doubt-certainty' WHERE id = 'f2c99128-d9cd-4878-b759-6b58970abe46';

-- 5. Indexes for the selector.
CREATE INDEX IF NOT EXISTS idx_daily_scales_status    ON daily_scales(status);
CREATE INDEX IF NOT EXISTS idx_daily_scales_territory ON daily_scales(territory);
CREATE INDEX IF NOT EXISTS idx_daily_scales_pub_status ON daily_scales(status, published_date);

-- 6. RLS: clients may read PUBLISHED rows only (draft/approved/scheduled/retired
--    are server-side, reached via the service role).
DROP POLICY IF EXISTS "Authenticated users can view daily scales" ON daily_scales;
DROP POLICY IF EXISTS "Authenticated users can view published scales" ON daily_scales;
CREATE POLICY "Authenticated users can view published scales"
  ON daily_scales FOR SELECT
  USING (auth.role() = 'authenticated' AND status = 'published');

-- 7. Refresh the REST API schema cache.
NOTIFY pgrst, 'reload schema';

-- 8. Confirm (expect the lifecycle columns + a status breakdown).
SELECT status, count(*) FROM daily_scales GROUP BY status ORDER BY status;
