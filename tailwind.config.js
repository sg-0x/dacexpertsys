/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Google Sans"', 'sans-serif'],
        inter: ['"Google Sans"', 'sans-serif'],
      },
      colors: {
        dac: {
          navy: '#1f3a89',
          dark: '#0f121a',
          slate: '#0f172a',
          text: '#334155',
          muted: '#64748b',
          light: '#94a3b8',
          border: '#e2e8f0',
          bg: '#f8fafc',
          panel: '#f1f5f9',
          blue: '#dbeafe',
          page: '#f6f6f8',
        }
      },
      boxShadow: {
        card: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
        btn: '0px 1px 2px 0px rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
}
