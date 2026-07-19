# BibleDiscern v2 — Product Requirements Document
## PWA-First Launch · Native-Ready Architecture · Full Feature Carryover

**Version:** 2.0
**Date:** April 2026
**Owner:** Tokunbo (AkomzyAi)
**Status:** Approved for build

---

## 1. Purpose of This Document

This PRD defines the rebuild of BibleDiscern as a **Progressive Web App (PWA) first**, launching on the open web with zero store gatekeeping, followed by native Android and iOS apps **after demonstrated adoption**.

**What changes:** the delivery vehicle (PWA instead of native-first) and the quality bar of the frontend (premium, distinctive, non-templated).

**What does not change:** the product itself. Every feature from v1 is retained — the 7-step Discernment Journey, The Daily Scale, the Stillness Engine, the Spiritual Journal, the 6-screen onboarding with soft paywall, the Free/Premium tiers at $7.99/$49.99, and the Sacred Seven trial.

**The one rule governing every technical decision in this document:** *nothing may be built in a way that makes the future native launch harder.* Business logic lives in shared, platform-agnostic packages. The UI layer is the only thing that will be rewritten for native.

---

## 2. Strategic Context

### 2.1 Why PWA first

The v1 native-first path stalled on distribution, not product: Google's 12-testers/14-day closed-test gate, EAS production build crashes, package-name mismatches, and dual payment rails (RevenueCat + Stripe). None of these were product failures.

A PWA:
- Ships the day it is done. No review queue, no tester quota, no store gate.
- Reaches **iPhone users on day one** via Safari — something native-Android-first could never do (no Apple Developer account exists yet).
- Uses Stripe only (already configured, already working). No 15–30% store cut during the adoption phase.
- Makes every marketing link a direct install: the 15-day content strategy drives clicks straight into the product.

### 2.2 The native path stays open — deliberately

- The Google Play Console app (`com.biblediscern`), subscription products, RevenueCat project, and internal-testing track built in v1 are **parked, not deleted**.
- The `mobile/` Expo codebase is **frozen, not removed**.
- Native launch triggers are defined in §12. When they fire, the closed-test quota fills with real users in days, and the store listing assets (icon, feature graphic, screenshots, descriptions) already exist.

### 2.3 Positioning (unchanged)

**The world's first Christian discernment app.** Not a devotional. Not a chatbot. A structured, Scripture-rooted process for weighing real decisions — with a daily practice that trains the discernment muscle.

Tagline: **"Weigh it with wisdom."**

---

## 3. Users & Core Jobs

| Persona | Core job | Primary surface |
|---|---|---|
| The Decider | "I'm facing a real decision and I don't want to face it alone or unbiblically." | 7-Step Journey |
| The Daily Practicer | "I want a 2-minute morning practice that actually makes me think." | The Daily Scale |
| The Chronicler | "I want to look back and see how God has led me." | Spiritual Journal |

The Daily Scale is the **acquisition and habit surface**. The Journey is the **depth and monetization surface**. The Journal is the **retention moat** — it compounds and cannot be replicated by a competitor or abandoned without loss.

---

## 4. Feature Specification (Full Carryover)

### 4.1 The Daily Scale

Unchanged 3-phase flow:

1. **WEIGH** — One question per day where faithful Christians genuinely disagree. Two argued sides (A/B). User must choose; no fence-sitting. One vote per user per scale (enforced by existing `daily_scale_votes` unique constraint).
2. **SEE** — Animated community results reveal (percentage bars fill over 1.5s, counters animate). "N believers weighed in." Majority/minority acknowledgment.
3. **LEARN** — The Scripture Lens: reference, verse text, teaching that **never declares a winner**, closing prayer.

Rules retained: scale expires at local midnight; seeded baseline votes prevent empty-room effect; free users get the full daily experience; Premium unlocks history (past 7 days).

**Scheduling & the no-repeat guarantee (new in v2 — ships in this phase):**

Repeated questions would erode community trust faster than almost anything else, so no-repeat is enforced *structurally*, not editorially:

- `daily_scales` gains a lifecycle: `status` (draft → approved → published → retired), a nullable-unique `published_date` (replaces v1's `date`), a `territory` tag (topic family: forgiveness, money, ambition, peace-vs-truth, …), `source` (seeded / manual / generated), and `approved_at`.
- A daily selector (pg_cron, with a lazy fallback on first request if the cron ever misses) promotes exactly one scale from the `approved` pool to `published` by stamping `published_date`. The selector **excludes any scale whose `published_date` is already set** — so a question can never surface twice; the guarantee is a query constraint, not a policy.
- Territory spacing: the selector refuses to publish the same `territory` on consecutive days, and rotates least-recently-used territories first (FIFO by `approved_at` within a territory). If no eligible scale satisfies the spacing rule, it relaxes territory before it ever skips a day — a territory repeat is acceptable; a missing scale is not.
- Inventory alerting: Resend email to the admin when the approved pool drops below 21 (warning) and below 7 (critical).
- The 30 seeded scales are migrated into this lifecycle (past dates → `published`, territory tags backfilled).

Content supply beyond the seeded 30 comes from the **AI scale-generation pipeline** — human-review-gated, specified in `biblediscern-scale-pipeline-spec.md`, built as the first post-launch update before inventory runs low. Its human gate lives on a lean **`/admin/scales` surface that ships in this phase** (inventory header, manual scale creation, approve/edit/retire, LEARN-styled preview) — the pipeline later extends that page with the generated-drafts queue. Deliberate *spaced revisits* (re-asking a great tension 6+ months later, framed as a revisit and showing the user their prior vote) are a Phase 2+ concept reserved in that spec — never accidental repetition.

**Web-specific additions (additive, nothing removed):**
- **Public teaser:** the landing page shows today's question and both arguments to anonymous visitors. Voting requires an account (guest-vote upgrade path is a Phase 2 experiment, not MVP).
- **Share card:** after the SEE phase, a "Share this scale" action generates a branded OG image (question + split + "Where do you stand?" + link). Server-rendered via the existing `/api/og` route pattern.
- **Public archive:** every past scale gets a permanent public page (`/scale/[slug]`) showing the question, both arguments, and the Scripture Lens — vote data shown, voting closed. These are the SEO surface (30 seeded scales = 30 indexed pages at launch, growing daily).

### 4.2 The 7-Step Discernment Journey (all seven steps retained)

1. **The Crossroads** — situation input + tone selector (reflective / urgent / encouragement / lament).
2. **The Word** — 3 contextually matched scriptures with plain-language explanations.
3. **Those Who Walked Before** — 2 biblical narrative matches.
4. **The Examination** — 5 probing Ignatian-inspired questions.
5. **The Stillness** — 90-second guided silence (see 4.3).
6. **The Fruit** — Fruit of the Spirit diagnostic with radial chart. **Premium only.**
7. **The Prayer** — personalized AI prayer + "Set My Ebenezer Stone" save to journal.

Backend unchanged: `/api/discern` calls Claude with the existing system prompt, tier gating (Sonnet free / Opus premium), Zod validation, crisis-keyword screening before any Claude call, rate limiting (10 req/min/user), and the permanent disclaimer on every session.

**Web adaptations:**
- **Wake Lock API** during The Stillness so the screen does not sleep mid-silence. Graceful fallback where unsupported.
- **Haptics do not exist on the web.** Every v1 haptic moment maps to a visual-plus-optional-sound equivalent (see §7.6). No `navigator.vibrate` — inconsistent and cheap-feeling.
- Journey state persists to `sessionStorage` + server after each step, so an accidental tab close never loses a session in progress.

### 4.3 The Stillness Engine

Unchanged concept and choreography: full-screen navy, breathing circle (inhale 4s → hold 2s → exhale 4s), cross at center, "Be still, and know that I am God" (Ps 46:10), 90-second progress arc, then "What surfaced?" capture prompt.

This is the signature feature and receives the highest animation-quality bar in the app (see §7). Runs at 60fps via CSS transforms/opacity only.

### 4.4 Spiritual Journal (Ebenezer Stones)

Unchanged: every completed journey saves as an entry; entry types (discernment / reflection / answered_prayer / god_showed_up); free tier sees last 3 entries; Premium sees full history. Timeline view with the existing card design language, elevated per §7.

### 4.5 Onboarding (6 screens, retained, web-adapted)

The funnel runs immediately after account creation, exactly as designed:

1. **The Hook** — emotional opening, staged fade-ins.
2. **Season Selection** — career / relationship / financial / spiritual / growth → `profiles.onboarding_season`.
3. **Micro-Discernment** — 5-second countdown ring, "I noticed something / I'm not sure yet."
4. **Notification Opt-In (disguised as time picker)** — user picks 7/8/9 AM → `profiles.daily_scale_time`. **Web behavior:** after time selection, request Web Push permission.
   - **iOS Safari, browser (not installed):** web push requires an installed PWA on iOS. This screen detects that state and swaps the permission request for a beautifully designed **"Add BibleDiscern to your Home Screen"** instruction sheet (Share → Add to Home Screen), framed as "so your Daily Scale can find you." Never a dead end; a "Continue" path always exists.
5. **First Daily Scale** — the real component, personalized intro from screen 3's answer.
6. **Soft Paywall** — identical layout, copy, animation choreography, and skip-link rules as the v1 spec. CTA opens **Stripe Checkout** (annual preselected) instead of RevenueCat. `onboarding_completed` set true on both paths; the paywall never shows again.

No skip on screens 1–5. Screen 6 skip link always visible.

### 4.6 Subscription Tiers & Pricing (unchanged)

| | Free | Premium |
|---|---|---|
| Price | $0 | **$7.99/mo or $49.99/yr (save 48%, $4.17/mo effective)** |
| Discernment sessions | 1/month | Unlimited |
| Daily Scale (weigh + see + learn) | Full | Full |
| Daily Scale history | — | Last 7 days |
| Journal | Last 3 entries | Unlimited |
| Fruit diagnostic (Step 6) | Locked | Included |
| Follow-ups | — | Included |
| Scripture card sharing | — | Included |
| Streak tracking | — | Included |

**Sacred Seven Trial:** 7 days of Premium via Stripe Checkout trial (no charge for 7 days; card required by Stripe — copy updated accordingly: "Free for 7 days. Cancel anytime before your trial ends.").

Payments: **Stripe only** in this phase. Checkout for purchase, Customer Portal for management, existing webhook route for state sync. RevenueCat and Google Play IAP resume at native launch; the `subscriptions.source` column already supports both.

### 4.7 Safety & Trust (unchanged, non-negotiable)

- Crisis-keyword screening before any Claude call; crisis resources screen (988, Crisis Text Line, RAINN) shown immediately on detection; input never forwarded.
- The AI never claims to speak for God and never gives directive "you should" advice.
- Disclaimer on every session: "This tool supports reflection — it does not replace God, Scripture, or wise counsel."
- No analytics on situation text. Ever.
- Scripture Lens never declares a winner.

---

## 5. PWA Requirements

| Capability | Requirement |
|---|---|
| Manifest | `name`, `short_name: BibleDiscern`, navy `theme_color` (#1B2A4A), cream `background_color`, maskable icons (192/512), `display: standalone` |
| Service worker | Precache app shell + fonts + icon set. Runtime cache: today's scale (stale-while-revalidate), journal list (network-first). **Never cache** `/api/discern` responses or auth. |
| Offline | Opening offline shows today's cached scale in WEIGH/LEARN phases + a crafted offline state ("The Word doesn't need a signal — but this app does for new content"). Journey requires network; degrade gracefully with a designed message, never a browser error. |
| Install | Custom in-app install prompt (deferred `beforeinstallprompt` on Android/desktop; instruction sheet on iOS). Surfaced at high-intent moments: after first scale completion, after first journey, from Settings. Never on first paint. |
| Web Push | Daily Scale reminder at the user's chosen time (existing push-scheduling logic re-targeted from Expo push to Web Push/VAPID). Works on Android/desktop browsers; iOS only when installed (16.4+) — handled per §4.5. |
| Performance | LCP < 2.0s on 4G mid-tier device; CLS < 0.1; Lighthouse PWA installable = pass; fonts self-hosted via `next/font`, `display: swap`, subset. |
| Wake Lock | Active during Stillness; released on completion/exit. |

---

## 6. Architecture — Native-Ready by Construction

### 6.1 Repo strategy: keep the monorepo

The v1 monorepo exists precisely for the future this PRD mandates. It stays.

```
biblediscern/
├── web/                  # Next.js App Router — THE PRODUCT (PWA) + API backend
│   ├── app/
│   │   ├── (marketing)/  # Landing, pricing, blog, scale archive /scale/[slug]
│   │   ├── (app)/        # Authenticated PWA: today, discern, journal, settings, onboarding
│   │   └── api/          # All existing routes, unchanged contracts
├── packages/shared/      # UNCHANGED ROLE: types, constants, Zod schemas, API client
├── mobile/               # FROZEN. Not deleted. Reactivated at native phase.
├── supabase/             # Existing migrations
└── turbo.json            # globalEnv already fixed in v1 — carries over
```

### 6.2 The portability rules (enforced in CLAUDE.md and code review)

1. **All types, constants, validation, and the API client live in `@librato/shared`.** The web app imports them; the future native app imports the same package. No domain type is ever defined inside `web/`.
2. **State stores (Zustand) are platform-agnostic** — no `window`, no DOM, no browser APIs inside stores. Browser specifics (storage adapters, push registration, wake lock) are injected behind tiny interfaces. Zustand runs identically in React Native.
3. **Design tokens are data, not CSS.** Colors, type scale, spacing, motion durations/easings live in `packages/shared/src/tokens.ts`, consumed by Tailwind config on web today and by a React Native theme provider tomorrow. One source of truth across every future surface.
4. **API contracts are frozen.** The native app will speak to the exact same routes. Any change is additive.
5. **Components separate logic from skin.** Hooks own behavior (`useDailyScale`, `useJourney`, `useStillness` timing); components own rendering. Native rebuild = new skins over the same hooks.

### 6.3 Backend (unchanged)

Supabase project, all 7 tables, RLS policies, triggers, pg_cron monthly reset, 30 seeded scales — carried over as-is. Auth: Supabase email + Google OAuth (web flow). Claude integration, Resend, and the existing webhook routes unchanged.

---

## 7. Design Language — "Selah"

*(Selah: the word in the Psalms marking the pause — stop, and weigh what was just said.)*

The brief: **premium, authentically; highly unique; unmistakably BibleDiscern.** The direction is drawn from the product's own world — the balance scale, the illuminated manuscript, the sanctuary at evening — not from SaaS convention. This is a **sanctuary, not a dashboard**.

### 7.1 Design thesis

> Modern sanctuary, illuminated-manuscript discipline: deep-nave navy as the world, vellum as the page, gold as *light* — spent in exactly one place per screen.

Guardrail against the generic: an all-cream background with a serif display is the current templated-AI look. Selah inverts the hierarchy — **navy is the environment; vellum panels sit within it** like lit pages in a dark church. Cream never appears as a naked full-bleed background.

### 7.2 The signature element: The Beam

One element carries the identity everywhere — a hairline gold **balance beam** with a center fulcrum:

- **Landing hero:** the beam sits beneath the headline, holding "wisdom" and "your decision" in its two pans, swaying almost imperceptibly (±1.5°, 7s period) like something alive.
- **Daily Scale WEIGH:** the beam is the voting instrument. Hovering/tapping side A or B makes it *physically tilt* toward that side before confirmation. Committing a vote settles it with a weighted, damped rotation. This is the moment users remember.
- **Journey progress:** the 7 steps render as marks along the beam; the fulcrum glides beneath the active step.
- **Ebenezer save:** the beam levels, then a stone glyph settles beneath it.

Everything else on screen stays quiet so The Beam can speak.

### 7.3 Color system (tokens; navy-dominant)

| Token | Hex | Role |
|---|---|---|
| `nave-950` | #0D1520 | Deepest ground (Stillness, immersive) |
| `nave-900` | #14213A | App chrome background |
| `nave-800` | #1B2A4A | Brand navy — primary surfaces |
| `nave-700` | #2D4166 | Raised surfaces, hover |
| `vellum-100` | #FDF6EC | Page panels (never full-bleed) |
| `vellum-200` | #F5ECD7 | Inset panels, quotes |
| `gilt-500` | #C8A45E | Gold — the light. One emphasis per screen. |
| `gilt-300` | #E8D5A3 | Gold on navy text/glow |
| `ink-900` | #2C2418 | Text on vellum |
| `ink-500` | #5C5144 | Secondary text on vellum |
| `olive-500` | #7A8B6F | Success, affirmation |
| `ember-600` | #C0392B | Errors, crisis accents (rare) |

**The gold rule:** gilt is treated as *material* — one gold moment per screen (the beam, the active CTA, or the drop cap). Gold never decorates two competing elements at once.

### 7.4 Typography

Retained brand faces, set with manuscript discipline via `next/font` (subset, swap):

- **Playfair Display** — display only. H1 clamp(2.2rem→3.4rem), tight leading (1.15), used sparingly.
- **Cormorant Garamond (italic)** — Scripture, prayers, questions. All Daily Scale questions render in this voice at generous size (1.35rem+, leading 1.5).
- **Source Sans 3** — UI and body. 1rem/1.6.
- **Type signature — the Illuminated Capital:** every Scripture passage opens with a two-line Playfair drop cap in `gilt-500` with a hairline rule descending from it. Instantly recognizable, trivially portable to native later, costs nothing in performance.
- Labels/eyebrows: Source Sans 600, 11–12px, uppercase, letter-spacing 0.18em, `gilt-500` on navy / `ink-500` on vellum.

### 7.5 Surface & texture

- **Vellum grain:** panels carry a barely-there paper grain (inline SVG `feTurbulence`, ~2.5% opacity — one tiled asset, no image weight). Flat hex cream is what templates do; vellum is what a manuscript does.
- **Panel geometry:** radius 14px; on navy, panels get a 1px `gilt` border at 12% opacity — gilt edges on dark, like a page catching light. Shadows on navy are glow-tinted (`rgba(200,164,94,0.06)`), not gray.
- **Candle glow:** immersive navy screens (Stillness, paywall, landing hero) carry one soft radial gold gradient (≤6% opacity) behind the focal element. Never more than one glow per screen.

### 7.6 Motion — the liturgical system

Motion is reverent: weighted, slow-out, never bouncy. All motion respects `prefers-reduced-motion` (fades only).

| Token | Value | Use |
|---|---|---|
| `--ease-selah` | cubic-bezier(0.22, 0.8, 0.24, 1) | Everything |
| `--dur-breath` | 700ms | Panel/page transitions (fade + 8px rise — a page turning) |
| `--dur-settle` | 450ms | The beam settling, card commits |
| `--dur-whisper` | 250ms | Hovers, focus, small reveals |

Haptic → web mapping (v1 haptics have no web equivalent; these replace them):
- selection tap → beam tilt + 120ms gilt border pulse
- confirm impact → beam settle + panel exhale (scale 1.00→0.985→1.00)
- success notification → count-up completes + drop-cap glow blooms once + optional chime
- **Sound:** three sub-second cues only (vote settle, stillness begin/end chime, Ebenezer stone), off by default, toggle in Settings, absent under reduced-motion.

Orchestrated moments (the only "big" animations, matching v1 specs): Daily Scale SEE reveal (1.5s ease-out bars + counters), Stillness breathing loop, onboarding screens 1 & 6 staged entrances, Ebenezer stone settle.

### 7.7 Layout & responsive posture

- App shell: max-width 640px column, centered — a *page*, not a dashboard. The navy nave breathes on either side at desktop widths; on mobile the experience is edge-to-edge and indistinguishable from a native app (this is the point — the PWA must feel installed even in a tab).
- Bottom tab bar on mobile viewports (Today / Discern / Journal / Settings), left rail ≥1024px. Standalone-mode safe-area insets handled.
- Quality floor, unannounced: keyboard focus visible (gilt ring), WCAG AA contrast on every pair above, touch targets ≥44px, reduced-motion complete.

### 7.8 Voice in the interface

Active voice, sentence case, calm and specific — "Weigh in," "Set my Ebenezer Stone," "Begin the Stillness." Errors direct, never vaguely apologetic ("We couldn't reach the server. Your words are saved — try again in a moment."). Empty journal: "Your first stone hasn't been set yet. It will be." No filler, no exclamation marks outside celebration moments, none of the AI-copy tells ("unlock," "seamless," "elevate").

---

## 8. Screen Inventory (build checklist)

**Marketing (public):** Landing (hero with The Beam + live today's-scale teaser + how-it-works + pricing + FAQ) · Pricing · Scale archive index + `/scale/[slug]` · Privacy · Delete-account · Terms.

**App (auth):** Auth (email + Google) · Onboarding 1–6 · Today (Daily Scale states: weigh / see / learn / completed-collapsed) · Discern hub + 7 journey steps · Session detail · Journal timeline + entry detail · Upgrade (reuses paywall design) · Settings (profile, notification time, sound toggle, subscription via Stripe Portal, install app, sign out, delete account link) · **Admin** — `/admin/scales` (allowlisted internal tooling: inventory, manual scales, approve/retire; prototype-fidelity-exempt).

**System states designed, not defaulted:** offline, crisis resources, empty journal, trial-ending banner, payment-failed.

---

## 9. What Carries Over vs. What Gets Built

| Carries over as-is | Built new |
|---|---|
| Supabase schema, RLS, triggers, cron, 30 seeded scales | Entire `(app)` UI in the Selah system |
| All API routes + Claude system prompts + crisis screening | Selah token system + Tailwind theme + The Beam component |
| `@librato/shared` types/validation/api-client | PWA layer: manifest, service worker, install prompts, Web Push (VAPID) |
| Stripe products, checkout, webhook | Share-card OG generation for scales |
| Auth (Supabase email + Google) | Public scale archive pages (SEO) |
| Brand assets, store listing copy, screenshots (parked for native) | Wake Lock + sound cue system |
| 15-day content strategy + Remotion project | Landing page in Selah |
| Onboarding/paywall copy & choreography specs | Admin scale-management page (`/admin/scales`) |

Estimated effort: **~3 focused weeks** (≈70% of the thinking already exists).

---

## 10. Growth Loops at Launch

1. **Share cards** — every SEE phase ends with a share action; the OG image is the ad.
2. **Scale archive SEO** — 30 pages at launch, +1 daily, each answering a real search query ("should Christians tithe during hardship").
3. **The 15-day content campaign** — runs as the launch campaign; every video CTA now lands on an instant-access URL instead of a store page.
4. **Streak mechanics** (Premium) — retention pressure that compounds with the journal.

---

## 11. Metrics

| Stage | Metric | Target (Day 30) |
|---|---|---|
| Acquisition | Landing → signup | ≥ 8% |
| Activation | Signup → first scale weighed | ≥ 75% |
| Habit | D7 retention | ≥ 25% |
| Depth | Signups starting a journey in week 1 | ≥ 30% |
| Install | Active users installing PWA | ≥ 20% |
| Revenue | Trial starts / signups | ≥ 12% |
| Revenue | Trial → paid | ≥ 40% |
| Health | Crisis screens shown | Monitored; 100% correct behavior |

---

## 12. Native Transition Plan (Phase 3 — pre-committed triggers)

Begin native work when **any** of:
- 1,000 weekly active users, or
- 150 paying subscribers, or
- Sustained ≥ 25% D7 retention for 4 consecutive weeks.

Sequence: reactivate `mobile/` → point it at the same `@librato/shared` + API → rebuild UI skins from the Selah tokens → Google Play closed test (quota filled from the existing user base in days; console, subscriptions, RevenueCat all pre-configured) → production. iOS follows upon Apple Developer enrollment (requires Mac access — plan for it at trigger time). Verify current Google Play alternative-billing rules at that point; the economics may have improved since v1.

Until then: no work in `mobile/`, no RevenueCat changes, no store submissions.

---

## 13. Risks

| Risk | Mitigation |
|---|---|
| iOS push requires installed PWA | Onboarding screen 4 converts the limitation into an install moment; email reminder fallback (Resend) for non-installed users who opt in |
| PWA install friction on iOS | Install prompts only at high-intent moments; product fully usable without installing |
| Stripe trial requires a card (v1 copy promised "no card") | Copy updated everywhere: "Free for 7 days. Cancel anytime." Honest > clever |
| Claude API cost at free tier | Existing rate limits + 1 session/month free cap already bound this |
| Selah system scope-creeps the timeline | Tokens + The Beam + drop cap + motion system are the *whole* signature set; anything more is cut |
| Solo-founder bandwidth | §9 is the scope contract; §15 lists what is explicitly not in this phase |

---

## 14. Launch Checklist (exit criteria)

- [ ] All §8 screens shipped in Selah, responsive, AA contrast, reduced-motion clean
- [ ] Daily Scale full loop + share card + archive live
- [ ] 7-step journey end-to-end incl. Stillness wake-lock + Fruit gating
- [ ] Onboarding 1–6 incl. iOS install-sheet branch + Stripe trial checkout
- [ ] PWA: installable (Lighthouse pass), offline states, push on Android/desktop + installed iOS
- [ ] Privacy + delete-account pages live (URLs already registered with Google Play)
- [ ] Admin `/admin/scales` live: allowlist enforced (non-admins 404), inventory header accurate, manual scale create → approve → selectable by the daily selector
- [ ] All API keys rotated (Anthropic, Stripe, Resend) — the pre-launch step deferred from v1
- [ ] Vercel production deploy green on `biblediscern.app`
- [ ] Day-1 content from the 15-day campaign queued

## 15. Explicitly Out of Scope (this phase)

Native builds and store submissions · RevenueCat changes · dark mode ("Vespers" — strong Phase 2 candidate) · community features, prayer wall, groups · church/Shepherd tiers · multi-language · voice/TTS · home-screen widgets · the Follow-Up Agent · the AI scale-generation pipeline (first post-launch update — fully specified in `biblediscern-scale-pipeline-spec.md`; the no-repeat scheduling schema it feeds ships **in** this phase, §4.1) · guest voting experiment.

---

*He carried the cross so you could carry clarity. Now go build the sanctuary.*
