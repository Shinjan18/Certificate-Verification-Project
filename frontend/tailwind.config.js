/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        teal: {
          500: '#14b8a6',
        },
        purple: {
          600: '#7c3aed',
        },
        midnight: '#0b1526',
        'surface-dark': '#101b33',
        'surface-light': '#182542',
        'accent-glow': '#a5f3fc',
      },
      backgroundImage: {
        'gradient-soft': 'linear-gradient(120deg, #0f172a 0%, #1f2937 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(20,184,166,0.08), rgba(124,58,237,0.08))',
        'gradient-brand': 'linear-gradient(135deg, #14b8a6, #7c3aed)',
      },
      boxShadow: {
        glow: '0 20px 45px rgba(20,184,166,0.25)',
        'glow-purple': '0 20px 45px rgba(124,58,237,0.25)',
        glass: '0 30px 60px rgba(15,23,42,0.35)',
      },
    },
  },
  plugins: [],
};





