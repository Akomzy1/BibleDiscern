# SKILL.md — LibratoAi Design & Development Playbook

> This is the craftsmanship guide. CLAUDE.md tells you WHAT to build. This file tells you HOW to build it beautifully. Read this before writing any component, screen, or animation. Every decision in here was made deliberately.

---

## Design Philosophy

LibratoAi is a sacred space, not a SaaS product. Every pixel, every transition, every micro-interaction must serve the contemplative experience. The user is bringing their deepest uncertainties to this app. Respect that.

**Three principles that override everything else:**

1. **Breath over speed.** Every screen should feel like it gives the user room to breathe. Generous padding, unhurried transitions, no visual clutter. If a screen feels "busy," remove elements until it doesn't. White space is a feature.

2. **Weight over flash.** This app deals in serious spiritual matters. No bouncy animations, no confetti, no gamification. Animations should feel like gravity — smooth, inevitable, grounded. Think of how a heavy wooden door swings open: deliberate, substantial, quiet.

3. **Warmth over polish.** A perfectly polished glass surface is cold. A well-worn leather Bible is warm. LibratoAi should feel like the latter — textured, human, alive. Cream backgrounds over pure white. Serif fonts over geometric sans. Gold accents that feel like candlelight, not chrome.

---

## Design System Specification

### Color Usage Rules

Never use colors arbitrarily. Every color has a semantic role:

```
Navy (#1B2A4A)
├── Primary text on light backgrounds
├── Headers and titles (Playfair Display)
├── Structural UI elements (tab bar icons active, buttons primary)
├── Cross icon strokes on light backgrounds
└── Full-screen background for Stillness Engine ONLY

Gold (#C8A45E)
├── Accent: scripture references, step indicators, active states
├── Primary CTA buttons (gradient: #C8A45E → #D4BA7A)
├── Section labels (uppercase, letterspaced)
├── Highlight borders (left border on summary cards, top border on prayer cards)
└── Cross icon on dark backgrounds

Gold Light (#E8D5A3)
├── Hover/pressed states on gold elements
├── Subtle background tints (Fruit cards, lesson boxes)
└── Badge backgrounds

Cream (#FDF6EC)
├── Primary app background (ALL screens except Stillness)
├── Card backgrounds (with slight opacity for depth)
└── Tab bar background

Parchment (#F5ECD7)
├── Secondary background (alternating sections on marketing pages)
├── Input field backgrounds
└── Journal card backgrounds

Text Dark (#2C2418)
├── Body text ONLY — never use for headings (use Navy)
└── Input text color

Text Medium (#5C5144)
├── Secondary body text
├── Descriptions, context paragraphs
└── Placeholder text (at 60% opacity)

Text Light (#8A7F72)
├── Tertiary text: dates, timestamps, metadata
├── Disclaimers
└── Helper text below inputs

Sage (#7A8B6F)
├── Stillness-related accents (stillness note card border)
├── "From your stillness" section
└── Growth/nature metaphors in UI

Border (#E8DFD0)
├── Card borders (1px)
├── Divider lines
└── Input borders (unfocused)

Error (#C0392B)
├── Error messages ONLY
├── Destructive actions (sign out confirmation)
└── Never for decoration
```

**Dark mode is NOT in MVP.** The cream/parchment palette is the brand. Dark mode would fundamentally change the contemplative warmth. Defer to Phase 2 after user feedback.

### Typography Scale

Every text element maps to exactly one of these styles. No exceptions.

```
Mobile (React Native):

display-xl     Playfair Display    36px   700    Navy       Screen titles (welcome only)
display-lg     Playfair Display    28px   700    Navy       Section headers
display-md     Playfair Display    24px   600    Navy       Card titles, step names
display-sm     Playfair Display    20px   600    Navy       Sub-headers

scripture-lg   Cormorant Garamond  22px   400i   Navy       Verse text (journey cards)
scripture-md   Cormorant Garamond  18px   400i   Navy       Prayer text
scripture-sm   Cormorant Garamond  16px   400i   TextMed    Closing word, stillness prompt

body-lg        Source Sans 3       17px   400    TextDark   Primary body text
body-md        Source Sans 3       15px   400    TextDark   Secondary body text
body-sm        Source Sans 3       13px   400    TextMed    Metadata, helpers
body-xs        Source Sans 3       11px   400    TextLight  Disclaimers, timestamps

label-md       Source Sans 3       12px   700    Gold       Section labels (uppercase, 2px letterspacing)
label-sm       Source Sans 3       11px   600    TextLight  Badges, tags
```

**Rules:**
- Playfair Display is for DISPLAY only — never body text, never more than 2 lines
- Cormorant Garamond is for SCRIPTURE and PRAYER only — never UI elements
- Source Sans 3 is for EVERYTHING else — body, buttons, labels, inputs, metadata
- Never mix font families within a single text block
- Scripture text always in italic
- Line height: 1.6 for body, 1.7 for scripture, 1.3 for display

### Spacing Scale

Use a consistent 4px base unit. These are the ONLY spacing values allowed:

```
xs:    4px     Icon padding, inline gaps
sm:    8px     Between related elements (label → input)
md:    12px    Between list items, between icon and text
lg:    16px    Card internal padding (horizontal)
xl:    20px    Card internal padding (vertical), between cards
2xl:   24px    Section padding
3xl:   32px    Between sections on a screen
4xl:   40px    Screen top padding (below header)
5xl:   48px    Major section breaks
6xl:   64px    Welcome screen vertical spacing
```

**Never use arbitrary values** like 13px, 18px, or 22px. Snap to the scale.

### Border Radius Scale

```
none:   0px     Never used (everything has some rounding)
sm:     4px     Small pills, badges
md:     8px     Buttons, inputs, small cards
lg:     12px    Standard cards, modals
xl:     16px    Large cards, bottom sheets
full:   9999px  Circles (avatars, step dots, breathing circle)
```

### Shadow (Mobile Only — Use Sparingly)

Shadows should feel like natural elevation, not decorative effects.

```
card:     0 2px 8px rgba(44, 36, 24, 0.06)     Standard card elevation
elevated: 0 4px 16px rgba(44, 36, 24, 0.10)    Modal, bottom sheet, floating CTA
pressed:  0 1px 4px rgba(44, 36, 24, 0.04)     Pressed state (card scale-down)
```

**Rules:**
- Shadow color always derived from TextDark (#2C2418), not black
- Maximum 1 shadow per element (no stacked shadows)
- Never shadow on text
- Stillness Engine screen: NO shadows (full immersion)

---

## Component Architecture

### Component Naming Convention

```
components/
├── ui/                    # Primitive design system atoms
│   ├── Button.tsx         # Variants: primary, secondary, ghost, danger
│   ├── Card.tsx           # Variants: default, elevated, highlighted (gold border)
│   ├── Input.tsx          # TextInput with label, error state, character count
│   ├── Badge.tsx          # Pill badges (tier, status, scripture ref)
│   ├── Divider.tsx        # Horizontal line with optional label
│   ├── Avatar.tsx         # Circle with initial letter (narrative characters)
│   ├── ProgressDots.tsx   # Step indicator dots for journey
│   ├── Spinner.tsx        # Gold loading spinner
│   ├── Toast.tsx          # Success/error notification toast
│   └── ScreenWrapper.tsx  # SafeAreaView + ScrollView + padding + pull-to-refresh
│
├── journey/               # Journey step components (one per step)
│   ├── StepWord.tsx       # Step 1: Scripture cards
│   ├── StepNarratives.tsx # Step 2: Biblical narrative cards
│   ├── StepExamination.tsx# Step 3: Reflection questions
│   ├── StepStillness.tsx  # Step 4: Full-screen breathing engine
│   ├── StepFruit.tsx      # Step 5: Radial chart + diagnostic cards
│   ├── StepPrayer.tsx     # Step 6: Prayer + Ebenezer save
│   └── JourneyNav.tsx     # Back/Continue buttons + step dots
│
├── journal/
│   ├── JournalCard.tsx    # Preview card in list
│   ├── JournalLockedCard.tsx  # Locked card for free tier overflow
│   └── EbenezerAnimation.tsx  # Save confirmation animation
│
└── common/
    ├── UpgradeGate.tsx    # Blurred overlay with upgrade CTA
    ├── OfflineBanner.tsx  # "You're offline" bar
    ├── CrisisScreen.tsx   # Safety resources screen
    ├── LoadingOverlay.tsx  # Full-screen with rotating spiritual messages
    └── Disclaimer.tsx     # Standard safety disclaimer text
```

### Component Design Rules

1. **Every component is self-contained.** It imports only from `@librato/shared`, `../ui/`, or React Native. Never reach across to `../journey/` from `../journal/`.

2. **Props are typed with interfaces, not inline types.** Every component gets a `[Name]Props` interface at the top of the file.

3. **Every component handles its own loading, error, and empty states.** Don't push this up to the parent. If a Card can be loading, it should accept an `isLoading` prop and render its own skeleton.

4. **Pressed states on every tappable element.** Use `Pressable` with opacity 0.8 on press. On cards, use scale 0.98 for a subtle physical feel. Never use `TouchableOpacity` — it's deprecated in favor of Pressable.

5. **Accessibility on everything.** Every tappable element has `accessibilityRole` and `accessibilityLabel`. Images have `accessibilityLabel` describing content. Screen readers should be able to navigate the entire journey.

---

## Animation Specifications

### Global Animation Principles

- **Duration:** 300ms for UI transitions, 600ms for content entrance, 4000ms+ for Stillness only
- **Easing:** `Easing.bezier(0.25, 0.1, 0.25, 1)` (ease-out-cubic) for entrances. `Easing.inOut(Easing.ease)` for Stillness breathing.
- **No bounce.** Never use spring animations with visible oscillation. If using spring, set `damping: 20, stiffness: 100` minimum (overdamped).
- **Stagger delay:** 80ms between sequential cards appearing

### Screen Transitions

```
Tab switch:        crossFade, 200ms
Stack push:        slideFromRight, 300ms, ease-out
Stack pop:         slideToRight, 250ms, ease-in
Modal present:     slideFromBottom, 350ms, ease-out
Modal dismiss:     slideToBottom, 300ms, ease-in
Full-screen enter: fadeIn, 500ms (Stillness Engine)
Full-screen exit:  fadeOut, 400ms
```

### Content Entrance Animations

When a journey step loads, cards animate in:

```javascript
// Each card staggers 80ms after the previous
const enterAnimation = {
  from: { opacity: 0, translateY: 16 },
  to: { opacity: 1, translateY: 0 },
  duration: 500,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};
```

**Rules:**
- Cards enter from bottom (translateY: 16 → 0), never from sides
- Opacity: 0 → 1 accompanies every translateY animation
- Maximum 5 sequential staggers. If 6+ items, show first 5 staggered, rest appear instantly.
- Pull-to-refresh: no entrance animation (instant render after refresh)

### Stillness Engine Animation (CRITICAL — This Must Be Perfect)

The breathing circle is the most important animation in the app. It must be buttery smooth with zero jank.

```javascript
// Using react-native-reanimated
import { useSharedValue, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';

const breathingCycle = () => {
  return withRepeat(
    withSequence(
      // Inhale: scale 1.0 → 1.3 over 4 seconds
      withTiming(1.3, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      // Hold: stay at 1.3 for 2 seconds
      withTiming(1.3, { duration: 2000 }),
      // Exhale: scale 1.3 → 1.0 over 4 seconds
      withTiming(1.0, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      // Pause: stay at 1.0 for 1 second
      withTiming(1.0, { duration: 1000 }),
    ),
    -1, // infinite repeat
    false // don't reverse
  );
};
```

**Breathing circle visual spec:**
```
Outer glow ring:  160px diameter, Gold (#C8A45E) at 15% opacity, scales with circle
Inner circle:     120px diameter, Gold at 25% opacity
Center cross:     32px, Gold light (#E8D5A3), static (does NOT scale)
Background:       Navy (#1B2A4A) — full screen, no other elements
```

**Phase transition (45s mark):**
- Text crossfades (old text fades out 300ms, new text fades in 300ms)
- expo-haptics: `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)` — single gentle pulse
- No visual disruption to the breathing circle

**Timer display:**
- Position: below the breathing circle, 40px gap
- Format: "1:30" → "0:00" (mm:ss, no leading zero on minutes)
- Font: Source Sans 3, 14px, TextLight at 60% opacity
- Progress bar: 200px wide, 3px height, Gold fill on Border background, rounded ends

### Haptic Patterns

```
Tab switch:           impactAsync(ImpactFeedbackStyle.Light)
Button press:         impactAsync(ImpactFeedbackStyle.Medium)
Tone pill select:     selectionAsync()
Step transition:      impactAsync(ImpactFeedbackStyle.Light)
Stillness phase:      notificationAsync(NotificationFeedbackType.Success)
Ebenezer save:        notificationAsync(NotificationFeedbackType.Success)
Error:                notificationAsync(NotificationFeedbackType.Error)
Pull-to-refresh:      impactAsync(ImpactFeedbackStyle.Light) on release
```

---

## Screen-by-Screen UX Specifications

### Login / Signup

**Layout:**
- Top 30%: LibratoAi cross icon (48px, navy) + "LibratoAi" (Playfair 28px) + tagline (Cormorant 14px italic, gold)
- Middle: email input + password input + primary CTA
- Bottom: alternative auth (Apple Sign In, Google Sign In) + switch link ("Already have an account?" / "Create one")

**Interaction details:**
- Inputs have floating labels that animate up on focus (translateY: 0 → -24, scale: 1 → 0.85, color: TextLight → Gold)
- Password field has show/hide toggle (eye icon)
- CTA button disabled until both fields valid (email format + password 8+ chars)
- Error messages appear below the relevant input with a 4px red left border, fade in 200ms
- On submit: button shows spinner (replace text with Spinner component), disable all inputs
- Apple Sign In uses native button style (required by Apple guidelines)

### Onboarding (Covenant Moment)

This is NOT a feature tour. It is a spiritual threshold.

**Single screen, scrollable:**
- Cross icon at top, large (64px), centered, fade in 1000ms
- "Welcome to LibratoAi" — Playfair 28px, fade in at 400ms delay
- Covenant text — Cormorant Garamond 18px italic, Navy, fade in at 800ms delay:
  *"This is not a place for quick answers. It's a space where you bring your real questions before God, guided by His Word and the wisdom of His people across centuries."*
- Second paragraph — Source Sans 15px, TextMedium, fade in at 1200ms delay:
  *"We don't replace the Holy Spirit, your pastor, or your community. We simply help you listen more carefully."*
- Name input (pre-filled from signup) — appears at 1600ms delay
- "Begin My Journey" gold button — appears at 2000ms delay
- James 1:5 verse at bottom — small, light, italic

**There is no skip button.** Every user reads this. It sets the tone for everything.

### Home Screen

**Above the fold (no scroll needed for primary action):**
- Greeting bar: "Good morning, [name]" (left), session counter badge (right, if free tier)
- Daily Moment card: Full-width, 16px horizontal padding, cream card with subtle border
  - Scripture reference (gold, label-md, uppercase)
  - Verse text (scripture-lg, italic)
  - Thin gold divider (1px, 40px wide, centered)
  - Reflection prompt (body-md)
  - Prayer (scripture-sm, italic)
- "Begin Discernment" button: Full-width gold CTA, 48px height, 12px below the card

**Below the fold (scroll to reveal):**
- "Recent journeys" section label
- Last 3 sessions as horizontal scroll cards (or vertical list if < 3)
- Each: situation preview (2 lines max) + date + first scripture ref badge
- Empty state: "Your discernment journey begins with a single question." + soft CTA

### The Crossroads (Discern Screen)

**Layout:**
- Screen title: "The Crossroads" (Playfair 24px)
- Subtitle: "What decision or situation are you bringing before God today?" (Cormorant 16px italic)
- TextInput:
  - Min height: 160px (4 visible lines)
  - Cream background, 1px border (#E8DFD0), 12px radius
  - On focus: border transitions to Gold (200ms)
  - Placeholder: "Share what's on your heart..." (TextLight, 60% opacity)
  - Character count bottom-right (body-xs, TextLight) — appears after 10 chars typed
- Tone selector:
  - 4 pills in a horizontal row, centered, 8px gap
  - Unselected: transparent bg, 1px border, TextMedium text
  - Selected: Gold bg at 15% opacity, 1.5px Gold border, Navy text, bold
  - Selection change: background crossfade 200ms + selectionAsync() haptic
- CTA: "Begin My Discernment Journey" gold button
  - Disabled state: 50% opacity, no haptic on press
  - Enabled: full opacity, medium haptic on press

### 7-Step Journey

**Pager behavior:**
- Horizontal swipe between steps (react-native-pager-view recommended)
- Step dots at top: 6 dots, 8px each, 8px gap, centered
  - Current: Gold filled circle
  - Completed: Sage filled circle with checkmark (✓ in white, 6px)
  - Upcoming: Border circle only
- Swipe is enabled but buttons are the primary navigation
- "Continue →" button always right-aligned at bottom
- "← Back" button left-aligned (hidden on Step 1)
- On Step 4 (Stillness): swipe is DISABLED (full-screen takeover)
- On Step 6 (Prayer): "Continue →" is replaced with "Set My Ebenezer Stone 🪨"

**Step content layout pattern:**
```
┌─────────────────────────────┐
│        Step dots (top)       │
│                              │
│  Step Title (Playfair 24px)  │
│  ─── gold line (40px) ───   │
│                              │
│  [Intro text if applicable]  │
│                              │
│  ┌───────────────────────┐  │
│  │     Content Card 1     │  │
│  └───────────────────────┘  │
│                              │
│  ┌───────────────────────┐  │
│  │     Content Card 2     │  │
│  └───────────────────────┘  │
│                              │
│  ┌───────────────────────┐  │
│  │     Content Card 3     │  │
│  └───────────────────────┘  │
│                              │
│  [← Back]      [Continue →]  │
└─────────────────────────────┘
```

### Stillness Engine (Step 4 — Full-Screen Takeover)

**This screen is different from every other screen.** It is full-immersion.

- Hide: tab bar, status bar, header, step dots, navigation buttons
- Background: solid Navy (#1B2A4A)
- No cards, no borders, no UI chrome
- Only elements: breathing circle (center), phase text (below), timer (below text), progress bar (bottom), skip link (below progress)
- All text: Gold Light (#E8D5A3) or Gold (#C8A45E)
- When timer ends: haptic pulse + 500ms pause + crossfade to response view
- Response view: same Navy background, "What surfaced in the stillness?" in Cormorant 20px italic Gold Light, TextInput (transparent bg, cream text, 1px Gold border), "Continue the Journey" button (gold outline variant, not filled — softer in the dark context)

### Upgrade Screen

**Goal: convert without being pushy.** The user is in a spiritual context. Hard sells feel wrong here.

**Layout:**
- Header: "Go deeper" (Playfair 28px) — NOT "Upgrade now!" or "Don't miss out!"
- Annual card (HIGHLIGHTED):
  - Gold top border (3px)
  - "Best value" badge (gold pill, top right)
  - "$39.99/year" (Playfair 24px)
  - "$3.33/month" (body-lg, TextMedium) with strikethrough "$4.99" next to it
  - "Save 33%" (label-md, Sage)
- Monthly card:
  - Standard border
  - "$4.99/month" (Playfair 20px)
  - "Cancel anytime" (body-sm, TextLight)
- Feature list: checkmarks in Gold, text in body-md
- "Start 7-Day Free Trial" gold CTA — large, prominent
- "Restore Purchases" text link (body-sm, TextLight, underlined)
- Footer: "No commitment. Cancel anytime." (body-xs, TextLight, italic)

---

## Performance Standards

### Mobile App Targets
```
Cold start:        < 2 seconds to interactive
Screen transition: < 300ms
API response:      < 3 seconds for discernment (Claude latency)
                   < 500ms for all other endpoints
Frame rate:        60fps minimum during Stillness Engine breathing
Bundle size:       < 20MB initial download (excluding assets)
Memory:            < 150MB peak during journey (monitor with Expo dev tools)
```

### Optimization Rules
- Use `React.memo()` on all journey step components (they receive large props and shouldn't re-render)
- Use `useMemo()` for computed values from AI response (parsed scriptures, formatted dates)
- Use `useCallback()` for all event handlers passed as props
- FlatList: always specify `keyExtractor`, `getItemLayout` (if fixed height), and `maxToRenderPerBatch`
- Images: use expo-image (not Image from RN) for better caching and loading
- Fonts: load all 3 font families in _layout.tsx using `useFonts()` — show splash until loaded
- Zustand: split stores by domain (auth, subscription, sessions) — never one mega-store
- API responses: cache in AsyncStorage with TTL (daily moment: 24h, sessions: 5min, profile: 30min)

---

## Error Handling Patterns

### API Error Response Shape
```typescript
interface ApiError {
  error: string;       // Machine-readable: 'limit_reached', 'unauthorized', 'validation_error', 'server_error'
  message: string;     // Human-readable message to display
  details?: unknown;   // Optional Zod validation details
}
```

### Mobile Error Display
- **Network error:** OfflineBanner at top + disabled CTA buttons + "You're offline" in body
- **Auth error (401):** Silent redirect to login screen (token expired)
- **Rate limit (429):** Toast: "Please wait a moment before trying again."
- **Session limit (403):** Modal with upgrade CTA (not a toast — this is a conversion moment)
- **Claude API error (500):** Card with: "Something went wrong preparing your discernment journey. Please try again." + Retry button
- **Validation error (400):** Inline error below the relevant input field
- **Generic error:** Toast: "Something unexpected happened. Please try again."

### Retry Logic
- Discernment API: 1 automatic retry after 3 seconds on 500/503
- All other APIs: no automatic retry, show error with manual retry button
- Never retry on 400, 401, 403

---

## Accessibility Standards

### Minimum Requirements (Must Ship)
- Every tappable element: `accessibilityRole="button"` + `accessibilityLabel="[action description]"`
- Every image/icon: `accessibilityLabel="[description]"`
- Every input: `accessibilityLabel="[field name]"` + `accessibilityHint="[what to enter]"`
- Screen reader announces current journey step: "Step 3 of 6: The Examination"
- Minimum touch target: 44x44px (Apple HIG requirement)
- Color contrast: all text meets WCAG AA (4.5:1 for body, 3:1 for large text) — verified: Navy on Cream = 10.2:1 ✓, TextMedium on Cream = 5.8:1 ✓, TextLight on Cream = 3.7:1 ✓ (large text only), Gold on Navy = 4.1:1 ✓

### Stillness Engine Accessibility
- Screen reader: announce "Stillness meditation. 90 second guided silence. Breathe deeply."
- Respect reduced motion: if `AccessibilityInfo.isReduceMotionEnabled`, replace breathing animation with static circle + text cues only ("Inhale... Hold... Exhale...")
- Timer announces time remaining every 30 seconds to screen reader

---

## Testing Expectations

### What Must Work Before Moving to Next Stage

**Stage 3 (Mobile Core):**
- Complete auth flow: signup → login → onboarding → home
- Daily moment loads and displays correctly
- Can create a discernment session (Claude responds with valid JSON)
- All 7 steps render with correct data from API
- Stillness Engine breathing animation runs at 60fps
- Ebenezer Stone saves to journal
- Tab navigation between all 4 tabs
- Pull-to-refresh on Home and Journal

**Stage 4 (Journal + Payments):**
- Journal lists entries in correct order
- Free tier sees only 3 entries
- Upgrade screen displays correctly
- RevenueCat purchase flow opens native payment sheet (sandbox mode)
- Feature gating blocks Fruit diagnostic for free users
- Settings allows profile edit + sign out

**Stage 5 (Polish):**
- Push notification permission prompt on first launch
- Crisis keywords trigger safety screen (test with "I want to end my life")
- Offline banner appears when airplane mode enabled
- Haptics fire on all specified interactions
- All animations smooth on physical device (not just simulator)

### Manual Test Script for Final QA

Run through this exact flow on a physical device before app store submission:

1. Fresh install → signup with email → onboarding covenant screen → "Begin My Journey"
2. Home: verify daily moment shows, greeting is correct for time of day
3. Discern tab: type "I'm considering leaving my job but I'm scared" → select Reflective → "Begin"
4. Verify loading overlay with rotating messages
5. Step 1 (Word): verify 3 scriptures render with verse text + context
6. Step 2 (Narratives): verify 2 character cards with connection + lesson
7. Step 3 (Examination): verify 5 questions, numbered correctly
8. Step 4 (Stillness): verify breathing animation, timer counts down, phase text changes at 45s, skip works, text input saves
9. Step 5 (Fruit): verify blurred/locked state with upgrade CTA (free tier)
10. Step 6 (Prayer): verify personalized prayer text, Ebenezer Stone saves
11. Journal tab: verify entry appears with correct data
12. Try creating second session → verify 403 / upgrade prompt (free tier)
13. Upgrade screen: verify both pricing cards, trial CTA
14. Settings: verify profile, sign out works
15. Test crisis: type "I want to kill myself" → verify safety screen with tappable 988 link
16. Test offline: airplane mode → verify banner, journal loads from cache, discern shows offline message

---

## File Naming Conventions

```
Components:     PascalCase.tsx          StepStillness.tsx, JournalCard.tsx
Hooks:          camelCase.ts            useAuth.ts, useFeatureGate.ts
Stores:         camelCase.ts            useAuthStore.ts, useSessionStore.ts
Utilities:      camelCase.ts            cache.ts, notifications.ts, purchases.ts
Types:          PascalCase in types.ts  Profile, Session, DiscernmentResponse
Constants:      SCREAMING_SNAKE         COLORS, TIER_CONFIG, CRISIS_KEYWORDS
API routes:     kebab-case/route.ts     daily-moment/route.ts
Blog slugs:     kebab-case              7-steps-biblical-discernment-complete-guide
Test files:     [name].test.ts          StepStillness.test.tsx
```

---

## Common Mistakes to Avoid

1. **Don't use `#000000` or `#FFFFFF` anywhere.** Use brand colors. Black text on white background is cold. Navy on cream is warm.

2. **Don't use default React Native button styles.** Every button must use the custom Button component with brand styling.

3. **Don't use `alert()` for any user-facing message.** Use the Toast component or a styled modal.

4. **Don't put the safety disclaimer in a dismissible popup.** It must be static text on the screen, always visible.

5. **Don't animate the cross icon during Stillness.** The cross is the stable, unmoving anchor. The circle breathes around it. The cross stays still — it represents God's unchanging presence.

6. **Don't make the Stillness Engine skippable with a prominent button.** The skip link should be small, low-contrast, at the bottom. We want users to sit in the silence. The skip is an escape hatch, not a feature.

7. **Don't show a "success" screen after payment.** After a successful IAP, simply update the UI to reflect premium status and show a quiet toast: "Welcome to Premium." The user is in a spiritual context, not a shopping cart.

8. **Don't use loading skeletons on the journey steps.** The loading overlay with spiritual messages ("Searching the Scriptures...") IS the loading state. Skeletons would break the contemplative flow.

9. **Don't make the journal editable.** Journal entries are records, not drafts. The only addition allowed is the follow-up response ("How did it turn out?"). The original discernment journey is immutable — it's a testimony.

10. **Don't paginate the journal with "Load More."** Use infinite scroll (FlatList with onEndReached). The journal is a timeline — pagination breaks the narrative flow.

---

## Deployment Checklist Reference

Before each stage completion:

```
[ ] TypeScript: zero errors (tsc --noEmit)
[ ] No console.log statements left in production code
[ ] All API keys in .env, none hardcoded
[ ] RLS tested: user A cannot read user B's data
[ ] All tappable elements have accessibilityLabel
[ ] Tested on iOS simulator + Android emulator
[ ] Tested on physical device for animations/haptics
[ ] Checked: does the screen feel contemplative? Would a user feel safe here?
```

That last item is not a joke. It is the most important check.
