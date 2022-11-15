const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./ui/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        accent: colors.yellow,
        neutral: colors.slate,
      }
    },
  },
  plugins: [
    require('@headlessui/tailwindcss')
  ],
}
