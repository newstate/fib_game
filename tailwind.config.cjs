/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "./*.{ts,tsx}"  // For files in root directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} 