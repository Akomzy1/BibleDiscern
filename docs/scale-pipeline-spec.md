# BibleDiscern — AI Scale-Generation Pipeline
### Post-Launch Update Spec (v1.0)

**Status:** Specified, NOT in the Phase 1 build. The scheduling substrate it feeds (status lifecycle, `published_date` no-repeat guarantee, territory spacing, inventory alerts) **ships in Phase 1** — see PRD §4.1 and Build Prompts Stage 1, task 7.
**Build trigger:** whichever comes first — the approved pool dropping below **21** (the warning alert), or three weeks after launch. At 30 seeded scales this arrives fast; do not wait for the critical alert.
**Effort:** ~2–3 focused days on the existing stack.

---

## 1. The Problem

The Daily Scale consumes exactly one question per day, forever. Thirty seeded scales is one month of runway. Hand-writing a theologically balanced tension every morning makes the founder the single point of failure for the product's core habit loop. Worse than running out is *degrading*: a forced tension (one side obviously right, Scripture stretched) discourages the community faster than any repeat would.

So the pipeline optimizes for two things in this order: **quality** (via a mandatory human gate) and **volume** (via generation + territory targeting). Repeats are already impossible at the database layer — that guarantee ships in Phase 1 and this pipeline simply keeps the approved pool fed.

## 2. The Substrate This Feeds (already shipped in Phase 1 — recap)

`daily_scales` lifecycle: `draft → approved → published → retired`, plus `scheduled` for manually pinned dates. `published_date` is nullable-UNIQUE and stamped exactly once by the daily selector, which excludes anything already stamped (structural no-repeat), refuses same-`territory` back-to-back days, rotates least-recently-used territories, and alerts via Resend when `approved` inventory < 21 (warning) / < 7 (critical). Clients can only ever read `published` rows.

This spec adds the **left side of that funnel**: `generated → deduped → draft → human review → approved`.

## 3. Pipeline Overview

```
[weekly cron OR manual "Generate batch" button]
        │
        ▼
Claude generates 10 candidates
(structured JSON, territory-targeted,
existing questions injected as exclusions)
        │
        ▼
Near-duplicate guard (pg_trgm vs ALL existing questions, any status)
   reject ≥ threshold → discarded with reason logged
        │
        ▼
INSERT as status='draft', source='generated'
        │
        ▼
/admin/scales review surface  ←— THE GATE. NOTHING AUTO-PUBLISHES. EVER.
   Approve (→ approved, approved_at=now)  |  Edit then approve  |  Reject (→ retired)
        │
        ▼
Approved pool → the existing daily selector publishes as normal
```

## 4. Generation Job

- **Trigger:** weekly Vercel cron (e.g., Monday 06:00) *and* a manual "Generate batch" button on `/admin/scales`. The cron only runs when approved inventory < 28 (no point overfilling).
- **Batch size:** 10 candidates per run. Expect to approve 5–8 after review; that sustains a weekly cadence with margin.
- **Territory targeting:** before generating, compute territory counts across `approved` + recently-`published` rows; instruct the model to draw from the 3–4 *least-represented* territories. This is what keeps the feed from clustering ("three money questions this week").
- **Model:** the same Anthropic integration the app already uses; a batch of 10 costs pennies — cost is a non-issue.
- **Output contract:** strict JSON array matching the table shape (schema in §5). Zod-validate before anything touches the database; malformed items are dropped and logged, never "fixed" silently.

## 5. The Generation Prompt (ready to use)

System prompt for the generation call:

```
You generate candidate questions for "The Daily Scale" — a daily feature in BibleDiscern, a Christian discernment app. Each scale presents ONE spiritual tension where thoughtful, faithful Christians genuinely disagree AND where Scripture gives real support to both sides.

You will produce {N} candidates as a JSON array. Each object:
{
  "question": string,        // ≤ 90 chars, phrased as a genuine either/or tension, no leading bias
  "territory": string,       // one of the provided territory list
  "side_a_label": string,    // ≤ 5 words
  "side_a_argument": string, // 1–2 sentences, the STRONGEST honest case, may cite scripture inline
  "side_b_label": string,
  "side_b_argument": string,
  "scripture_reference": string, // the reference(s) the lens draws on, e.g. "Matthew 5:9 & Matthew 10:34"
  "scripture_text": string,      // the key verse text, one translation, brief
  "scripture_lens": string,      // 3–4 sentences. Shows how Scripture holds BOTH truths in tension.
                                  // NEVER declares a winner. NEVER says one side "is right".
  "prayer": string               // 1–2 sentences, first person, reverent, names the tension
}

HARD RULES:
1. Both sides must have genuine biblical support. If one side is a strawman or obviously wrong, discard the idea and produce a different one.
2. The lens never resolves the tension — the tension IS the discernment.
3. No political-party framings, no denominational attacks, no salvation-status judgments of either side.
4. Reverent, plain language. No jargon, no "unlock/seamless/elevate", no exclamation marks.
5. Draw only from these territories for this batch: {TARGET_TERRITORIES}.
6. Do NOT produce a question that is the same as, or a close paraphrase of, ANY question in this exclusion list: {ALL_EXISTING_QUESTIONS}. Same underlying tension in new words counts as a duplicate — produce genuinely new tensions.

Return ONLY the JSON array.
```

`{ALL_EXISTING_QUESTIONS}` = every question string in `daily_scales`, any status, including `retired` (a rejected duplicate must not be re-proposed). At a few hundred scales this is a trivially small injection; revisit only if it ever grows past ~2,000.

## 6. Near-Duplicate Guard (defense in depth)

The prompt-side exclusion list is the first line; the database is the second:

- Enable `pg_trgm`. On insert of each candidate, compute `similarity(candidate.question, existing.question)` against **all** existing questions (any status).
- **Reject at ≥ 0.60 similarity**; log the collision (candidate, matched question, score) so threshold tuning has data. Start at 0.60; expect to tune within 0.50–0.65 after the first few batches — this threshold is a starting estimate, not a law.
- Rejected candidates are discarded, not stored (they never reach draft).
- Optional hardening later: embedding-based semantic similarity if trigram misses reworded twins in practice. Don't build it until trigram demonstrably fails.

## 7. The Review Gate (non-negotiable)

- `/admin/scales` — a route-protected page (allowlist by admin email in env: `ADMIN_EMAILS`), server-checked, inside the existing app. Not fancy: a list of `draft` rows, newest first.
- Each row: full preview (question, both sides, lens, prayer, territory) rendered in the actual DailyScale LEARN styling so quality is judged as users will see it · inline **Edit** (all fields) · **Approve** (→ `approved`, `approved_at = now()`) · **Reject** (→ `retired`, with an optional one-line reason stored for prompt-tuning).
- A small inventory header: approved count, days of runway, territory distribution bar.
- **The invariant, restated because it is the whole point:** no path exists from `generated` to `published` that does not pass a human Approve click. If the founder is unavailable and inventory hits zero, the correct behavior is the critical alert firing — not silent auto-publish. Quality failure is worse than a gap.
- Review rhythm: one sitting per week, ~30–60 minutes for a batch of 10.

## 8. Alerts (already live from Phase 1; the pipeline adds context)

- < 21 approved: warning email — "Generate and review a batch this week."
- < 7 approved: critical email — daily until resolved.
- Pipeline additions: batch-completed email (n generated, n rejected as duplicates, link to review), and a weekly digest line with territory distribution.

## 9. Starter Territory Taxonomy

Seed the `territory` vocabulary with (extend freely; keep tags stable once used):

`peace-vs-truth` · `forgiveness` · `money-stewardship` · `ambition-calling` · `faith-vs-planning` · `mercy-vs-justice` · `community-vs-conviction` · `rest-vs-diligence` · `contentment-vs-growth` · `boldness-vs-patience` · `suffering-healing` · `doubt-certainty` · `family-boundaries` · `witness-relationships`

Fourteen territories × even a conservative 15 quality tensions each ≈ 200+ scales before the space feels thin — and that estimate is deliberately rough; the real constraint discovered in practice will be review-time quality, not raw idea count.

## 10. Reserved for Later — Spaced Revisits (Layer 3)

Not built now; designed so nothing blocks it later:

- Reserve a nullable `revisit_of UUID REFERENCES daily_scales(id)` column (add it in the pipeline migration; costs nothing).
- Concept: 6+ months after a great scale published, a *revisit* row may be created referencing the original — published through the normal selector (its own `published_date`, so the no-repeat constraint is untouched), but **framed honestly in the UI**: "We asked this before. The community said 62/38. Where do you stand now?" — and, for the individual, their own previous vote shown after they weigh in again.
- This converts repetition from the failure mode the community would resent into a growth mirror ("has my discernment changed?") — but only works with real history and real users, which is why it waits.

## 11. Build Plan (~2–3 days when triggered)

Day 1: migration (`revisit_of`, pg_trgm, rejection log table) · generation job + Zod contract · dedupe guard.
Day 2: `/admin/scales` review surface with the LEARN-styled preview, approve/edit/reject, inventory header.
Day 3: cron + manual trigger wiring, alert additions, threshold logging, first live batch reviewed end-to-end.

## 12. Risks

| Risk | Mitigation |
|---|---|
| Quality drift in generated tensions | The human gate; rejection reasons feed prompt tuning; preview rendered in real product styling so weak lenses are obvious |
| Trigram misses reworded duplicates | Prompt-side exclusion list catches most; collision logging shows the miss rate; embeddings only if data proves the need |
| Founder becomes the review bottleneck | 30–60 min/week at batch size 10; later, a trusted second reviewer via the same allowlist |
| Threshold too aggressive (rejects genuinely new tensions) | Start 0.60, tune from the collision log — rejected candidates are logged with scores precisely for this |
| Territory tags drift/synonymize | Fixed vocabulary in shared constants; the admin UI offers a picker, never free text |
