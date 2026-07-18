import type { Config } from 'tailwindcss';
import {
  color,
  font,
  radius,
  motion,
  giltBorderOnNavy,
  glowOnNavy,
} from '@librato/shared/tokens';

// The theme is generated FROM packages/shared/src/tokens.ts — never add a raw
// hex here for a Selah color. Legacy v1 aliases remain only until the marketing
// pages are rebuilt in Stage 6, mapped onto the same tokens where one exists.
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        nave: {
          950: color.nave950,
          900: color.nave900,
          800: color.nave800,
          700: color.nave700,
        },
        vellum: { 100: color.vellum100, 200: color.vellum200 },
        gilt: { 500: color.gilt500, 300: color.gilt300, edge: giltBorderOnNavy },
        ink: { 900: color.ink900, 500: color.ink500 },
        olive: { 500: color.olive500 },
        ember: { 600: color.ember600 },
        // ---- legacy v1 aliases (marketing pages only; retired in Stage 6) ----
        navy: color.nave800,
        'navy-light': color.nave700,
        gold: color.gilt500,
        'gold-light': color.gilt300,
        'gold-muted': '#D4BA7A',
        cream: color.vellum100,
        parchment: color.vellum200,
        'warm-white': '#FEFCF6',
        'text-dark': color.ink900,
        'text-medium': color.ink500,
        'text-light': '#8A7F72',
        sage: color.olive500,
        border: '#E8DFD0',
        error: color.ember600,
      },
      fontFamily: {
        display: ['var(--font-display)', font.display],
        scripture: ['var(--font-scripture)', font.scripture],
        body: ['var(--font-sans)', font.body],
        sans: ['var(--font-sans)', font.body],
      },
      borderRadius: {
        panel: `${radius.panel}px`,
        control: `${radius.control}px`,
        pill: `${radius.pill}px`,
      },
      boxShadow: {
        glow: `0 20px 60px ${glowOnNavy}`,
      },
      transitionTimingFunction: {
        selah: motion.easeSelah,
      },
      transitionDuration: {
        whisper: `${motion.durWhisper}ms`,
        settle: `${motion.durSettle}ms`,
        breath: `${motion.durBreath}ms`,
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
