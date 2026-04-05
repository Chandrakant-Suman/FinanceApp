/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: '#0f1117',
          card: '#161b27',
          elevated: '#1e2535',
          border: '#252d3d',
        },
        ink: {
          DEFAULT: '#e8eaf2',
          muted: '#7b84a0',
          faint: '#3d4560',
        },
        accent: {
          DEFAULT: '#4ade80',   // green — income
          dim: '#16a34a',
          glow: 'rgba(74,222,128,0.15)',
        },
        danger: {
          DEFAULT: '#f87171',   // red — expense
          dim: '#dc2626',
          glow: 'rgba(248,113,113,0.15)',
        },
        brand: {
          DEFAULT: '#818cf8',   // indigo — primary actions
          dim: '#4f46e5',
          glow: 'rgba(129,140,248,0.15)',
        },
      },
      boxShadow: {
        card: '0 0 0 1px rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.4)',
        glow: '0 0 20px rgba(129,140,248,0.25)',
        'glow-green': '0 0 20px rgba(74,222,128,0.2)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease both',
        'fade-in': 'fade-in 0.3s ease both',
        shimmer: 'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
};
