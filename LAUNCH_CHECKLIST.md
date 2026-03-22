# LibratoAi Launch Checklist

Pre-submission checklist for App Store and Google Play.
Complete every item before submitting to app review.

---

## 1. Infrastructure & Environment

### Supabase (Production)
- [ ] Production Supabase project created (separate from development)
- [ ] All database tables migrated to production (`supabase db push --linked`)
- [ ] Row-level security policies verified on all tables:
  - [ ] `profiles` — users can only read/write their own row
  - [ ] `sessions` — users can only read/write their own sessions
  - [ ] `journal_entries` — users can only read/write their own entries
  - [ ] `daily_moments` — all authenticated users can read
- [ ] Realtime disabled for tables that don't need it (performance)
- [ ] Supabase Auth: Email/password enabled
- [ ] Supabase Auth: Apple OAuth configured (Team ID, Key ID, private key)
- [ ] Auth redirect URLs set to `librato://` and `https://librato.ai`
- [ ] Production environment variables noted (URL + anon key)

### Vercel (Production Web + API)
- [ ] Web app deployed to production on Vercel
- [ ] All environment variables set in Vercel project settings:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `ANTHROPIC_API_KEY`
  - [ ] `RESEND_API_KEY`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] `REVENUECAT_WEBHOOK_SECRET`
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Custom domain `librato.ai` configured and SSL active
- [ ] `https://librato.ai` loads correctly
- [ ] `https://librato.ai/privacy` loads correctly
- [ ] `https://librato.ai/terms` loads correctly
- [ ] `https://librato.ai/sitemap.xml` returns valid sitemap
- [ ] `https://librato.ai/.well-known/apple-app-site-association` returns JSON (no file extension)
- [ ] `https://librato.ai/.well-known/assetlinks.json` returns valid JSON

### Vercel Cron Jobs
- [ ] Follow-up cron job (`/api/follow-up`) configured in `vercel.json`
- [ ] Cron schedule verified: runs daily at 09:00 UTC
- [ ] Cron job tested in production with a known journal entry

---

## 2. API Routes (Test All in Production)

- [ ] `POST /api/discern` — returns valid discernment response (free model)
- [ ] `POST /api/discern` — returns premium response with opus model for Premium users
- [ ] `GET /api/sessions` — returns user's sessions
- [ ] `GET /api/sessions/[id]` — returns single session
- [ ] `GET/POST /api/journal` — CRUD on journal entries
- [ ] `GET/PUT /api/profile` — profile read and update
- [ ] `POST /api/subscription/validate` — validates RevenueCat receipt
- [ ] `GET /api/daily-moment` — returns today's daily moment
- [ ] `POST /api/webhooks/stripe` — stripe webhook verified (use Stripe CLI `stripe listen`)
- [ ] `POST /api/webhooks/revenuecat` — RevenueCat webhook verified

---

## 3. Payments & Subscriptions

### RevenueCat
- [ ] RevenueCat account created at app.revenuecat.com
- [ ] iOS app configured with Apple App Store credentials
- [ ] Android app configured with Google Play credentials
- [ ] Products created in RevenueCat:
  - [ ] `premium_monthly` — $4.99/month
  - [ ] `premium_annual` — $39.99/year
- [ ] Entitlement `premium` created and linked to both products
- [ ] 7-day free trial configured on both products
- [ ] RevenueCat sandbox tested end-to-end (purchase → webhook → subscription status update)
- [ ] RevenueCat webhook URL set to `https://librato.ai/api/webhooks/revenuecat`
- [ ] `EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY` set in app build
- [ ] `EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY` set in app build

### App Store Connect — In-App Purchases
- [ ] Monthly subscription product created (`com.librato.ai.premium.monthly`)
- [ ] Annual subscription product created (`com.librato.ai.premium.annual`)
- [ ] Subscription group created: "LibratoAi Premium"
- [ ] 7-day introductory offer configured on both products
- [ ] Pricing set: $4.99 / $39.99 (Tier 5 / Tier 40)
- [ ] Products submitted for review (IAPs reviewed separately)

### Google Play Console — Subscriptions
- [ ] Monthly subscription created (`premium_monthly`)
- [ ] Annual subscription created (`premium_annual`)
- [ ] 7-day free trial configured
- [ ] Pricing set: $4.99 / $39.99
- [ ] Grace period configured: 7 days

### Stripe (Web)
- [ ] Stripe account in live mode
- [ ] Products + prices created in Stripe Dashboard
- [ ] Stripe webhook endpoint: `https://librato.ai/api/webhooks/stripe`
- [ ] Webhook events: `checkout.session.completed`, `customer.subscription.deleted`, `customer.subscription.updated`
- [ ] `STRIPE_WEBHOOK_SECRET` updated with production webhook secret

---

## 4. App Build

### EAS Setup
- [ ] `eas login` completed with Expo account
- [ ] `eas init` run — EAS project ID in `app.json` → `extra.eas.projectId`
- [ ] `eas credentials` configured for iOS (Distribution Certificate + Provisioning Profile)
- [ ] `eas credentials` configured for Android (Upload Key)

### Asset Generation
- [ ] SVG source files reviewed: `mobile/assets/svg/icon.svg`, `mobile/assets/svg/splash.svg`
- [ ] `npm install --save-dev sharp` run in `/mobile`
- [ ] `node scripts/generate-assets.js` run successfully
- [ ] `mobile/assets/icon.png` exists (1024×1024)
- [ ] `mobile/assets/icon-android.png` exists (512×512)
- [ ] `mobile/assets/splash.png` exists (1284×2778)
- [ ] Icons look correct at small sizes (test at 60×60 on a dark background)

### app.json Final Check
- [ ] `bundleIdentifier`: `com.librato.ai`
- [ ] `package`: `com.librato.ai`
- [ ] `version`: `1.0.0`
- [ ] `buildNumber`: `1`
- [ ] `versionCode`: `1`
- [ ] `associatedDomains`: `applinks:librato.ai`
- [ ] Replace `TEAMID` in AASA file with actual Apple Team ID

### EAS Builds
- [ ] Preview build tested on physical iOS device (TestFlight internal)
- [ ] Preview build tested on physical Android device
- [ ] All 7 discernment steps verified end-to-end on device
- [ ] Push notifications tested: daily moment delivers at scheduled time
- [ ] Deep link tested: `librato://` scheme opens app
- [ ] Deep link tested: `https://librato.ai/upgrade` opens upgrade screen
- [ ] Offline state shows correctly when airplane mode enabled
- [ ] Crisis screen triggers correctly for test input
- [ ] Production build (`eas build --platform all --profile production`) run
- [ ] iOS `.ipa` generated successfully
- [ ] Android `.aab` generated successfully

---

## 5. App Store Connect Submission

- [ ] App Store Connect account: developer.apple.com/account
- [ ] App created in App Store Connect (`com.librato.ai`)
- [ ] App name: "LibratoAi: Christian Discernment"
- [ ] Primary category: Reference
- [ ] Secondary category: Lifestyle
- [ ] Subtitle filled in
- [ ] Keywords filled in (see `store-metadata/apple-app-store.md`)
- [ ] Description filled in (see `store-metadata/apple-app-store.md`)
- [ ] Promotional text filled in
- [ ] Screenshots uploaded:
  - [ ] 6.7" iPhone screenshots (6 screenshots) — see `store-metadata/screenshot-specs.md`
  - [ ] 6.5" iPhone screenshots (6 screenshots)
  - [ ] iPad 12.9" screenshots (if supportsTablet)
- [ ] App Preview video uploaded (optional but recommended)
- [ ] Age rating questionnaire completed (result: 4+)
- [ ] Privacy policy URL: `https://librato.ai/privacy`
- [ ] Support URL: `https://librato.ai`
- [ ] Privacy nutrition labels completed (see `store-metadata/privacy-nutrition-labels.md`)
- [ ] Review notes filled in (see `store-metadata/apple-app-store.md`)
- [ ] Test account credentials provided for reviewer
- [ ] Build uploaded to App Store Connect via EAS (`eas submit --platform ios --profile production`)
- [ ] **SUBMIT TO APP STORE REVIEW** ✓

---

## 6. Google Play Console Submission

- [ ] Google Play Console account: play.google.com/console
- [ ] App created (`com.librato.ai`)
- [ ] App name: "LibratoAi - AI Christian Discernment"
- [ ] Short description filled in
- [ ] Full description filled in (see `store-metadata/google-play-store.md`)
- [ ] Category: Books & Reference
- [ ] Screenshots uploaded:
  - [ ] Phone screenshots (2–8 screenshots) — see `store-metadata/screenshot-specs.md`
  - [ ] 7" tablet screenshots
  - [ ] 10" tablet screenshots (optional)
- [ ] Feature graphic uploaded (1024×500 px, JPG or PNG)
- [ ] App icon uploaded (512×512 px)
- [ ] Content rating questionnaire completed (result: Everyone)
- [ ] Data Safety section completed (see `store-metadata/data-safety-google.md`)
- [ ] Privacy policy URL: `https://librato.ai/privacy`
- [ ] `sha256_cert_fingerprints` in `assetlinks.json` replaced with actual fingerprint from Play Console
- [ ] Build uploaded to Internal Testing track via EAS (`eas submit --platform android --profile production`)
- [ ] Internal Testing build tested by at least 1 tester
- [ ] Promoted to Production track
- [ ] **SUBMIT TO GOOGLE PLAY REVIEW** ✓

---

## 7. Content & Data

- [ ] Daily moments seeded for 30 days: `cd web && npm run seed`
- [ ] Seed script verified: at least 30 rows in `daily_moments` table
- [ ] Test the daily moment API returns today's moment: `GET /api/daily-moment`

---

## 8. Marketing Website

- [ ] `https://librato.ai` loads the landing page
- [ ] `https://librato.ai/blog` shows 6 blog posts
- [ ] Each blog post page loads correctly
- [ ] `https://librato.ai/pricing` shows correct pricing
- [ ] App Store and Google Play buttons link to correct store URLs
  - [ ] Update `APP_STORE_URL` in `web/lib/seo.ts` with real App Store link after approval
  - [ ] Update `PLAY_STORE_URL` in `web/lib/seo.ts` with real Play Store link after approval
- [ ] OG image: `https://librato.ai/api/og` renders correctly
- [ ] Google Search Console: sitemap submitted
- [ ] Analytics set up (optional — add Vercel Analytics or Plausible)

---

## 9. Post-Launch

- [ ] Monitor App Store Connect for review status (typically 24–48 hours)
- [ ] Monitor Google Play Console for review status (typically a few hours to days)
- [ ] Set up error alerting (Sentry or Vercel error tracking)
- [ ] Set up uptime monitoring for `https://librato.ai`
- [ ] Respond to any App Review questions within 24 hours
- [ ] Announce launch 🎉

---

## Key Resources

| Resource | URL |
|----------|-----|
| App Store Connect | https://appstoreconnect.apple.com |
| Google Play Console | https://play.google.com/console |
| EAS Dashboard | https://expo.dev |
| RevenueCat Dashboard | https://app.revenuecat.com |
| Supabase Dashboard | https://app.supabase.com |
| Vercel Dashboard | https://vercel.com |
| Stripe Dashboard | https://dashboard.stripe.com |
| AASA Validator | https://branch.io/resources/aasa-validator/ |
| App Links Tester | https://developers.google.com/digital-asset-links/tools/generator |

---

*"He who began a good work in you will carry it on to completion." — Philippians 1:6*
