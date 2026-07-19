# CLAUDE.md — BibleDiscern v2 Project Configuration

> Read by Claude Code at the start of every session. Project context, architecture, conventions, and rules. Keep it current. The design system lives in SKILL.md — read that too before building any UI.

## Project Overview

**BibleDiscern** is the world's first Christian discernment app — a premium, mobile-first **Progressive Web App (PWA)**. It guides Christians through a structured, Scripture-rooted process for weighing real decisions. Not a devotional. Not a chatbot. A guided process.

Tagline: **"Weigh it with wisdom."**

**This is v2.** v1 was built native-first (Expo/React Native) and stalled on distribution (Google Play's 12-tester/14-day gate, EAS build failures, dual payment rails). v2 ships as a PWA on the open web — no store gate, instant install, reaches iPhone users on day one via Safari. Native iOS/Android come later, after adoption (see "Native Transition" below).

**The one rule that governs every technical decision:** *nothing may be built in a way that makes the future native launch harder.* Domain logic lives in shared, platform-agnostic packages. Only the UI layer will be rebuilt for native.

## Current Phase

Phase 1 — PWA launch. Single Next.js app. Stripe-only payments. The `mobile/` Expo codebase is **frozen, not deleted**. RevenueCat and Google Play are **parked, not removed**.

## Architecture

Mobile-first PWA. The web app IS the product AND the API backend. The monorepo is retained specifically because native is a *when*, not an *if*.

```
biblediscern/
├── web/                       # Next.js 14 (App Router) — THE PRODUCT (PWA) + API
│   ├── app/
│   │   ├── (marketing)/       # Public: landing, pricing, scale archive, privacy, terms, delete-account
│   │   │   ├── page.tsx                 # Landing
│   │   │   ├── pricing/
│   │   │   ├── scale/[slug]/            # Public SEO page per past scale
│   │   │   ├── scale/                   # Archive index
│   │   │   ├── privacy/
│   │   │   ├── terms/
│   │   │   └── delete-account/
│   │   ├── (app)/             # Authenticated PWA
│   │   │   ├── onboarding/              # 6-screen flow
│   │   │   ├── today/                   # Daily Scale (weigh/see/learn)
│   │   │   ├── discern/                 # Hub + [sessionId] journey
│   │   │   ├── journal/                 # Timeline + [entryId]
│   │   │   ├── upgrade/
│   │   │   ├── settings/
│   │   │   └── admin/scales/            # Allowlisted internal tooling: inventory, manual scales, approve/retire
│   │   ├── (auth)/            # Signup, login, reset-password
│   │   └── api/              # All routes (contracts frozen — see below)
│   ├── components/
│   │   ├── selah/            # Design-system primitives: Beam, DropCap, Panel, Eyebrow, GiltButton, SideBadge, TabBar
│   │   ├── scale/            # DailyScale (weigh/see/learn), ResultBars, ShareCard
│   │   ├── journey/          # Step components + Stillness
│   │   ├── journal/          # Timeline, EntryCard
│   │   └── onboarding/       # 6 screens
│   ├── hooks/               # useDailyScale, useJourney, useStillness, useSubscription, useInstallPrompt, useWakeLock
│   ├── lib/                 # supabase clients, stripe, push (VAPID), og, crisis-screen
│   ├── public/              # manifest.webmanifest, icons, sw.js (or generated)
│   └── styles/              # globals.css (token CSS vars)
├── packages/shared/          # PLATFORM-AGNOSTIC. Imported by web now, native later.
│   └── src/
│       ├── types.ts
│       ├── constants.ts
│       ├── validation.ts     # Zod schemas
│       ├── api-client.ts
│       ├── tokens.ts         # SELAH DESIGN TOKENS as data (colors, type, spacing, motion)
│       └── index.ts
├── mobile/                    # FROZEN. Do not touch this phase.
├── supabase/migrations/       # Existing schema — carried over
├── turbo.json                 # globalEnv lists all env vars (fixed in v1)
├── CLAUDE.md                  # This file
└── SKILL.md                   # Selah design system + build playbook — READ BEFORE BUILDING UI
```

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| App + marketing | Next.js 14 App Router, TypeScript | The product. Server components by default. |
| PWA | Web App Manifest + Service Worker (next-pwa or hand-rolled) | Installable; offline app shell; Web Push |
| Styling | Tailwind CSS | Config generated FROM `packages/shared/src/tokens.ts` — never hardcode hex |
| Animation | CSS transforms/keyframes first; Framer Motion only for the 4 orchestrated moments | 60fps; respect prefers-reduced-motion |
| State | Zustand | Platform-agnostic — NO window/DOM inside stores |
| Database | Supabase (PostgreSQL + Auth + RLS) | Existing project + schema. RLS on every table. |
| AI | Anthropic Claude API | Sonnet (free) / Opus (premium); crisis screen before any call |
| Payments | **Stripe only** | Checkout + Customer Portal + webhook. RevenueCat parked for native. |
| Email | Resend | Transactional + daily-scale email fallback |
| Push | Web Push (VAPID) | Replaces Expo push; iOS only when installed (16.4+) |
| Hosting | Vercel | `biblediscern.app` |
| Monorepo | Turborepo | `globalEnv` must list all env vars for builds |

## The Portability Rules (enforce in every review)

These are what make the future native launch a re-skin instead of a rebuild. Non-negotiable.

1. **All types, constants, validation, and the API client live in `@librato/shared`.** (The npm package name stays `@librato/shared` — renaming mid-project causes more problems than it solves; brand name and package name are allowed to differ.) No domain type is ever defined inside `web/`.
2. **Zustand stores are platform-agnostic.** No `window`, no `document`, no browser API inside a store. Browser specifics (storage, push registration, wake lock) are injected behind small interfaces so React Native can supply its own implementation later.
3. **Design tokens are data.** Colors, type scale, spacing, motion values live in `packages/shared/src/tokens.ts`. Tailwind config consumes them on web today; a React Native theme provider consumes the same file tomorrow. One source of truth. Never hardcode a hex value in a component.
4. **API contracts are frozen.** The native app will call the exact same routes. Changes are additive only.
5. **Hooks own behavior; components own rendering.** `useDailyScale`, `useJourney`, `useStillness` (timing), etc. hold logic with no rendering. Native = new skins over the same hooks.

## Prototype Fidelity (MANDATORY — read before building any UI)

**The Claude Design prototype is the binding visual source of truth. Every screen must be built to match its approved prototype frame — not approximated, not reinterpreted, not "improved."** This is a hard requirement, not a guideline.

Rules of authority (memorize the order):
1. **The prototype governs the specific screen** — exact layout, section order, spacing rhythm, component placement, which states exist, and how each state looks. If the prototype shows it, build it. If the prototype does not show it, do not add it.
2. **SKILL.md governs the design system** — the tokens, The Beam, the drop cap, motion values, and the five Selah laws every screen obeys. The prototype is the *application* of that system; SKILL.md is the system itself. They must never conflict; if they appear to, stop and flag it rather than guessing.
3. **The PRD / this file governs copy and behavior** — canonical lines, tier gating, API contracts, safety rules. Where visual prototype and written copy ever disagree, the written canonical copy wins (see SKILL.md §13).

Operating requirements for every UI build session:
- The relevant **prototype frames must be attached** to the build session. Do not build a screen from memory or from the wireframe alone — build from the high-fidelity frame.
- **Do not invent sections** the prototype doesn't contain. **Do not omit states** the prototype shows (selected, locked, blurred, empty, sent, error, offline). A screen is incomplete until every state in its prototype exists in code.
- **Match spacing, sizing, and hierarchy** to the frame. Consume tokens for the values (never hardcode), but the *arrangement* comes from the prototype.
- If a needed screen or state is missing from the prototype, **stop and request it** — never fill the gap with an improvised layout.
- **Exception — internal admin surfaces (`/admin/*`):** fidelity-exempt. No prototype frames exist or are required; build them plainly from Selah primitives and tokens. This is the only exemption.
- Every PR/commit that touches UI states, in its description, which prototype frame it implements and confirms visual parity.

The purpose of this project's entire pipeline (PRD → Relume wireframes → Claude Design prototype → this build) is that **the build is an act of faithful translation, not fresh design.** Fresh design during the build is how the premium, deliberate feel gets diluted into generic output. Translate the prototype exactly.

## Brand + Design System

Brand: navy + gold + vellum, the cross mark, Playfair Display / Cormorant Garamond / Source Sans 3. The full design language is **"Selah"** — documented in **SKILL.md**. Read SKILL.md before writing any component. Core rule to internalize now: **navy is the environment, vellum panels sit within it, gold is spent in exactly one place per screen.** Cream is never a full-bleed background. And per the Prototype Fidelity section above: SKILL.md defines the system, the Claude Design prototype defines how the system is applied to each specific screen — build to the frame.

## Subscription Tiers

Two tiers. Stripe only this phase.

| | Free | Premium |
|---|---|---|
| Price | $0 | **$7.99/month or $49.99/year** (save 48%, $4.17/mo effective) |
| Discernment sessions | 1/month | Unlimited |
| Daily Scale (weigh + see + learn) | Full | Full |
| Daily Scale history | — | Last 7 days |
| Journal | Last 3 entries | Unlimited |
| Fruit diagnostic (Step 6) | Locked | Included |
| Follow-ups, sharing, streaks | — | Included |

**Sacred Seven Trial:** 7-day free trial via Stripe Checkout trial. Stripe requires a card for trials — copy everywhere reads **"Free for 7 days. Cancel anytime."** NEVER "no credit card."

Payments: Stripe Checkout to purchase, Stripe Customer Portal to manage, existing webhook route to sync state. `subscriptions.source` column already supports `stripe` and `google` — native IAP resumes there later.

## The Daily Scale (acquisition + habit surface)

Primary retention mechanic. 3-phase flow: **WEIGH** (read question + two argued sides, pick one, one vote/user enforced by `daily_scale_votes` unique constraint) → **SEE** (animated results reveal, "N believers weighed in", majority/minority line) → **LEARN** (Scripture Lens: reference, verse, teaching that NEVER declares a winner, closing prayer). Expires at local midnight. Seeded baseline votes prevent empty-room effect. Free users get the full daily experience; Premium unlocks 7-day history.

**Selection (v2):** a daily pg_cron selector promotes exactly one `approved` scale to `published` by stamping `published_date` — the selector excludes any scale whose `published_date` is set, so **a question can never appear twice** (query constraint, not policy). It refuses same-`territory` back-to-back days (relaxing territory rather than ever skipping a day), rotates least-recently-used territories, FIFO by `approved_at`. Lazy fallback selection inside GET `/api/daily-scale` if the cron misses. Resend admin alert when the approved pool < 21 (warning) / < 7 (critical). Content supply beyond the seeded 30: the review-gated AI generation pipeline (post-launch — see `biblediscern-scale-pipeline-spec.md`); generated scales NEVER auto-publish. Manual curation and approvals happen on the in-phase `/admin/scales` surface.

Web additions (additive): public teaser on landing (voting requires account), share card after SEE (OG image via `/api/og`), public archive at `/scale/[slug]` (30 seeded scales = 30 SEO pages at launch, +1 daily).

## The 7-Step Discernment Journey (depth + monetization surface)

1. **The Crossroads** — situation + tone selector (reflective/urgent/encouragement/lament)
2. **The Word** — 3 matched scriptures + explanations
3. **Those Who Walked Before** — 2 biblical narrative matches
4. **The Examination** — 5 Ignatian-inspired questions
5. **The Stillness** — 90s guided silence (Wake Lock keeps screen awake)
6. **The Fruit** — Fruit of the Spirit diagnostic + radial chart — **PREMIUM ONLY**
7. **The Prayer** — personalized AI prayer + "Set my Ebenezer Stone" → journal

`/api/discern` calls Claude with the existing system prompt, tier gating, Zod validation, **crisis-keyword screening before any Claude call**, rate limiting (10 req/min/user), and the permanent disclaimer. Journey state persists to sessionStorage + server after each step (tab close never loses a session).

## Spiritual Journal (retention moat)

Every completed journey saves an entry. Types: discernment / reflection / answered_prayer / god_showed_up. Free tier: last 3 entries; Premium: full history. Empty state copy: "Your first stone hasn't been set yet. It will be."

## Onboarding (6 screens, runs after signup)

1. The Hook 2. Season selection 3. Micro-discernment (5s countdown) 4. Notification time picker → request Web Push (iOS-Safari-not-installed → swap to "Add to Home Screen" instruction sheet with a Continue path; never a dead end) 5. First Daily Scale 6. Soft paywall (annual highlighted, "Start my 7-day free trial" → Stripe Checkout, "Continue with free plan" skip link always visible). `onboarding_completed` set true on both paths; paywall never shows again. No skip on screens 1–5.

## Database Tables (Supabase — carried over from v1, unchanged)

7 tables, all with RLS: `profiles` (+ `onboarding_season`, `daily_scale_time`, `onboarding_completed`), `sessions`, `journal_entries`, `subscriptions` (`source` supports stripe/google), `daily_moments` (legacy fallback), `daily_scales` (+ v2 scheduling lifecycle: `status` draft/approved/scheduled/published/retired · `published_date` nullable-UNIQUE, stamped once by the selector — **the structural no-repeat guarantee** · `territory` topic tag · `source` seeded/manual/generated · `approved_at`), `daily_scale_votes` (unique per user+scale). RLS: users read/write only their own rows; `daily_scales` — clients may read **published rows only** (draft/approved/scheduled/retired are server-side); votes read/create own only; subscriptions read-only for users (server writes via service role).

## API Routes (web/app/api/ — contracts FROZEN)

| Route | Method | Purpose | Auth |
|-------|--------|---------|------|
| /api/discern | POST | Discernment engine — Claude call, saves session | Yes |
| /api/sessions, /api/sessions/[id] | GET/PATCH | Sessions | Yes |
| /api/journal, /api/journal/[id] | GET/POST/PATCH/DELETE | Journal | Yes |
| /api/profile | GET/PATCH | Profile | Yes |
| /api/subscription | GET | Subscription status | Yes |
| /api/daily-scale | GET | Today's scale (hides results until voted) | Yes |
| /api/daily-scale/vote | POST | Cast vote | Yes |
| /api/daily-scale/history | GET | Past 7 scales (Premium) | Yes |
| /api/webhooks/stripe | POST | Subscription events | Webhook |
| /api/og | GET | OG images (scale share cards) | Public |
| /api/push/subscribe | POST | Store Web Push subscription | Yes |
| /api/admin/scales | GET/POST | Admin: list/filter scales; create manual scale | Admin |
| /api/admin/scales/[id] | PATCH | Admin: edit draft/approved, approve, retire | Admin |

Rate limit: 10 req/min/user on /api/discern. Any new route is additive — never change an existing contract. **Admin routes:** every request re-checks the `ADMIN_EMAILS` allowlist server-side; non-admins receive **404** (never a redirect that advertises the route). Admin writes go through the service-role client on the server *after* the allowlist check — client RLS still only exposes `published` rows.

## PWA Requirements

- **Manifest:** `short_name: BibleDiscern`, `theme_color #1B2A4A`, `background_color #FDF6EC`, maskable icons 192/512, `display: standalone`.
- **Service worker:** precache app shell + fonts + icons; runtime cache today's scale (stale-while-revalidate) and journal list (network-first); **NEVER cache /api/discern or auth**.
- **Install prompt:** custom UI from deferred `beforeinstallprompt` (Android/desktop); iOS instruction sheet. Surface only at high-intent moments (after first scale, after first journey, Settings). Never on first paint.
- **Web Push (VAPID):** daily-scale reminder at the user's chosen time. iOS only when installed (16.4+); email fallback (Resend) for opted-in non-installed users.
- **Wake Lock:** active during Stillness, released on exit.
- **Performance:** LCP < 2.0s on 4G mid-tier; CLS < 0.1; Lighthouse installable = pass. Fonts self-hosted via `next/font`, subset, `display: swap`.
- **Offline:** cached scale shown; designed offline state, never a browser error.

## Coding Conventions

### TypeScript
- Strict mode. Import all domain types from `@librato/shared` — never redefine locally. Zod for all API validation. No `any` except JSON parsing (use `unknown`, narrow).

### Next.js
- App Router. Server components by default; `'use client'` only when needed. Supabase server client in API routes — never expose service role key. Typed JSON responses with correct status codes.

### React / UI
- Functional components. Zustand for global state (platform-agnostic). Never hardcode hex — consume tokens. Every screen handles loading/error/empty/offline. Behavior in hooks, rendering in components. Tailwind classes derive from token config. Respect `prefers-reduced-motion` everywhere.

### Git
- Conventional commits (feat:/fix:/chore:/docs:). Never commit `.env`. `turbo.json` globalEnv must list every env var used in build.

## Safety & Security Rules (non-negotiable)

### NEVER
- Never log user situation text to analytics or server logs.
- Never expose the Supabase service role key to the client.
- Never let the AI claim to speak for God or give directive "you should" advice.
- Never forward input to Claude if crisis keywords are detected — show resources instead.
- Never declare a winner in the Daily Scale Scripture Lens.
- Never store auth tokens outside secure storage.
- Never disable RLS on any table.
- Never cache `/api/discern` responses in the service worker.

### ALWAYS
- Always run crisis-keyword screening before any Claude call; show 988 / Crisis Text Line / RAINN on detection.
- Always validate input with Zod before Claude.
- Always check subscription tier before allowing session creation.
- Always show the disclaimer on every session: "This tool supports reflection — it does not replace God, Scripture, or wise counsel."
- Always enforce rate limiting on /api/discern.
- Always use the canonical trial line: "Free for 7 days. Cancel anytime."
- Always enforce the ADMIN_EMAILS allowlist server-side on every /admin page and /api/admin route; non-admins receive 404.
- Always list env vars in turbo.json globalEnv.

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
# Anthropic
ANTHROPIC_API_KEY=
# Stripe (only payment rail this phase)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_PREMIUM_MONTHLY=
STRIPE_PRICE_ID_PREMIUM_ANNUAL=
# Email
RESEND_API_KEY=
# Web Push (VAPID)
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
# App
NEXT_PUBLIC_APP_URL=https://biblediscern.app
ADMIN_EMAILS=            # comma-separated; gates /admin pages and /api/admin routes (server-side)
```

All non-`NEXT_PUBLIC_` vars must be in `turbo.json` globalEnv for Vercel builds. Rotate Anthropic/Stripe/Resend keys before public launch (deferred pre-launch step).

## What Is NOT in This Phase

Native builds and store submissions · RevenueCat changes · any work in `mobile/` · dark mode (Phase 2: "Vespers") · community/prayer wall/groups · church tiers · multi-language · voice/TTS · widgets · the Follow-Up Agent · the AI scale-generation pipeline (first post-launch update — specified in `biblediscern-scale-pipeline-spec.md`; the scheduling schema it feeds ships in THIS phase) · guest voting.

## Native Transition (Phase 3 — pre-committed triggers)

Begin native work when ANY of: 1,000 weekly active users · 150 paying subscribers · sustained ≥25% D7 retention for 4 consecutive weeks. Then: unfreeze `mobile/`, point it at the same `@librato/shared` + API, re-skin from Selah tokens, fill the Google Play closed test from real users, ship. iOS follows Apple Developer enrollment (needs Mac access). Verify current Google Play alternative-billing rules at that time. Until a trigger fires: no native work.

## Quick Reference Commands

```bash
# Web dev (the product)
cd web && npm run dev

# Build shared package
cd packages/shared && npm run build

# Seed daily scales
cd web && npm run seed:scale

# Deploy (or push to GitHub for auto-deploy)
cd web && vercel --prod
```
