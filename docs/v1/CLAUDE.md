# CLAUDE.md — LibratoAi Project Configuration

> This file is read by Claude Code at the start of every session. It contains the project context, architecture, conventions, and rules. Keep it updated as the project evolves.

## Project Overview

**LibratoAi** is an AI-powered Christian Discernment Companion mobile app for iOS and Android. The name comes from the Latin "librato" meaning "to weigh, to balance, to ponder." Tagline: **"Weigh it with wisdom."**

It guides Christians through a structured 7-step discernment journey rooted in Scripture, powered by the Anthropic Claude API, and grounded in Ignatian spiritual exercises and Wesleyan quadrilateral methodology. It is NOT a chatbot — it is a guided spiritual process.

BibleDiscern also includes **The Daily Scale** — a daily engagement feature where users weigh a spiritual tension (a question with two biblical perspectives), vote, see community results, and receive a Scripture Lens teaching. This trains the discernment muscle daily.

**Current phase:** MVP (Phase 1) — lean launch with 2 subscription tiers only.

## Architecture

This is a **mobile-first** monorepo. The mobile app IS the product. The web app is marketing + API backend only.

```
librato-ai/
├── mobile/                    # Expo / React Native app (THE PRODUCT)
│   ├── app/                   # Expo Router v3 (file-based routing)
│   │   ├── (auth)/            # Login, signup, onboarding
│   │   ├── (tabs)/            # 4-tab navigator (Home, Discern, Journal, Settings)
│   │   ├── discern/[sessionId].tsx  # 7-step journey viewer
│   │   ├── journal/[entryId].tsx    # Journal entry detail
│   │   └── upgrade.tsx              # Premium upgrade screen
│   ├── components/
│   │   ├── ui/                # Reusable: Button, Card, Badge, Input, etc.
│   │   ├── journey/           # Step1Word, Step2Narratives, Step3Examination, Step4Stillness, Step5Fruit, Step6Prayer
│   │   ├── scale/             # DailyScale (3-phase: WEIGH → SEE → LEARN)
│   │   ├── journal/           # JournalCard, JournalTimeline
│   │   └── common/            # Header, TabBar, LoadingScreen, UpgradeGate, OfflineBanner, CrisisScreen
│   ├── hooks/                 # useAuth, useSession, useSubscription, useDaily, useFeatureGate, useNetworkStatus
│   ├── stores/                # Zustand: useAuthStore, useSubscriptionStore, useSessionStore, useScaleStore, useOnboardingStore
│   ├── lib/                   # api client, cache, notifications, purchases
│   ├── constants/             # theme (colors, fonts, spacing)
│   └── assets/                # App icon, splash, font files
├── web/                       # Next.js 14 (MARKETING + API ONLY)
│   ├── app/
│   │   ├── (marketing)/       # Landing page, about, pricing, blog
│   │   ├── api/               # All API routes the mobile app calls
│   │   └── layout.tsx
│   ├── lib/                   # Supabase clients, push notifications, helpers
│   └── scripts/               # Seed scripts
├── packages/
│   └── shared/                # Shared TS types, constants, validation, API client
│       └── src/
│           ├── types.ts
│           ├── constants.ts
│           ├── validation.ts
│           ├── api-client.ts
│           └── index.ts
├── supabase/
│   └── migrations/            # SQL migration files
├── .env                       # Environment variables (NEVER commit)
├── .env.example               # Template for env vars
├── turbo.json                 # Turborepo config
└── CLAUDE.md                  # This file
```

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Mobile app | Expo SDK 52+, Expo Router v3, TypeScript | THE PRODUCT |
| Mobile state | Zustand | Lightweight, RN-compatible |
| Mobile styling | Nativewind OR StyleSheet with design tokens | Match brand palette |
| Mobile animation | react-native-reanimated | Stillness Engine breathing |
| Mobile SVG | react-native-svg | Fruit of the Spirit chart |
| Mobile haptics | expo-haptics | Step transitions, save confirmations |
| Mobile storage | expo-secure-store (auth), AsyncStorage (cache) | Tokens MUST use secure store |
| Mobile IAP | RevenueCat | Apple/Google subscriptions — NOT Stripe in-app |
| Mobile notifications | expo-notifications | Daily moment, follow-ups, trial expiry |
| API backend | Next.js 14 (App Router), TypeScript | Hosted on Vercel |
| AI | Anthropic Claude API | Sonnet for free tier, Opus for premium |
| Database | Supabase (PostgreSQL + Auth + RLS) | RLS on EVERY table |
| Web payments | Stripe | Web-only signups (not in mobile app) |
| Mobile payments | RevenueCat | Handles Apple/Google IAP compliance |
| Email | Resend | Follow-up reminders |
| Hosting | Vercel (web), EAS Build (mobile) | |
| Monorepo | Turborepo or npm workspaces | |

## Brand Identity

```
Name:           LibratoAi
Tagline:        "Weigh it with wisdom"
Latin meaning:  "librato" — to weigh, to balance, to ponder

Colors:
  Navy (primary):    #1B2A4A
  Navy light:        #2D4166
  Gold (accent):     #C8A45E
  Gold light:        #E8D5A3
  Gold muted:        #D4BA7A
  Cream (bg):        #FDF6EC
  Parchment:         #F5ECD7
  Warm white:        #FEFCF6
  Text dark:         #2C2418
  Text medium:       #5C5144
  Text light:        #8A7F72
  Sage:              #7A8B6F
  Border:            #E8DFD0
  Error:             #C0392B

Typography (mobile — via expo-google-fonts):
  Display/headings:  Playfair Display
  Scripture/prayers: Cormorant Garamond (italic)
  Body text:         Source Sans 3

Typography (web — via next/font):
  Same families, self-hosted

Logo:
  Simple Christian cross (vertical line + horizontal crossbar)
  Navy strokes on light backgrounds, gold on dark backgrounds

Tone:
  Reverent, calm, minimal
  Like a wise spiritual mentor, NOT a tech product
  Never preachy, never performative
  Honest about complexity
```

## Subscription Tiers

Only 2 tiers in MVP. No Covenant, Shepherd, or church tiers.

| | Free | Premium |
|---|---|---|
| Price | $0 | $7.99/month or $49.99/year |
| Sessions | 1/month | Unlimited |
| 7-step journey | Full | Full |
| Stillness Engine | Yes | Yes |
| The Daily Scale (vote + results) | Yes | Yes |
| Daily Scale history (7 days) | No | Yes |
| Journal | Last 3 entries | Unlimited |
| Fruit diagnostic | Locked | Yes |
| Follow-ups | No | Yes |
| Scripture sharing | No | Yes |

**Sacred Seven Trial:** 7 days of Premium for all new users. No credit card. Configured at App Store / Play Store level via RevenueCat.

**IAP Product IDs:**
- `biblediscern_premium_monthly` — $7.99/month auto-renewable
- `biblediscern_premium_annual` — $49.99/year auto-renewable

**CRITICAL:** Mobile subscriptions MUST go through App Store / Play Store IAP (via RevenueCat). Using Stripe inside the mobile app violates store policies. Stripe is only for web-based signups.

## The 7-Step Discernment Journey

This is the core product. Each session flows through these steps:

1. **The Crossroads** — User describes situation + selects tone (reflective/urgent/encouragement/lament)
2. **The Word** — 3 contextually matched scriptures with plain-language explanations
3. **Those Who Walked Before** — 2 biblical narrative matches (characters who faced similar decisions)
4. **The Examination** — 5 probing reflection questions (Ignatian-inspired)
5. **The Stillness** — 90-second guided silence with breathing animation, then "What surfaced?" prompt
6. **The Fruit** — Fruit of the Spirit diagnostic (Galatians 5:22-23) with radial chart (PREMIUM ONLY)
7. **The Prayer** — AI-generated personalized prayer + "Set My Ebenezer Stone" save to journal

## Onboarding Flow

6-screen high-converting onboarding: **emotional hook → season selection → micro-discernment exercise → notification opt-in → first Daily Scale → soft paywall**

1. **Screen 1 — The Hook:** Full-bleed headline copy with BalanceScaleIcon. Establishes product value. Single "Begin" CTA.
2. **Screen 2 — Season Selection:** User picks their current life season (e.g., "A major decision", "A season of waiting"). Saved to `profiles.onboarding_season`.
3. **Screen 3 — Micro-discernment:** 5-second countdown ring, user answers a single reflection prompt. Demonstrates the product in 30 seconds.
4. **Screen 4 — Notification opt-in:** Time picker framed as "When should your Daily Scale arrive?" Saves HH:MM to `profiles.daily_scale_time`. Requests push permission.
5. **Screen 5 — First Daily Scale:** Calls `fetchTodayScale()`, renders the live `<DailyScale />` component. User gets to WEIGH their first spiritual tension before entering the app.
6. **Screen 6 — Soft Paywall (The Offer):** Full-screen offer with Monthly/Annual plan selector. Annual pre-selected with SAVE 48% badge. "Start my 7-day free trial" CTA triggers RevenueCat purchase flow. "Continue with free plan" skip link MUST always be visible (Apple/Google requirement). On success: navigate to home + toast "Welcome to Premium." On skip: navigate to home silently. `onboarding_completed = true` set in BOTH cases.

State machine: no back navigation, no swipe-back gesture, Reanimated crossfade transitions (400ms). State managed by `useOnboardingStore`.

**RevenueCat IAP Product IDs:**
- `biblediscern_premium_monthly` — $7.99/month auto-renewable
- `biblediscern_premium_annual` — $49.99/year auto-renewable (default selected on paywall)

**Paywall interaction rules:**
- Annual card selected by default (gold 2px border). Tapping monthly switches selection. `selectionAsync()` haptic on switch.
- CTA text is always "Start my 7-day free trial" regardless of plan (trial length is the same; plan determines post-trial charge).
- On RevenueCat success: call `POST /api/subscription/validate` to sync backend, then navigate home.
- On RevenueCat cancel: stay on paywall — no error shown.
- On RevenueCat error or SDK not initialized: toast "Something went wrong. Try again or continue with the free plan."
- Skip link is never hidden, never delayed beyond 2000ms, never guilt-tripped.

## Claude API System Prompt

Use this exact system prompt for POST /api/discern:

```
You are LibratoAi, an AI Christian Discernment Companion. Your name comes from the Latin "librato" meaning "to weigh, to balance, to ponder." You speak like a wise, gentle spiritual mentor — warm, theologically grounded, never preachy. You NEVER claim to speak for God or give directive advice like "You should..." Instead you facilitate discernment through Scripture, reflection, and prayer.

When given a user's situation, respond with ONLY valid JSON (no markdown, no backticks) in this exact structure:
{
  "summary": "A brief, empathetic 1-sentence acknowledgment of their situation",
  "biblicalNarratives": [
    {
      "character": "Biblical character name",
      "reference": "Book Chapter:Verse-Verse",
      "connection": "2-3 sentences explaining how this character faced a structurally similar decision",
      "lesson": "1-2 sentences on what God did in their story and the pattern that emerged"
    }
  ],
  "scriptures": [
    {
      "reference": "Book Chapter:Verse-Verse",
      "text": "The actual verse text (use ESV or NIV)",
      "context": "1-2 sentences of plain-language explanation and how it connects to the user's situation"
    }
  ],
  "examination": [
    "A probing reflection question about motives",
    "A question about fears or emotions driving the decision",
    "A question about what peace or conviction they feel",
    "A question about who they trust to speak truth into this",
    "A question connecting to the Fruit of the Spirit (love, joy, peace, patience, etc.)"
  ],
  "fruitDiagnostic": {
    "love": "A brief question or observation about love in this decision",
    "joy": "About deep joy vs superficial happiness",
    "peace": "About inner peace or restlessness",
    "patience": "About rushing or waiting",
    "kindness": "About impact on others",
    "goodness": "About character alignment",
    "faithfulness": "About honoring commitments",
    "gentleness": "About self-compassion",
    "selfControl": "About impulses driving the decision"
  },
  "prayer": "A personalized prayer (4-6 sentences) that names the specific situation, references the scriptures explored, echoes the user's emotions, doesn't presume an outcome, and asks for wisdom, peace, and courage. End with Amen.",
  "closingWord": "A brief (1-2 sentence) encouraging closing thought that points the user to trust God's timing."
}

Provide exactly 2 biblical narratives, exactly 3 scriptures, and exactly 5 examination questions. Make everything deeply personal to the specific situation described. Never be generic.
```

**Model selection:** `claude-sonnet-4-20250514` for free tier, `claude-opus-4-20250514` for premium tier.

## Database Tables

7 tables in Supabase, ALL with Row Level Security:

1. **profiles** — extends auth.users. Stores name, timezone, tier, push token, trial status, `onboarding_season` (TEXT), `daily_scale_time` (TEXT, default `'08:00'`).
2. **sessions** — discernment sessions. Stores situation, tone, ai_response (JSONB), stillness_note, follow-up states.
3. **journal_entries** — Ebenezer stones. Linked to sessions. Types: discernment, reflection, answered_prayer, god_showed_up.
4. **subscriptions** — tracks tier, billing interval, source (stripe/apple/google), sessions used this month.
5. **daily_moments** — pre-seeded daily scripture + reflection + prayer.
6. **daily_scales** — pre-seeded daily questions with both sides (label + argument), scripture reference/text/lens, prayer, and vote counts (votes_a, votes_b). One row per date, UNIQUE constraint on `date`.
7. **daily_scale_votes** — tracks individual user votes. Columns: user_id, scale_id, vote ('a'|'b'), created_at. UNIQUE constraint on `(user_id, scale_id)` prevents double-voting.

**RLS rules:** Users can only read/write their own data. daily_moments and daily_scales are readable by all authenticated users. daily_scale_votes: users can read/insert their own rows only. Subscriptions are read-only for users (server writes via service role).

## API Routes (Next.js /web/app/api/)

| Route | Method | Purpose | Auth |
|-------|--------|---------|------|
| /api/discern | POST | Core discernment engine — calls Claude, saves session | Yes |
| /api/sessions | GET | List user's sessions (paginated) | Yes |
| /api/sessions/[id] | GET/PATCH | Get or update single session | Yes |
| /api/journal | GET/POST | List or create journal entries | Yes |
| /api/journal/[id] | GET/PATCH/DELETE | Single journal entry CRUD | Yes |
| /api/profile | GET/PATCH | User profile read/update | Yes |
| /api/subscription | GET | Current subscription status | Yes |
| /api/subscription/validate | POST | Validate Apple/Google receipt | Yes |
| /api/daily-moment | GET | Today's daily moment | Yes |
| /api/daily-scale | GET | Today's scale (hides scripture/results until voted) | Yes |
| /api/daily-scale/vote | POST | Cast vote for side a or b (atomic increment) | Yes |
| /api/daily-scale/history | GET | Past 7 scales with user votes (Premium only) | Yes |
| /api/follow-up | GET (cron) | Check & send follow-up emails | Server |
| /api/webhooks/stripe | POST | Stripe subscription events | Webhook |
| /api/webhooks/revenuecat | POST | RevenueCat subscription events | Webhook |
| /api/og | GET | Dynamic OG image generation | Public |

**Rate limiting:** 10 requests/minute per user on /api/discern.

## Coding Conventions

### TypeScript
- Strict mode everywhere (`"strict": true` in all tsconfig files)
- Use shared types from `@librato/shared` — never redefine types locally
- Prefer `interface` over `type` for object shapes
- Use Zod for all API request/response validation
- No `any` types — use `unknown` and narrow with type guards

### React Native (mobile)
- Functional components only, no class components
- Use Expo Router for all navigation (file-based routing)
- Zustand for global state (auth, subscription, sessions)
- expo-secure-store for auth tokens — NEVER AsyncStorage for tokens
- AsyncStorage only for non-sensitive cache data
- react-native-reanimated for all animations (not Animated API)
- All text must use brand fonts (Playfair Display, Cormorant Garamond, Source Sans 3)
- Use the brand color constants from shared package — never hardcode hex values
- Every screen must handle: loading state, error state, empty state, offline state
- Pull-to-refresh on all list screens

### Next.js (web)
- App Router only (no pages/ directory)
- Server components by default, 'use client' only when needed
- Use Next.js metadata API for SEO on every page
- Supabase server client for API routes, never expose service role key to client
- All API routes return typed JSON with proper HTTP status codes

### Styling
- Mobile: Nativewind (Tailwind for RN) or StyleSheet objects — pick one and be consistent
- Web: Tailwind CSS
- Both: import colors/spacing from shared constants, never hardcode
- Design should feel reverent and calm — generous whitespace, soft typography, contemplative

### Git
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `style:`, `refactor:`
- Branch naming: `feat/stillness-engine`, `fix/journal-loading`, `chore/update-deps`
- Never commit .env files
- Always commit .env.example with placeholder values

## Safety & Security Rules

### NEVER do:
- Never log user situations to analytics or server logs (sensitive spiritual content)
- Never expose Supabase service role key to client
- Never use Stripe for in-app mobile purchases (violates store policies)
- Never let the AI claim to speak for God ("God is telling you to...")
- Never let the AI give directive advice ("You should...")
- Never send user input to Claude if crisis keywords are detected — show safety screen first
- Never store auth tokens in AsyncStorage (use expo-secure-store)
- Never disable RLS on any table

### ALWAYS do:
- Always validate user input with Zod before passing to Claude
- Always check subscription tier before allowing session creation
- Always sanitize user input before Claude API calls
- Always include the disclaimer: "This tool supports reflection — it does not replace God, Scripture, or wise counsel."
- Always show crisis resources (988, Crisis Text Line, RAINN) when concerning language detected
- Always enforce rate limiting on /api/discern (10 req/min)
- Always use HTTPS for all API calls

### Crisis Keywords (check client-side BEFORE API call):
```
suicide, kill myself, end my life, want to die, self-harm,
cutting myself, hurting myself, abuse, being abused,
domestic violence, molest, rape, assault
```

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic Claude API
ANTHROPIC_API_KEY=

# Stripe (web subscriptions only)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_PREMIUM_MONTHLY=
STRIPE_PRICE_ID_PREMIUM_ANNUAL=

# RevenueCat (mobile subscriptions)
REVENUECAT_API_KEY=
REVENUECAT_WEBHOOK_SECRET=

# Apple IAP validation
APPLE_SHARED_SECRET=

# Email
RESEND_API_KEY=

# Expo push notifications
EXPO_PUSH_ACCESS_TOKEN=

# App URL
NEXT_PUBLIC_APP_URL=https://librato.ai
```

## Build Stages

The project is built in 7 stages. See `librato-ai-staged-build-prompts.md` for the full stage-by-stage prompts.

1. **Stage 1:** Monorepo + shared code + Supabase schema
2. **Stage 2:** Next.js API backend + Claude integration
3. **Stage 3:** Mobile app core (auth + tabs + 7-step journey) — LARGEST STAGE
4. **Stage 4:** Journal + upgrade + settings + RevenueCat payments
5. **Stage 5:** Push notifications + offline + safety + polish
6. **Stage 6:** Marketing website + SEO/GEO/AEO/AI-SEO + blog
7. **Stage 7:** App Store + Play Store submission prep

## What Is NOT in MVP

These features are deliberately excluded until post-launch user testing:
- Community prayer wall / prayer circles
- Church partnerships / Shepherd tier / Covenant tier
- Denomination customization (Catholic/Protestant/etc.)
- Accountability partnerships
- Small group discernment mode
- Family sharing
- Multi-language support
- Anonymous testimony sharing
- Biblical narrative vector embeddings (Claude's built-in knowledge is sufficient)
- Web-based app experience (web is marketing site only)
- Voice prayer audio (TTS)
- Annual pricing testing / A-B pricing (ship with both monthly + annual, optimize later)
- **Home screen widgets (iOS WidgetKit / Android Glance) — Phase 2**
  - Widget will display the Daily Scale question on the user's home screen
  - Interactive widget allowing voting without opening the app

## Quick Reference Commands

```bash
# Start mobile dev server
cd mobile && npx expo start

# Start web dev server
cd web && npm run dev

# Build shared package
cd packages/shared && npm run build

# Run Supabase migrations
supabase db push

# Build mobile for iOS (development)
cd mobile && eas build --platform ios --profile development

# Build mobile for Android (development)
cd mobile && eas build --platform android --profile development

# Build mobile for production
cd mobile && eas build --platform all --profile production

# Deploy web to Vercel
cd web && vercel --prod

# Seed daily moments
cd web && npx tsx scripts/seed-daily-moments.ts

# Seed daily scales (30 days of content)
cd web && npm run seed:scale
```

## Key URLs

- Production website: https://librato.ai
- Supabase dashboard: https://supabase.com/dashboard
- Stripe dashboard: https://dashboard.stripe.com
- RevenueCat dashboard: https://app.revenuecat.com
- App Store Connect: https://appstoreconnect.apple.com
- Google Play Console: https://play.google.com/console
- Anthropic Console: https://console.anthropic.com
- Expo dashboard: https://expo.dev
- Vercel dashboard: https://vercel.com/dashboard
