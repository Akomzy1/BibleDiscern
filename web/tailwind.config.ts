import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1B2A4A',
        'navy-light': '#2D4166',
        gold: '#C8A45E',
        'gold-light': '#E8D5A3',
        'gold-muted': '#D4BA7A',
        cream: '#FDF6EC',
        parchment: '#F5ECD7',
        'warm-white': '#FEFCF6',
        'text-dark': '#2C2418',
        'text-medium': '#5C5144',
        'text-light': '#8A7F72',
        sage: '#7A8B6F',
        border: '#E8DFD0',
        error: '#C0392B',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        scripture: ['var(--font-scripture)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
