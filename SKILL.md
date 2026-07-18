# SKILL.md — BibleDiscern v2 Design System & Build Playbook

> The "Selah" design system, rendered as buildable guidance. Read this before writing any UI. Pair with CLAUDE.md (architecture, features, rules). Where this file and the PRD ever disagree on copy, the PRD wins.

*Selah — the Psalmist's pause: stop, and weigh what was just said.*

---

## 1. Design Thesis (internalize before coding)

Modern sanctuary, illuminated-manuscript discipline: **deep-nave navy is the world; vellum panels are lit pages within it; gold is light — spent in exactly one place per screen.** This is a **sanctuary, not a dashboard.**

The guardrail against the generic AI look: an all-cream background under a serif headline is the templated default everyone ships. Selah inverts it — **navy is the environment, vellum panels sit inside the navy** like lit pages in a dark church. **Cream/vellum never appears as a naked full-bleed background** (one deliberate exception: the Crisis Resources screen).

Five laws, enforced in code review:
1. **One gold moment per screen.** The Beam, or the primary CTA, or the drop cap — never two competing golds.
2. **Navy is the ground; vellum floats on it.** Never full-bleed cream.
3. **Every Scripture opens with the gilt drop cap.**
4. **Every Daily Scale question is Cormorant Garamond italic.**
5. **Motion is reverent — weighted, slow-out, never bouncy.**

### This file is the SYSTEM. The Claude Design prototype is the APPLICATION.

**Binding rule for the build:** this document defines the design *system* — tokens, primitives, laws. The approved **Claude Design prototype defines how that system is applied to each specific screen** (exact layout, section order, spacing, which states exist, how each looks). **Build every screen to match its prototype frame exactly** — use these tokens and primitives for the *values and behavior*, and take the *arrangement* from the prototype. Do not add sections the prototype omits; do not omit states the prototype shows; do not redesign during the build. If the prototype and this file ever seem to conflict, stop and flag it — never resolve it by improvising. (Full authority order in CLAUDE.md → "Prototype Fidelity".)

---

## 2. Tokens as Data (`packages/shared/src/tokens.ts`)

Tokens are the single source of truth. Tailwind config consumes them on web; a React Native theme provider consumes the same file at native time. **Never hardcode a hex, a duration, or a type size in a component.**

```ts
// packages/shared/src/tokens.ts
export const color = {
  nave950: '#0D1520', // deepest ground — Stillness, immersive
  nave900: '#14213A', // app chrome background
  nave800: '#1B2A4A', // brand navy, primary surfaces
  nave700: '#2D4166', // raised surfaces, hover
  vellum100: '#FDF6EC', // page panels (never full-bleed)
  vellum200: '#F5ECD7', // inset panels, quotes
  gilt500: '#C8A45E', // gold — the ONE emphasis per screen
  gilt300: '#E8D5A3', // gold text/glow on navy
  ink900: '#2C2418', // text on vellum
  ink500: '#5C5144', // secondary text on vellum
  olive500: '#7A8B6F', // success, affirmation
  ember600: '#C0392B', // errors, crisis accents (rare)
} as const;

export const font = {
  display: '"Playfair Display", Georgia, serif',   // display ONLY
  scripture: '"Cormorant Garamond", Georgia, serif', // scripture/prayer/questions, italic
  body: '"Source Sans 3", system-ui, sans-serif',    // all UI + body
} as const;

export const radius = { panel: 14, pill: 999 } as const;

export const motion = {
  easeSelah: 'cubic-bezier(0.22, 0.8, 0.24, 1)',
  durWhisper: 250,  // hovers, focus, small reveals
  durSettle: 450,   // beam settle, card commit
  durBreath: 700,   // page/panel transitions (fade + 8px rise)
} as const;

export const giltBorderOnNavy = 'rgba(200,164,94,0.12)'; // 1px panel edge on navy
export const glowOnNavy = 'rgba(200,164,94,0.06)';       // shadow tint + candle glow (<=6%)
```

Tailwind wiring (illustration):

```ts
// web/tailwind.config.ts
import { color, font, radius } from '@librato/shared/tokens';
export default {
  theme: { extend: {
    colors: {
      nave: { 950: color.nave950, 900: color.nave900, 800: color.nave800, 700: color.nave700 },
      vellum: { 100: color.vellum100, 200: color.vellum200 },
      gilt: { 500: color.gilt500, 300: color.gilt300 },
      ink: { 900: color.ink900, 500: color.ink500 },
      olive: { 500: color.olive500 }, ember: { 600: color.ember600 },
    },
    fontFamily: { display: [font.display], scripture: [font.scripture], body: [font.body] },
    borderRadius: { panel: `${radius.panel}px` },
  }},
};
```

Also expose motion tokens as CSS custom properties in `globals.css` so keyframes and transitions read them:

```css
:root{
  --ease-selah: cubic-bezier(0.22,0.8,0.24,1);
  --dur-whisper: 250ms; --dur-settle: 450ms; --dur-breath: 700ms;
}
```

---

## 3. Color Usage Rules

- **Backgrounds:** app chrome `nave900`; immersive screens (Stillness, paywall, landing hero) `nave950`; primary surfaces `nave800`. Vellum only inside panels.
- **The gold rule:** treat `gilt500` as *material*, not decoration. One element per screen carries it. If two things want gold, one loses.
- **Text on navy:** headings `gilt300` or white; body `#E8E2D6`-ish off-white (derive from vellum, not pure white); eyebrows `gilt500`.
- **Text on vellum:** `ink900` primary, `ink500` secondary.
- **Success** `olive500` (majority/minority affirmation, "answered prayer" chip). **Errors/crisis** `ember600`, used sparingly.
- **Shadows on navy are gold-tinted glow, never gray.** Shadows on vellum: soft warm, low.

---

## 4. Typography

Load via `next/font` (self-hosted, subset, `display:swap`):

```ts
import { Playfair_Display } from 'next/font/google';
import { Cormorant_Garamond } from 'next/font/google';
import { Source_Sans_3 } from 'next/font/google';
export const playfair = Playfair_Display({ subsets:['latin'], weight:['400','600','700'], variable:'--f-display', display:'swap' });
export const cormorant = Cormorant_Garamond({ subsets:['latin'], weight:['400','600'], style:['italic','normal'], variable:'--f-scripture', display:'swap' });
export const source = Source_Sans_3({ subsets:['latin'], weight:['400','600'], variable:'--f-body', display:'swap' });
```

Roles (strict):
- **Playfair Display** — display only. H1 `clamp(2.2rem, 6vw, 3.4rem)`, leading 1.15. Used sparingly — a headline, a price, a step name. Never body.
- **Cormorant Garamond italic** — Scripture, prayers, and **every Daily Scale question**. Generous: questions 1.35rem+ mobile, leading 1.5.
- **Source Sans 3** — all UI and body. 1rem/1.6. Buttons 600.
- **Eyebrow labels** — Source Sans 600, 11–12px, uppercase, letter-spacing 0.18em; `gilt500` on navy, `ink500` on vellum.

### The type signature — the Illuminated Capital

Every Scripture passage opens with a **two-line Playfair drop cap in `gilt500`** with a hairline rule descending beside it. This is the single most recognizable typographic move in the app; it ports trivially to native later and costs nothing at runtime.

```tsx
// components/selah/DropCap.tsx — CSS ::first-letter approach for body-of-scripture
export function ScriptureBlock({ children }: { children: string }) {
  return (
    <p className="font-scripture italic text-ink-900 leading-relaxed
                  [&::first-letter]:font-display [&::first-letter]:not-italic
                  [&::first-letter]:text-gilt-500 [&::first-letter]:text-[3.2em]
                  [&::first-letter]:leading-[0.8] [&::first-letter]:float-left
                  [&::first-letter]:mr-2 [&::first-letter]:mt-1">
      {children}
    </p>
  );
}
```

(For the hairline rule beside the cap, wrap in a grid variant when the design calls for it; the `::first-letter` version is the default.)

---

## 5. The Signature Element — The Beam

One element carries the identity everywhere: a **hairline gold balance beam with a center fulcrum.** It is an SVG whose rotation is driven by CSS transforms (cheap, 60fps, portable). Build it once, reuse it in four contexts.

States: **at rest** (level, faint sway on landing only), **tilt-left**, **tilt-right**, **settled-level with a stone glyph** (Ebenezer).

```tsx
// components/selah/Beam.tsx
'use client';
type BeamProps = { tilt?: 'rest'|'left'|'right'; sway?: boolean; stone?: boolean };
const DEG = { rest: 0, left: -6, right: 6 };
export function Beam({ tilt='rest', sway=false, stone=false }: BeamProps) {
  return (
    <div className="relative w-full flex justify-center" aria-hidden>
      <svg viewBox="0 0 240 60" className="w-52 overflow-visible">
        {/* fulcrum */}
        <path d="M120 40 L112 56 L128 56 Z" fill="var(--gilt)" opacity="0.9"/>
        {/* beam — rotates about the fulcrum */}
        <g style={{
          transformOrigin: '120px 40px',
          transform: `rotate(${DEG[tilt]}deg)`,
          transition: `transform var(--dur-settle) var(--ease-selah)`,
          animation: sway ? 'beam-sway 7s var(--ease-selah) infinite' : undefined,
        }}>
          <line x1="34" y1="40" x2="206" y2="40" stroke="var(--gilt)" strokeWidth="1.5" strokeLinecap="round"/>
          {/* pans */}
          <circle cx="34" cy="40" r="3" fill="var(--gilt)"/>
          <circle cx="206" cy="40" r="3" fill="var(--gilt)"/>
        </g>
        {stone && <circle cx="120" cy="30" r="5" fill="var(--gilt-300)"
          style={{ animation:'stone-settle var(--dur-settle) var(--ease-selah)' }}/>}
      </svg>
    </div>
  );
}
```

```css
@keyframes beam-sway { 0%,100%{transform:rotate(-1.5deg)} 50%{transform:rotate(1.5deg)} }
@keyframes stone-settle { 0%{transform:translateY(-14px);opacity:0} 100%{transform:translateY(0);opacity:1} }
```

Usage map:
- **Landing hero:** `<Beam sway />`, two pan-labels ("wisdom" / "your decision") positioned under the pans. The page's single glow lives here.
- **Daily Scale WEIGH:** `tilt` follows the hovered/selected side; on confirm it settles. The beam tilt is the screen's one gold moment — the confirm button also uses gilt fill, but nothing else does.
- **Journey progress:** render 7 tick marks along the beam line; slide the fulcrum under the active step (a separate progress variant of the component).
- **Ebenezer save:** `<Beam tilt="rest" stone />` — beam levels, stone settles.

Expose `prefers-reduced-motion`: disable `sway` and the settle transition (jump to final state) under reduced motion.

---

## 6. Surface & Texture

- **Panels:** radius 14 (`rounded-panel`). On navy, add a 1px border `border-[rgba(200,164,94,0.12)]` — gilt edges catching light. Shadow on navy = `shadow-[0_20px_60px_rgba(200,164,94,0.06)]`, never gray.
- **Vellum grain:** one inline SVG `feTurbulence` at ~2.5% opacity, tiled as a background layer on vellum panels. No raster image, no payload.

```tsx
export const VellumGrain = () => (
  <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.025] mix-blend-multiply" aria-hidden>
    <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/></filter>
    <rect width="100%" height="100%" filter="url(#g)"/>
  </svg>
);
```

- **Candle glow:** immersive navy screens get ONE soft radial gold gradient (≤6% opacity) behind the focal element. Never more than one glow per screen.

```tsx
export const CandleGlow = () => (
  <div aria-hidden className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2
    h-[520px] w-[520px] rounded-full"
    style={{ background:'radial-gradient(circle, rgba(200,164,94,0.06) 0%, transparent 70%)' }}/>
);
```

---

## 7. Motion — the Liturgical System

Reverent, weighted, slow-out, never bouncy/springy. **All motion respects `prefers-reduced-motion` (fades only).**

| Token | Value | Use |
|---|---|---|
| `--ease-selah` | cubic-bezier(0.22,0.8,0.24,1) | everything |
| `--dur-breath` | 700ms | page/panel transitions: fade + 8px rise (a page turning) |
| `--dur-settle` | 450ms | beam settle, card commit |
| `--dur-whisper` | 250ms | hovers, focus, small reveals |

**CSS first.** Reach for Framer Motion only for the **four orchestrated moments** — everything else is CSS transitions/keyframes:

1. **Daily Scale SEE reveal** — bars fill 0→final + counters count up, 1.5s ease-out.
2. **Stillness breathing loop** — scale 1.0→1.3 (4s) / hold (2s) / →1.0 (4s), endless.
3. **Onboarding screens 1 & 6 staged entrances** — element cascade (see §9).
4. **Ebenezer settle** — beam levels, stone drops.

Interaction → feedback mapping (there are no web haptics; these replace v1's haptics):
- selection tap → Beam tilt + 120ms gilt border pulse on the card
- confirm → Beam settle + panel exhale (scale 1.00→0.985→1.00)
- success → count-up completes + drop-cap glow blooms once + optional chime
- **Sound:** three sub-second cues only (vote settle, stillness begin/end chime, Ebenezer stone). Off by default; toggle in Settings; silent under reduced-motion.

---

## 8. Component Patterns (`components/selah/`)

**GiltButton** — primary (gilt fill, nave text), secondary (1px gilt outline, gilt text), text-link (underlined gilt). States: default / hover (250ms) / pressed (scale .985) / disabled (40%). Min height 44px.

**Panel** — vellum surface with grain + radius 14; navy variant adds the 12%-gilt border and glow shadow. Props: `tone: 'vellum'|'navy'`.

**Eyebrow** — the uppercase gilt label.

**SideBadge** — Daily Scale A/B badge. A = `nave800` circle with vellum letter; B = `gilt500` circle with nave letter. (This is the one intentional two-color-but-not-two-gold case: B's gold is a token, not a second "gold moment" — keep everything else on that screen quiet.)

**TabBar** — bottom nav, four items: Today / Discern / Journal / Settings. Active = gilt icon + label; inactive = gilt300 @45%. Handles standalone safe-area insets (`env(safe-area-inset-bottom)`). Hidden inside the Journey flow and Onboarding.

**Form fields** — vellum field, 14 radius, gilt focus ring (`ring-2 ring-gilt-500`), ember border + helper text on error.

---

## 9. Screen Build Specs (the ones with real choreography)

### 9.1 Daily Scale — `components/scale/DailyScale.tsx`, driven by `useDailyScale`

**WEIGH.** Eyebrow → `<Beam tilt={selected}/>` → question `Panel` (Cormorant italic 20px, centered) → two `SideBadge` cards in a 2-col grid → footer italic "Weigh carefully. You can only choose once." Selecting a side: tilt the beam, lift the chosen card (gilt border), dim the other to 60%, reveal a full-width gilt "Confirm my choice". One gold moment = the beam+CTA pairing.

**SEE.** Compressed question → two horizontal result bars (`ResultBars`: A fill `nave800`, B fill `gilt500`) with large numerals → "N believers weighed in" → affirmation in `olive500` → gilt text-button "See the Scripture Lens". **Orchestrated moment:** animate bar widths 0→final and counters 0→final over 1.5s ease-out (Framer Motion `useSpring`/`animate` with reduced-motion guard that jumps to final).

**LEARN.** Eyebrow "THE SCRIPTURE LENS" → reference (Playfair gilt) → `ScriptureBlock` (drop cap) → teaching paragraph (never a winner) → prayer `Panel` with 3px gilt top border (Cormorant italic) → "Share this scale" secondary (calls `/api/og` share card) → locked "Past scales" strip (7 blurred mini-cards + Premium chip) → quiet "Begin a Deep Discernment" entry.

**Completed collapsed:** single vellum card (question + choice chip + reference), tap to expand.

### 9.2 The Stillness — `components/journey/Stillness.tsx`, `useStillness` owns the 90s timer + wake lock

Full-bleed `nave950`. Nothing but: the breathing disc (gilt radial gradient, ~55% width, small `gilt300` cross centered, one faint outer ring) + verse "Be still, and know that I am God." (Cormorant italic `gilt300`) + "— Psalm 46:10" (40%) + a thin 90s progress arc + tiny elapsed time. This screen is the **quality bar for the whole app** — it must be genuinely calm and 60fps.

```css
@keyframes breathe { 0%,100%{transform:scale(1)} 42%{transform:scale(1.28)} 63%{transform:scale(1.28)} }
/* apply: animation: breathe 10s var(--ease-selah) infinite; (4s in / 2s hold / 4s out ≈ 10s) */
```

`useStillness` calls the Wake Lock hook on mount, releases on unmount/exit. After 90s → the "What surfaced?" capture (single field + gilt "Continue"). The one ≤6% glow allowance lives on this screen.

### 9.3 Onboarding — `components/onboarding/*`, shared shell

Full-bleed `nave800`, 6 progress dots (active gilt), no tab bar. Screens 1 & 6 are orchestrated:

- **Screen 1 (Hook):** cross 0ms → headline 500ms → subline 1000ms → CTA 1500ms (fade + 8px rise each). No skip.
- **Screen 6 (Paywall):** cross → headline → three value rows → **annual card scale 0.95→1.0** → monthly card → CTA → **skip link at 2000ms (delayed but always present, never hidden)**. Annual card: 2px gilt border, "BEST VALUE" gilt pill, "$49.99/year" Playfair, "$4.17/month" with struck "$7.99", "Save 48%" olive. CTA "Start my 7-day free trial" → Stripe Checkout. Microcopy "Free for 7 days. Cancel anytime." Skip = "Continue with free plan".

Screen 4 iOS branch: if iOS Safari and not installed, swap the push-permission request for the "Add BibleDiscern to your Home Screen" instruction sheet with a Continue path.

### 9.4 Journey steps — `components/journey/*`

Shared shell: no tab bar; top = Beam-as-progress (7 marks, fulcrum under active step); step eyebrow; back + "Save & exit". Per step: Word (3 scripture cards w/ drop caps), Walked Before (2 narrative cards w/ gilt-left lesson box), Examination (5 numbered fields), Fruit (radial chart — Premium; locked variant → Upgrade), Prayer (gilt-top prayer card + olive stillness-note echo + "Set my Ebenezer Stone" → Ebenezer motion + disclaimer).

### 9.5 Journal — `components/journal/*`

Timeline with a hairline gilt spine + stone glyph per entry. Entry cards: date eyebrow, outline type chip (Discernment/Reflection/Answered prayer/God showed up — outline so gold stays singular), title, reference badge, one-line preview. Free tier: 3 crisp + blurred rest under upgrade card. Empty: lone stone glyph + "Your first stone hasn't been set yet. It will be."

---

## 10. PWA Implementation Notes

- **Manifest** `public/manifest.webmanifest`: name/short_name, `theme_color #1B2A4A`, `background_color #FDF6EC`, maskable 192/512 icons, `display: standalone`, `start_url: '/today'`.
- **Service worker:** precache app shell + fonts + icons. Runtime: today's scale = stale-while-revalidate; journal list = network-first. **Never cache `/api/discern` or auth.** Ship an offline fallback route rendering the cached scale + the designed offline copy.
- **Install:** capture `beforeinstallprompt`, store it, surface a custom gilt "Install BibleDiscern" affordance only at high-intent moments (after first scale, after first journey, in Settings). iOS: detect standalone; if not installed, show the instruction sheet. Hook: `useInstallPrompt`.
- **Web Push (VAPID):** `useSubscription`-adjacent `usePush`; store subscription via `/api/push/subscribe`; schedule the daily reminder at `profiles.daily_scale_time`. iOS requires installed PWA (16.4+); for opted-in non-installed users, fall back to a Resend email reminder.
- **Wake Lock:** `useWakeLock` requests on Stillness mount, re-requests on `visibilitychange` to visible, releases on exit. Feature-detect; degrade silently.

---

## 11. Layout & Responsive

- Single centered column, content max 640px. On 390px mobile: edge-to-edge, 20px side padding, must feel like an installed native app even in a browser tab. On ≥1024px: swap bottom tab bar for a left rail; the navy nave breathes wide on both sides — resist multi-column feature grids on marketing pages (read like a nave, not a brochure).
- Respect standalone safe-area insets top and bottom.

---

## 12. Accessibility Floor (unannounced, always on)

WCAG AA contrast on every text/surface pair in §2 (verify gilt-on-navy for small text — use `gilt300` when contrast is tight). Visible gilt focus ring on every interactive element. Touch targets ≥44px. Full keyboard path through onboarding, journey, and voting. `prefers-reduced-motion` fully honored (all four orchestrated moments degrade to instant/fade). Respect `prefers-color-scheme` later when Vespers (dark mode) ships — not this phase.

---

## 13. Voice in the Interface

Calm, specific, sentence case. Canonical lines (override any drift):
- Tagline "Weigh it with wisdom" · Hook "Have you ever laid awake at night, unsure if you're making the right decision?" · Stillness "Be still, and know that I am God." — Psalm 46:10 · Trial "Free for 7 days. Cancel anytime." · Disclaimer "This tool supports reflection — it does not replace God, Scripture, or wise counsel." · Save "Set my Ebenezer Stone" · Empty journal "Your first stone hasn't been set yet. It will be."

Never use "unlock", "seamless", "elevate". Errors are direct, never vaguely apologetic: "We couldn't reach the server. Your words are saved — try again in a moment." No exclamation marks outside genuine celebration moments.

---

## 14. Definition of Done (per screen)

- [ ] **Matches its Claude Design prototype frame exactly** — layout, section order, spacing, and EVERY state (selected/locked/blurred/empty/sent/error/offline). No invented sections; no omitted states.
- [ ] Consumes tokens only — zero hardcoded hex/duration/size
- [ ] Exactly one gold moment (Beam / primary CTA / drop cap)
- [ ] Navy ground, vellum panels never full-bleed (except Crisis screen)
- [ ] Scripture uses the drop cap; Daily Scale questions are Cormorant italic
- [ ] Loading / error / empty / offline states all present
- [ ] Behavior in a hook, rendering in the component (native-portable)
- [ ] AA contrast, ≥44px targets, gilt focus ring, reduced-motion path
- [ ] Copy matches §13 canonical lines
