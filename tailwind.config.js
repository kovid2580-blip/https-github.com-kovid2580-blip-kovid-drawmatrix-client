/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        antigravity: {
          text: '#f8fafc',
          bg: '#0f172a',
          accent: '#8b5cf6',
        }
      }
    },
  },

  plugins: [],
}
