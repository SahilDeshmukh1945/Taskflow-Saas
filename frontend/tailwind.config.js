/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          0: '#080A0E',
          1: '#0D1017',
          2: '#111520',
          3: '#161B2A',
          4: '#1C2235',
        },
        border: {
          subtle: '#1E2535',
          default: '#252D40',
          strong: '#2E3A52',
        },
        accent: {
          blue: '#3B82F6',
          violet: '#7C3AED',
        },
        text: {
          primary: '#E8ECF4',
          secondary: '#8B95A8',
          tertiary: '#525C6E',
          muted: '#353E50',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}