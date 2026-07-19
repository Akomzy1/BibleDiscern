// Generates supabase/migrations/006_daily_scale_lifecycle.sql from the confirmed
// territory mapping. Run: cd web && node scripts/gen-migration-006.mjs
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const mapping = JSON.parse(readFileSync(resolve(process.cwd(), 'scripts', 'territories.json'), 'utf8'));
const updates = mapping
  .map((m) => `UPDATE daily_scales SET territory = '${m.territory}' WHERE id = '${m.id}';`)
  .join('\n');

const sql = `-- ============================================================================
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
${updates}

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
`;

const out = resolve(process.cwd(), '..', 'supabase', 'migrations', '006_daily_scale_lifecycle.sql');
writeFileSync(out, sql);
console.log('Wrote', out, `(${mapping.length} territory updates)`);
