# BibleDiscern v2 — Staged Claude Code Build Prompts

Ten stages, run in order — each depends on the one before. Roughly Week 1 = Stages 0–2, Week 2 = Stages 3–5, Week 3 = Stages 6–9.

## How to run every stage

1. Work in the repo root. `CLAUDE.md` and `SKILL.md` sit there and are read automatically.
2. **Attach the relevant Claude Design prototype frames to the session before running a UI stage.** The build translates the prototype — it does not redesign. (See CLAUDE.md → "Prototype Fidelity".)
3. Paste the stage prompt. Let it finish. Run the stage's **Verify** block before moving on.
4. Commit per stage with a conventional message; note which prototype frames the commit implements.

**The rule stamped on every UI stage:** build each screen to match its prototype frame exactly — same layout, same section order, same spacing, and every state the frame shows (selected, locked, blurred, empty, sent, error, offline). Use the Selah tokens/primitives for values and behavior; take arrangement from the prototype. Never invent a section the prototype omits; never skip a state it shows; never redesign during the build. If a screen or state is missing from the prototype, stop and ask — do not improvise.

---

## STAGE 0 — Scaffold + Selah Foundations

*Attach: the Foundations sheet from Claude Design.*

```
Read CLAUDE.md and SKILL.md fully before doing anything.

We are building BibleDiscern v2 — a mobile-first PWA — inside the existing monorepo. Confirm the structure in CLAUDE.md exists; create what's missing. Do NOT touch mobile/ (frozen).

Stage 0 goal: the Selah design foundation, matching the attached Foundations sheet exactly.

1. In packages/shared/src/tokens.ts, create the design tokens exactly as specified in SKILL.md §2 (color, font, radius, motion, giltBorderOnNavy, glowOnNavy). Export from index.ts.
2. Wire web/tailwind.config.ts to consume those tokens (SKILL.md §2). Add motion CSS custom properties to web/styles/globals.css (--ease-selah, --dur-whisper/settle/breath) and the keyframes (beam-sway, stone-settle, breathe).
3. Load fonts via next/font (SKILL.md §4): Playfair Display, Cormorant Garamond (incl. italic), Source Sans 3. Wire the CSS variables.
4. Build the Selah primitives in web/components/selah/, each matching the Foundations sheet: Beam (four states + reduced-motion guard, SKILL.md §5), DropCap/ScriptureBlock (§4), Panel (vellum + navy variants, §6), VellumGrain, CandleGlow (§6), Eyebrow, GiltButton (primary/secondary/text-link with default/hover/pressed/disabled), SideBadge (A and B), TabBar (Today/Discern/Journal/Settings, active/inactive, safe-area insets), and Form field styles (default/focus/error).
5. Create a /foundations dev route that renders every primitive and every token specimen, so I can compare it side by side with the Foundations sheet.

Consume tokens everywhere — zero hardcoded hex, duration, or size in any component. Respect prefers-reduced-motion. Do not build any product screen yet.
```

**Verify:** `/foundations` renders and visually matches the Foundations sheet; The Beam animates and tilts; the drop cap renders; grep the repo for hardcoded hex in `components/selah` (should be none); reduced-motion disables sway.

---

## STAGE 1 — Backend Spine (carried from v1, wired to the single app)

*No prototype needed — this is API/logic.*

```
Read CLAUDE.md. Stage 1 goal: the backend spine, all contracts FROZEN per CLAUDE.md.

1. Supabase clients: browser client (anon) and server client (service role, server-only). Confirm all 7 tables and RLS exist per CLAUDE.md (profiles, sessions, journal_entries, subscriptions, daily_moments, daily_scales, daily_scale_votes). Generate/confirm migrations if missing.
2. In packages/shared: Zod schemas (validation.ts) for every API request/response; domain types (types.ts); the typed api-client.ts. No domain type may live in web/.
3. Implement every API route in CLAUDE.md's table with its exact contract: /api/discern (Claude call), /api/sessions(+[id]), /api/journal(+[id]), /api/profile, /api/subscription, /api/daily-scale, /api/daily-scale/vote, /api/daily-scale/history, /api/webhooks/stripe, /api/og, /api/push/subscribe.
4. /api/discern MUST: run crisis-keyword screening BEFORE any Claude call (return a crisis signal, never forward flagged input); validate with Zod; enforce tier gating (Sonnet free / Opus premium) and 1-session/month free cap; rate-limit 10 req/min/user; attach the permanent disclaimer; never log situation text.
5. Claude integration: use the existing system prompt (Ignatian/Wesleyan discernment, never speaks for God, never directive, Scripture Lens never declares a winner). Model strings via env.
6. Stripe: Checkout session creation (monthly + annual price IDs from env, 7-day trial), Customer Portal link, and the webhook handler syncing subscriptions.source='stripe'. No RevenueCat this phase.
7. Daily Scale scheduling — the NO-REPEAT GUARANTEE (PRD §4.1):
   a. Migration on daily_scales: rename date → published_date (nullable, keep UNIQUE — Postgres allows multiple NULLs); add status TEXT NOT NULL CHECK (status IN ('draft','approved','scheduled','published','retired')); add territory TEXT; add source TEXT NOT NULL DEFAULT 'seeded' CHECK (source IN ('seeded','manual','generated')); add approved_at TIMESTAMPTZ. Backfill seeded rows: published_date <= today → status='published', future → 'scheduled', else 'approved'; approved_at = created_at. Write a one-time script that proposes a territory tag per seeded scale (Claude classify) and outputs it for my confirmation before applying.
   b. Selector function (SQL or server): for a target date with no published scale, pick ONE from status='approved' WHERE published_date IS NULL, refusing the territory published the previous day, preferring least-recently-used territory then oldest approved_at; if nothing satisfies the territory rule, relax territory rather than skip the day; stamp published_date + status='published'. Idempotent per date.
   c. Schedule via pg_cron daily; ALSO run lazily inside GET /api/daily-scale when no scale exists for today (cron-miss safety). The published_date UNIQUE constraint makes double-selection impossible under race.
   d. Inventory alert: after each selection, if COUNT(status='approved') < 21 send a warning email via Resend to the admin; < 7 send critical. 
   e. RLS: draft/approved/retired rows must NOT be readable by clients — only published (and scheduled excluded too). Adjust the daily_scales SELECT policy accordingly; archive pages read only published rows.

Write a couple of contract tests for /api/daily-scale and /api/discern (crisis path + tier gate). Do not build UI.
```

**Verify:** hitting `/api/daily-scale` returns today's scale with results hidden pre-vote; a crisis-keyword payload to `/api/discern` returns the crisis signal and never calls Claude; a free user's 2nd session is blocked; Stripe Checkout URL generates; running the selector twice for the same date is idempotent; a scale with a `published_date` can never be selected again (test it); same-territory back-to-back is refused when an alternative exists and relaxed when none does; clients cannot read draft/approved rows; the low-inventory alert fires below the thresholds.

---

## STAGE 2 — The Daily Scale + Today (the heart)

*Attach: the four Today frames (WEIGH incl. selected variant, SEE, LEARN, completed-collapsed).*

```
Read SKILL.md §5, §7, §9.1. Build the Daily Scale to match the attached Today prototype frames exactly.

1. hooks/useDailyScale.ts — owns fetching today's scale, vote state, phase (weigh/see/learn/completed), optimistic vote via /api/daily-scale/vote. Pure logic, no DOM.
2. components/scale/DailyScale.tsx with the three phases, each matching its frame:
   - WEIGH: Eyebrow, <Beam tilt={selected}/>, question Panel (Cormorant italic), two SideBadge cards, footer line. Selecting a side tilts the beam, lifts the chosen card (gilt border), dims the other, reveals full-width gilt "Confirm my choice". One gold moment = beam + CTA.
   - SEE: compressed question, ResultBars (A nave800 / B gilt500) + large numerals, "N believers weighed in", olive affirmation, "See the Scripture Lens". ORCHESTRATED: animate bars 0→final + counters 0→final over 1.5s ease-out (Framer Motion), reduced-motion jumps to final.
   - LEARN: "THE SCRIPTURE LENS" eyebrow, reference (Playfair gilt), ScriptureBlock drop cap, teaching paragraph (never a winner), prayer Panel (3px gilt top border), "Share this scale" (calls /api/og), locked "Past scales" strip (7 blurred + Premium chip), quiet "Begin a Deep Discernment".
   - Completed-collapsed card.
3. components/scale/ResultBars.tsx and ShareCard (OG via /api/og).
4. app/(app)/today/page.tsx — app chrome (nave900) + TabBar (Today active), renders DailyScale by phase.

Match spacing/sizing/hierarchy to the frames; values from tokens. Build every state shown. Do not add sections the frames don't show.
```

**Verify:** each phase matches its frame; the SEE reveal animates smoothly and degrades under reduced-motion; one gold moment per phase; share action produces an OG image; the past-scales strip shows locked for free tier.

---

## STAGE 3 — Auth + 6-Screen Onboarding + Stripe Paywall

*Attach: Signup, Login, Reset Password, and all six Onboarding frames (incl. Screen 4 iOS-install variant and Screen 6 paywall).*

```
Read SKILL.md §9.3 and CLAUDE.md (onboarding + pricing + canonical copy). Build to the attached frames exactly.

1. app/(auth): signup, login, reset-password (+ sent-state) — the quiet auth shell from the frames; Supabase email + Google OAuth; the CTA is the only gold.
2. app/(app)/onboarding: the 6-screen flow, shared shell (nave800, 6 progress dots, no tab bar).
   - S1 Hook: staged entrance cross 0 / headline 500 / subline 1000 / CTA 1500ms. No skip.
   - S2 Season: 2x2 + full-width card → profiles.onboarding_season.
   - S3 Micro-discernment: 5s countdown ring → two buttons.
   - S4 Time picker: 7/8/9 pills → profiles.daily_scale_time, then request Web Push. iOS-Safari-not-installed → swap to the "Add to Home Screen" instruction sheet with a Continue path (never a dead end).
   - S5 First Daily Scale: reuse the WEIGH component pixel-for-pixel with a one-line personalized intro.
   - S6 Soft paywall: staged entrance ending with the skip link at 2000ms (delayed, ALWAYS visible). Annual highlighted ($49.99/yr, $4.17/mo, struck $7.99, Save 48%, BEST VALUE), Monthly ($7.99/mo). CTA "Start my 7-day free trial" → Stripe Checkout. Microcopy "Free for 7 days. Cancel anytime." Skip = "Continue with free plan".
3. Set onboarding_completed=true on BOTH the trial-start and skip paths; guard so the paywall never shows again.

Use the exact canonical copy from SKILL.md §13 — never "no credit card", never "unlock".
```

**Verify:** full first-run flow signup→S1–S6→Today; both trial-start and skip set `onboarding_completed` and never re-show the paywall; the iOS branch appears in an iOS-Safari simulation; the skip link is always present on S6.

---

## STAGE 4 — Deep Discernment Journey + The Stillness

*Attach: the journey shell + all step frames (Crossroads, Word, Walked Before, Examination, Fruit incl. locked, Prayer) and both Stillness frames.*

```
Read SKILL.md §9.2 and §9.4. Build to the attached frames exactly.

1. Journey shell: no tab bar; top = Beam-as-progress (7 marks, fulcrum under active step); step eyebrow; back + "Save & exit". Persist journey state to sessionStorage + server after each step (tab close never loses a session).
2. hooks/useJourney.ts — step state, session persistence, tier checks.
3. Step components:
   - Crossroads: situation textarea + tone chips (Reflective/Urgent/Encouragement/Lament) + "Begin my journey" + free-tier sessions-remaining note.
   - The Word: 3 scripture cards, each with the drop cap.
   - Those Who Walked Before: 2 narrative cards + gilt-left lesson box.
   - The Examination: 5 numbered expandable fields.
   - The Fruit (PREMIUM): radial chart (hairline gilt web, 18% fill) + nine readings; LOCKED variant (blurred + lock + "Start free trial") for free tier.
   - The Prayer: gilt-top prayer card + olive stillness-note echo + "Set my Ebenezer Stone" (Ebenezer motion: beam levels, stone settles) + disclaimer microcopy.
4. The Stillness (its own full-bleed nave950 screen, SKILL.md §9.2) — breathing disc (breathe keyframe, 4s in/2s hold/4s out), cross center, "Be still, and know that I am God." — Psalm 46:10, 90s progress arc, elapsed time. hooks/useStillness.ts owns the 90s timer and calls useWakeLock (request on mount, re-request on visibility, release on exit). After 90s → "What surfaced?" capture. This screen is the quality bar — must be genuinely calm and 60fps. The single ≤6% glow allowance lives here.
5. On journey completion, save a journal entry via /api/journal.

Match every frame; build the Fruit locked state; wake lock must engage during Stillness.
```

**Verify:** a free user hits the Fruit lock → Upgrade; a premium user sees the chart; Stillness runs 90s with the screen staying awake and degrades under reduced-motion; "Set my Ebenezer Stone" creates a journal entry; refreshing mid-journey restores state.

---

## STAGE 5 — Spiritual Journal

*Attach: Journal timeline (incl. free-tier + empty variants) and Entry Detail frames.*

```
Read SKILL.md §9.5. Build to the attached frames exactly.

1. app/(app)/journal: timeline with a hairline gilt spine + stone glyph per entry; entry cards (date eyebrow, OUTLINE type chip so gold stays singular, title, reference badge, one-line preview). Free tier: 3 crisp entries + blurred rest under the upgrade card. Empty: lone stone glyph + "Your first stone hasn't been set yet. It will be." + CTA.
2. Entry detail: situation panel, scriptures (drop-cap blockquotes), stillness note (olive left border), prayer card (gilt top), follow-up field "How did it turn out?", secondary actions (Share scripture=Premium, Edit, Delete=ember).
3. Wire tier gating via useSubscription.

Match the free-tier blur and empty states exactly to the frames.
```

**Verify:** free tier shows exactly 3 crisp + blurred rest; empty state renders for a new account; entry detail matches its frame; delete/edit work; share is gated to Premium.

---

## STAGE 6 — Marketing + SEO Archive

*Attach: Home (mobile + desktop), Pricing, Archive index, Scale Detail frames.*

```
Read SKILL.md §11 and §9. Build to the attached frames exactly; marketing pages read like a nave, not a brochure.

1. app/(marketing)/page.tsx (Landing): sections in the frame's order — hero with <Beam sway/> holding "wisdom"/"your decision" and the page's single glow; live today's-scale teaser (real data, voting requires account); problem (3 statements); how-it-works (7 steps along a beam spine, Step 5 emphasized); Stillness spotlight band; journal feature; community proof (stat trio + 62/38 bar pair); pricing summary (the two paywall cards); FAQ accordion; final CTA. Desktop 1440: same sections, content column ~720px, navy breathing wide — no multi-column feature grids.
2. Pricing page: "One price. Every journey.", two plan cards, free-tier summary, trial line, billing FAQ, final CTA.
3. app/(marketing)/scale (Archive index): header + search + scale cards (date, question in Cormorant italic, mini dual bar, "Read the Scripture Lens") + pagination + footer CTA.
4. app/(marketing)/scale/[slug] (Scale Detail — SEO): date, question as H1 (Cormorant italic), both argument cards, final result bars + count, Scripture Lens (drop-cap verse, teaching, prayer), CTA band, 3 related scales. Add per-page metadata + OpenGraph + JSON-LD so all 30 seeded scales become indexed pages.
5. Generate share-card OG images for scales via /api/og.

Match hierarchy and section order to the frames exactly.
```

**Verify:** landing matches mobile + desktop frames; `/scale/[slug]` renders a real seeded scale with correct meta/OG/JSON-LD; archive lists all seeded scales; the hero Beam sways and is the only glow.

---

## STAGE 7 — PWA Layer

*No new screens — infra over existing screens; attach the offline-state frame from Stage 8 set if building it here.*

```
Read CLAUDE.md "PWA Requirements" and SKILL.md §10.

1. public/manifest.webmanifest: short_name BibleDiscern, theme_color #1B2A4A, background_color #FDF6EC, maskable 192/512 icons, display standalone, start_url /today.
2. Service worker: precache app shell + fonts + icons; runtime cache today's scale (stale-while-revalidate) + journal list (network-first); NEVER cache /api/discern or auth. Offline fallback route rendering the cached scale + the designed offline copy ("The Word doesn't need a signal — but this app does for new content").
3. hooks/useInstallPrompt.ts: capture beforeinstallprompt; expose a custom gilt "Install BibleDiscern" affordance surfaced ONLY after first scale, after first journey, and in Settings — never on first paint. iOS: detect standalone; if not installed, show the instruction sheet.
4. Web Push (VAPID): usePush + /api/push/subscribe; schedule the daily reminder at profiles.daily_scale_time. iOS requires installed PWA (16.4+); Resend email fallback for opted-in non-installed users.
5. useWakeLock.ts (if not already added in Stage 4): request on Stillness, re-request on visibility, release on exit; feature-detect and degrade silently.
6. Confirm Lighthouse PWA "installable" passes; fonts self-hosted, subset, display swap; LCP < 2.0s target.
```

**Verify:** Lighthouse marks the app installable; install prompt appears only at the three high-intent moments; offline shows the designed cached-scale state (not a browser error); a scheduled push fires on Android/desktop; wake lock holds during Stillness.

---

## STAGE 8 — Settings, Legal, System States

*Attach: Settings, Privacy, Terms, Delete Account, and the system-state frames (offline, crisis, trial-ending, payment-failed, empty-discern).*

```
Read SKILL.md §8 and CLAUDE.md safety rules. Build to the attached frames exactly.

1. Settings: grouped vellum rows — Profile, Daily Scale time (inline pills), Notifications toggle, Sound cues toggle (off default), Subscription (status + "Manage billing" → Stripe portal), Install BibleDiscern (hidden when installed), Privacy, Terms, Sign out, Delete account (ember). Footer "v2.0 · Weigh it with wisdom".
2. Legal: Privacy and Terms as quiet document layouts (Playfair title, last-updated, anchor list, prose). Use the v1 privacy content already written for the app.
3. Delete Account (public): branded header, exact list of what's removed, warning line, email field + ember-outlined "Request account deletion" (the one screen where emphasis is NOT gold), sent-state, support line. Wire /api/delete-account (confirmation email via Resend + signed-token deletion of all user rows + auth user).
4. System states, each matching its frame: OFFLINE, CRISIS RESOURCES (full vellum, the app's calmest surface, 988/Crisis Text Line/RAINN, zero decorative accents, "BibleDiscern is not a crisis service."), TRIAL-ENDING banner, PAYMENT-FAILED card, EMPTY DISCERN hub.

The Crisis screen is the deliberate exception to the navy-ground and one-gold rules — full vellum, no accents. Build it exactly as framed.
```

**Verify:** Settings matches its frame incl. the hidden-when-installed install row; delete-account flow sends the email and removes all rows on confirm; the crisis screen renders full-vellum with no gold; trial-ending and payment-failed states appear under the right conditions.

---

## STAGE 9 — Consistency Pass + Pre-Launch Hardening

*Attach: nothing new — the whole app + all prototype frames for reference.*

```
Read SKILL.md §14 (Definition of Done) and CLAUDE.md.

1. Prototype parity audit: for every screen, confirm it matches its Claude Design frame — layout, section order, spacing, and every state (selected/locked/blurred/empty/sent/error/offline). List and fix any drift.
2. Selah consistency audit (SKILL.md laws): exactly one gold moment per screen (except Crisis=none); navy ground / vellum never full-bleed (except Crisis); every Scripture drop-capped; every Daily Scale question Cormorant italic; radius 14 + 12%-gilt navy borders + no gray navy shadows; identical TabBar; motion annotations only on the four orchestrated moments, nothing bouncy.
3. Copy audit: trial line is "Free for 7 days. Cancel anytime." everywhere; no "unlock/seamless/elevate"; canonical lines match SKILL.md §13.
4. Token audit: grep for hardcoded hex/duration/size in components — replace with tokens.
5. Accessibility: AA contrast on every pair, gilt focus rings, ≥44px targets, full keyboard path through onboarding/journey/voting, prefers-reduced-motion degrades all four orchestrated moments.
6. Security pre-launch: confirm no service-role key on client; RLS on every table; /api/discern never logs situation text and never caches; rate limiting active. Then rotate Anthropic, Stripe, and Resend keys and update Vercel env + turbo.json globalEnv.
7. Deploy to Vercel on biblediscern.app; confirm privacy + delete-account URLs resolve; queue Day-1 content.

Return a short report of what you changed and any prototype gaps you had to flag rather than fix.
```

**Verify:** the app is deployed and installable on `biblediscern.app`; the audit report shows zero unresolved parity/consistency/copy/token violations; keys rotated; legal URLs live.

---

## Sequencing recap

| Week | Stages | Outcome |
|---|---|---|
| 1 | 0 · 1 · 2 | Foundations + backend spine + the Daily Scale working end to end |
| 2 | 3 · 4 · 5 | Auth, onboarding + paywall, the full journey + Stillness, the journal |
| 3 | 6 · 7 · 8 · 9 | Marketing + SEO, the PWA layer, settings/legal/system states, hardening + launch |

Every stage builds to the prototype. The build is faithful translation, not fresh design.
