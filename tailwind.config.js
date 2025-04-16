/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        funky: {
          pink: '#FF6B9C',
          purple: '#B86EFF',
          blue: '#6FDFFF',
          yellow: '#FFE55C',
          green: '#77F6B3',
          orange: '#FF9F6B',
        },
        retro: {
          cream: '#FFF5E4',
          sage: '#C7D3BF',
          rust: '#E78F66',
          navy: '#1B2D45',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      backgroundImage: {
        'gradient-funky': 'linear-gradient(45deg, var(--tw-gradient-stops))',
        'gradient-retro': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'noise': "url('data:image/png;base64,base64-encoded-noise-texture')",
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
} 