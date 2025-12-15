/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['"Montserrat"', "sans-serif"],
      },
      colors: {
        "brand-red": "#B02B30",
        "brandRedDark": "#9e2627",
      },
    },
  },
  plugins: [],
}

