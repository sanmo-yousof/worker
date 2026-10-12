/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        outlier: {
          dark: '#08090D',
          darker: '#050608',
          card: '#10121A',
          cardHover: '#151722',
          accent: '#6366F1',
          accentLight: '#818CF8',
          purple: '#8B5CF6',
          cyan: '#06B6D4',
          emerald: '#10B981',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fragment Mono', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
