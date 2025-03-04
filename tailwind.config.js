/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      'violet': '#9e7f66',
      'light-violet': '#939BF4',
      'circle-violet': '#5964E0',
      'dark-blue': '#19202D',
      'midnight': '#121721',
      'white': '#FFFFFF',
      'light-grey': '#F4F6F8',
      'gray': '#9DAEC2',
      'dark-grey': '#6E8098',
    },
    fontFamily: {
      serif: ["Kumbh Sans", "serif"],
    },
  },
  darkMode: "class",
  plugins: [],
};