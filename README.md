# BibleDiscern

> **Weigh it with wisdom.**
>
> From the Latin *librato* — to weigh, to balance, to ponder.

BibleDiscern is an AI-powered Christian Discernment Companion that guides users through a structured 7-step biblical discernment journey.

---

## Architecture

```
bible-discern/
├── mobile/          # Expo React Native app (iOS + Android)
├── web/             # Next.js 14 (marketing site + API backend)
└── packages/
    └── shared/      # Shared TypeScript types, constants, validation, API client
```

## Prerequisites

- Node.js 18+
- npm 9+
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Fill in all values in .env
```

### 3. Set up Supabase

```bash
# Option A: Local development
supabase start
supabase db reset  # Runs all migrations

# Option B: Remote project
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

### 4. Run development servers

```bash
# All packages
npm run dev

# Individual
cd web && npm run dev
cd mobile && npx expo start
```

## Build Stages

| Stage | Description | Status |
|-------|-------------|--------|
| 1 | Monorepo foundation + database schema | ✅ Complete |
| 2 | Next.js web scaffold + Supabase auth | Pending |
| 3 | Mobile core (auth, home, journey) | Pending |
| 4 | Journal + payments (Stripe + RevenueCat) | Pending |
| 5 | Polish (animations, haptics, notifications) | Pending |
| 6 | Marketing website | Pending |
| 7 | Launch (App Store + Google Play) | Pending |

## Environment Variables

See [`.env.example`](.env.example) for all required variables.

## Database

Schema is defined in [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql).

Tables: `profiles`, `sessions`, `journal_entries`, `subscriptions`, `daily_moments`

RLS is enabled on all tables. Users can only access their own data.
