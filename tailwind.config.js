/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ejs}",
    "./public/**/*.{html,js,ejs}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Segoe UI Symbol'],
      }
    },
  },
  plugins: [],
}

