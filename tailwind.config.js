/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        hopair: {
          dark: '#0d1b2a',
          navy: '#1a2e44',
          blue: '#1e90ff',
          cyan: '#00bcd4',
          accent: '#38bdf8',
        }
      }
    },
  },
  plugins: [],
}
