/**
 * One-time: classify each seeded daily_scale into a territory (topic family)
 * from the fixed taxonomy (scale-pipeline-spec §9), for founder confirmation
 * BEFORE the migration backfills territory tags. Read-only against the DB.
 *
 * Run: cd web && npx tsx scripts/classify-territories.ts
 */
import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const TERRITORIES = [
  'peace-vs-truth',
  'forgiveness',
  'money-stewardship',
  'ambition-calling',
  'faith-vs-planning',
  'mercy-vs-justice',
  'community-vs-conviction',
  'rest-vs-diligence',
  'contentment-vs-growth',
  'boldness-vs-patience',
  'suffering-healing',
  'doubt-certainty',
  'family-boundaries',
  'witness-relationships',
] as const;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.ANTHROPIC_MODEL_FREE ?? 'claude-sonnet-5';

async function main() {
  const { data: scales, error } = await supabase
    .from('daily_scales')
    .select('id, date, question, side_a_label, side_b_label')
    .order('date', { ascending: true });
  if (error || !scales?.length) {
    console.error('Could not read daily_scales:', error?.message);
    process.exit(1);
  }

  const list = scales
    .map((s, i) => `${i}. "${s.question}" [${s.side_a_label} vs ${s.side_b_label}]`)
    .join('\n');

  const system = `You classify spiritual-discernment questions into ONE topic territory each.
Territories (use EXACTLY one of these slugs): ${TERRITORIES.join(', ')}.
Return ONLY a JSON array of objects {"index": number, "territory": string} — one per question, using the provided index. No prose.`;

  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    thinking: { type: 'disabled' },
    system,
    messages: [{ role: 'user', content: `Classify these ${scales.length} questions:\n\n${list}` }],
  });

  const textBlock = msg.content.find((b) => b.type === 'text');
  const text = textBlock && textBlock.type === 'text' ? textBlock.text : '';
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start < 0 || end < 0) {
    console.error('No JSON array in model response. Raw:', text.slice(0, 300));
    process.exit(1);
  }
  const json = text.slice(start, end + 1);
  const picks = JSON.parse(json) as { index: number; territory: string }[];

  const byIndex = new Map(picks.map((p) => [p.index, p.territory]));
  const rows = scales.map((s, i) => {
    let territory = byIndex.get(i) ?? '';
    if (!TERRITORIES.includes(territory as (typeof TERRITORIES)[number])) territory = 'faith-vs-planning';
    return { id: s.id, date: s.date, territory, question: s.question };
  });

  // Print for review
  console.log('\n=== Proposed territory tags (confirm before migration) ===\n');
  const counts: Record<string, number> = {};
  for (const r of rows) {
    counts[r.territory] = (counts[r.territory] ?? 0) + 1;
    console.log(`${r.date}  ${r.territory.padEnd(24)}  ${r.question.slice(0, 62)}`);
  }
  console.log('\n=== Distribution ===');
  for (const [t, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(`  ${n}x  ${t}`);

  // Write a mapping the migration can consume (id -> territory)
  const out = resolve(process.cwd(), 'scripts', 'territories.json');
  writeFileSync(out, JSON.stringify(rows.map(({ id, territory }) => ({ id, territory })), null, 2));
  console.log(`\nWrote ${rows.length} mappings to ${out}`);
}

main();
