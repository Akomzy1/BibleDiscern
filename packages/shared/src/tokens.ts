// Selah design tokens — the single source of truth for color, type, radius, and motion.
// Consumed by web/tailwind.config.ts today and a React Native theme provider at native time.
// Never hardcode a hex, a duration, or a type size in a component — import from here.

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
  display: '"Playfair Display", Georgia, serif', // display ONLY
  scripture: '"Cormorant Garamond", Georgia, serif', // scripture/prayer/questions, italic
  body: '"Source Sans 3", system-ui, sans-serif', // all UI + body
} as const;

export const radius = { panel: 14, control: 10, pill: 999 } as const;

export const motion = {
  easeSelah: 'cubic-bezier(0.22, 0.8, 0.24, 1)',
  durWhisper: 250, // hovers, focus, small reveals
  durSettle: 450, // beam settle, card commit
  durBreath: 700, // page/panel transitions (fade + 8px rise)
} as const;

export const giltBorderOnNavy = 'rgba(200,164,94,0.12)'; // 1px panel edge on navy
export const glowOnNavy = 'rgba(200,164,94,0.06)'; // shadow tint + candle glow (<=6%)
