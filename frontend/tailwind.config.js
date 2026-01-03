/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // PRIMARY BRAND - Teal (signature color)
        primary: {
          DEFAULT: '#1EA99B',
          light: '#2DBCAD',
        },
        
        // ACCENT - Gold (premium CTAs, distinctive)
        accent: '#51deaa',
        
        // SEMANTIC STATES
        success: {
          DEFAULT: '#10B981',
          600: '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B',
          600: '#D97706',
        },
        danger: {
          DEFAULT: '#EF4444',
          600: '#DC2626',
        },
        
        // NEUTRALS - Complete range to prevent silent failures
        gray: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
        },
        
        // DARK MODE - Custom palette with character
        dark: {
          base: '#0a0a0a98',
          surface: '#141414c3',
          border: '#262626',
          text: '#E5E5E5',
          'text-muted': '#A3A3A3',
          'text-subtle': '#737373',
        },
      },
    },
  },
  plugins: [],
}
