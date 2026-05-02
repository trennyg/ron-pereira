import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light:   '#F0D080',
          dark:    '#7A6020',
          dim:     'rgba(201,168,76,0.25)',
        },
        ink: {
          DEFAULT: '#08060A',
          mid:     '#0F0C12',
          light:   '#1A1520',
        },
        cream: {
          DEFAULT: '#F0EDE8',
          dim:     'rgba(240,237,232,0.5)',
          ghost:   'rgba(240,237,232,0.25)',
        },
      },
      fontFamily: {
        cinzel:     ['var(--font-cinzel)', 'serif'],
        cormorant:  ['var(--font-cormorant)', 'serif'],
        mono:       ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'gold-sweep': 'goldSweep 5s linear infinite',
        'grain':      'grain 0.4s steps(4) infinite',
        'eq-bar':     'eqBar 0.9s ease-in-out infinite',
        'scroll-hint':'scrollHint 2.2s ease-in-out infinite',
      },
      keyframes: {
        goldSweep: {
          '0%':   { backgroundPosition: '150% 50%' },
          '100%': { backgroundPosition: '-150% 50%' },
        },
        grain: {
          '0%,100%': { transform: 'translate(0,0)' },
          '25%':     { transform: 'translate(-3px,2px)' },
          '75%':     { transform: 'translate(2px,-3px)' },
        },
        eqBar: {
          '0%,100%': { height: '3px' },
          '50%':     { height: '20px' },
        },
        scrollHint: {
          '0%,100%': { opacity: '0.7', transform: 'scaleY(1)' },
          '50%':     { opacity: '0.3', transform: 'scaleY(0.5)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
