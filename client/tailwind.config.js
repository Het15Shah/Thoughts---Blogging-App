/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['Arimo', 'sans-serif'],
        serif: ['Arimo', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        brand: {
          orange: '#FF8C42',
          pink:   '#FF59B6',
          purple: '#8B5CF6',
          yellow: '#FFDB58',
          dark:   '#1A1A1A',
        }
      },
      animation: {
        'fade-in-up':  'fadeInUp 0.45s cubic-bezier(0.4,0,0.2,1) both',
        'scale-in':    'scaleIn 0.35s cubic-bezier(0.4,0,0.2,1) both',
        'spin-slow':   'spin 3s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      boxShadow: {
        'brand-sm': '0 2px 12px rgba(139, 92, 246, 0.18)',
        'brand-md': '0 6px 24px rgba(139, 92, 246, 0.24)',
        'brand-lg': '0 12px 40px rgba(139, 92, 246, 0.32)',
      }
    },
  },
  plugins: [],
}
