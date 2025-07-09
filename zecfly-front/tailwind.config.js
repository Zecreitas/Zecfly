/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a73e8',      // Azul principal
        secondary: '#00b8a9',    // Verde-água
        accent: '#ff9f43',       // Laranja para promoções
      },
    },
  },
  plugins: [],
}