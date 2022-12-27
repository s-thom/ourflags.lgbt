/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // If changing the fonts here, also make sure that the OpenGraph image
        // generation is updated as well.
        body: ["InterVariable", "Inter-fallback", "sans-serif"],
        headings: [
          '"Permanent Marker"',
          '"Permanent Marker-fallback"',
          "sans-serif",
        ],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  darkMode: "class",
};
