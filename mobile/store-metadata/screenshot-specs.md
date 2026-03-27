# Screenshot Specifications — BibleDiscern

Screenshots are taken manually from the running app. This document lists the 6 required screens, exact sizes, and capture notes for each platform.

---

## Required Screenshots (in order)

### Screenshot 1 — Welcome / Onboarding
**Screen:** `mobile/app/(auth)/onboarding.tsx`
**Capture state:** Onboarding step 1 — "Welcome to BibleDiscern" with tagline and brand mark visible
**Key elements:** Navy background, gold cross, "BibleDiscern" heading, tagline "Weigh it with wisdom", Begin button in gold
**Note:** This is the emotional first impression. Make sure the cross is centered and the gold is vivid.

### Screenshot 2 — The Crossroads (Input)
**Screen:** `mobile/app/(tabs)/discern.tsx`
**Capture state:** Situation text field with example text typed in (e.g., "I've been offered a promotion that would require me to relocate my family. I feel called to accept it but my spouse has reservations.")
**Key elements:** Step indicator at top, text area with example situation, "Begin Discernment" button
**Note:** Use a relatable, non-trivial situation. Shows the app's purpose immediately.

### Screenshot 3 — The Word (Scripture)
**Screen:** `mobile/app/discern/[sessionId].tsx` at Step 2 (The Word)
**Capture state:** Scripture card showing a verse (e.g., Proverbs 3:5-6), Biblical Narrative Match card (e.g., "Moses at the Burning Bush")
**Key elements:** Cream card, navy text, gold verse reference, parchment background, step title "The Word"
**Note:** Shows the core value prop — AI-curated Scripture for your specific situation.

### Screenshot 4 — The Stillness Engine
**Screen:** `mobile/app/discern/[sessionId].tsx` at Step 6 (The Stillness)
**Capture state:** Breathing circle mid-animation — expanded state (inhale phase)
**Key elements:** Navy background, animated gold circle, "Breathe" instruction text, timer showing elapsed time, Psalm 46:10 reference
**Note:** Capture during the inhale phase when the circle is largest. This is a visually distinctive screen.

### Screenshot 5 — The Fruit of the Spirit (Premium)
**Screen:** `mobile/app/discern/[sessionId].tsx` at Fruit of Spirit section
**Capture state:** Fruit diagnostic cards visible — showing 3-4 fruits with their scriptural application to the specific situation
**Key elements:** Individual fruit cards (e.g., "Peace — Philippians 4:7"), premium badge visible, gold accents
**Note:** Use a Premium test account. Shows premium value clearly.

### Screenshot 6 — The Prayer
**Screen:** `mobile/app/discern/[sessionId].tsx` at Step 7 (The Prayer)
**Capture state:** Full personalized prayer card with the complete prayer text and Save to Journal CTA
**Key elements:** Parchment card, italic prayer text in Cormorant Garamond, gold cross at top, "Save to Journal" button
**Note:** This is the emotional climax of the journey. Use a beautiful, specific prayer. Shows what users receive at the end.

---

## iOS Screenshot Sizes

All screenshots must be PNG. Portrait orientation only (app does not support landscape for iPhone).

| Device | Resolution | Size Label in App Store Connect |
|--------|-----------|--------------------------------|
| iPhone 15 Pro Max (6.7") | 1290 × 2796 px | **Required** — 6.7" display |
| iPhone 11 Pro Max (6.5") | 1242 × 2688 px | **Required** — 6.5" display |
| iPhone 8 Plus (5.5") | 1242 × 2208 px | Optional (Apple will scale from 6.5") |

**iPad (if supportsTablet: true):**
| Device | Resolution | Notes |
|--------|-----------|-------|
| iPad Pro 12.9" (6th gen) | 2048 × 2732 px | Required if any iPad screenshot is submitted |
| iPad Pro 11" (4th gen) | 1668 × 2388 px | Optional |

**Tip:** Use Xcode Simulator → File → Take Screenshot, or use the physical device. For the best quality, capture on the actual device and use iPhone 15 Pro Max as primary.

---

## Android Screenshot Sizes

| Device Type | Resolution | Notes |
|-------------|-----------|-------|
| Phone | 1080 × 1920 px minimum | At least 2 required |
| 7-inch tablet | 1200 × 1920 px | Required if tablet screenshots are submitted |
| 10-inch tablet | 1920 × 1200 px (landscape) | Optional |

**Format:** PNG or JPEG, 16:9 aspect ratio for phones.

---

## App Preview Video (Optional but Recommended — iOS Only)

A 15–30 second screen recording showing the full discernment flow:
1. Enter situation (2 sec)
2. Scripture card appears (3 sec)
3. Pan through steps 3-5 (5 sec)
4. Stillness Engine breathing animation (5 sec)
5. Prayer card appears and pulses (5 sec)
6. Save to Journal (3 sec)

Capture at: 1080p 30fps or 4K 60fps on iPhone 15 Pro Max
Format: .mov or .mp4, max 500MB

---

## Caption Suggestions (for on-device text overlays in screenshots)

| Screenshot | Suggested Caption |
|------------|------------------|
| 1 — Welcome | "Weigh it with wisdom" |
| 2 — Crossroads | "Name your decision. Begin your journey." |
| 3 — The Word | "Your situation, met with Scripture" |
| 4 — Stillness | "Be still, and know that I am God." |
| 5 — Fruit | "Discern by the fruit it produces" |
| 6 — Prayer | "A prayer, written just for you" |

---

## Tools for Screenshot Editing
- **Apple:** [Screenshot Creator](https://apps.apple.com/us/app/screenshot-creator/id1238399722) or Sketch/Figma for device frames
- **Android:** [Device Art Generator](https://developer.android.com/distribute/marketing-tools/device-art-generator)
- **Both:** AppLaunchpad, AppFollow, or MakeAppIcon for adding captions and device frames
