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
        primary: {
          50: '#ede7e3',   // Alabaster Grey (lightest)
          100: '#e8e0db',
          200: '#d4c7be',
          300: '#82c0cc',  // Sky Blue (Light)
          400: '#65b3c4',
          500: '#489fb5',  // Pacific Blue
          600: '#16697a',  // Stormy Teal (main)
          700: '#125a68',
          800: '#0e4b56',
          900: '#0a3c44',
        },
        accent: {
          DEFAULT: '#ffa62b', // Amber Glow
          light: '#ffb84d',
          dark: '#e6951a',
        },
        success: '#10b981',
        warning: '#ffa62b', // Amber Glow
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
