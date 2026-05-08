import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#080604',
        deep: '#0e0b08',
        stone: {
          950: '#0e0b08',
          900: '#181410',
          800: '#282018',
          700: '#3a2e20',
          600: '#5a4a38',
          500: '#7a6a50',
          400: '#a08a68',
          300: '#c0aa88',
          200: '#d8c8a8',
          100: '#ece4cc',
        },
        gold: '#c89828',
        gold2: '#e8b840',
        gold3: '#f8d868',
        crimson: '#8b1818',
        parchment: '#f0e4c0',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        'cinzel-decorative': ['Cinzel Decorative', 'serif'],
        fell: ['IM Fell English', 'serif'],
      },
      animation: {
        flicker: 'flicker 0.8s ease-in-out infinite alternate',
        glow: 'glow 0.6s ease-in-out infinite alternate',
        'typing-orb': 'typing-orb 1.2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease forwards',
      },
      keyframes: {
        flicker: {
          '0%': { transform: 'scaleX(1) scaleY(1) rotate(-1deg)', opacity: '0.95' },
          '50%': { transform: 'scaleX(0.9) scaleY(1.05) rotate(1deg)', opacity: '0.85' },
          '100%': { transform: 'scaleX(1.05) scaleY(0.98) rotate(0deg)', opacity: '1' },
        },
        glow: {
          '0%': { opacity: '0.3', transform: 'scale(0.95)' },
          '100%': { opacity: '0.5', transform: 'scale(1.1)' },
        },
        'typing-orb': {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.6' },
          '30%': { transform: 'translateY(-6px)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'stone-gradient': 'linear-gradient(to bottom, #0e0b08, #080604)',
      },
      boxShadow: {
        gold: '0 0 32px rgba(200,152,40,0.18)',
        'gold-lg': '0 0 48px rgba(200,152,40,0.28)',
      },
    },
  },
  plugins: [],
}

export default config
