/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'strong-violet': '#7C5DFA',
        'light-violet': '#9277FF',
        'strong-blue': '#1E2139',
        'light-blue': '#252945',
        'light-gray': '#DFE3FA',
        'strong-gray': '#888EB0',
        'purple': '#7E88C3 ',
        'dark1': '#0C0E16',
        'orange': '#EC5757',
        'salmon': '#FF9797 ',
        'white': '#F8F8FB',
        'dark2': '#141625',
      },
    }
  },
  safelist: ["bg-strong-blue"],
  plugins: [],
}