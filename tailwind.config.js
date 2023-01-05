/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./lib/components/**/*.{js,ts,jsx,tsx}",
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
      typography: {
        DEFAULT: {
          css: {
            a: {
              "text-decoration-line": "underline",
              "text-decoration-style": "dotted",
              "&:hover": {
                "text-decoration-style": "solid",
              },
              "&:focus-within": {
                "text-decoration-style": "solid",
              },
            },
            p: {
              "&:first-child": {
                "margin-top": 0,
              },
              "&:last-child": {
                "margin-bottom": 0,
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  darkMode: "class",
};
