/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6F6CF6',
          light: '#8D8BF8',
          dark: '#6851F5',
          50: '#E7ECFF',
          100: '#BAC0F7',
          200: '#8D8BF8',
          300: '#6F6CF6',
          400: '#6851F5',
        },
        gray: {
          50: '#F8F8F8',
          100: '#DDE1E8',
          200: '#B4BAC6',
          300: '#757880',
          400: '#5B6374',
          500: '#363841',
          900: '#010B13',
        },
        error: '#FE4E39',
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
