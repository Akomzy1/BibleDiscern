-- v2 (PWA): public SEO archive — every past scale gets a stable slug for
-- /scale/[slug]. Additive only.

ALTER TABLE daily_scales ADD COLUMN IF NOT EXISTS slug TEXT;

UPDATE daily_scales
SET slug = left(trim(both '-' from lower(regexp_replace(question, '[^a-zA-Z0-9]+', '-', 'g'))), 80)
           || '-' || to_char(date, 'YYYY-MM-DD')
WHERE slug IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_scales_slug ON daily_scales(slug);
