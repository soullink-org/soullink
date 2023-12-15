/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "text-primary",
    "text-upbeat",
    "text-chill",
    "text-relaxed",
    "text-melancholic",
    "hover:text-primary",
    "hover:text-upbeat",
    "hover:text-chill",
    "hover:text-relaxed",
    "hover:text-melancholic",
  ],
  theme: {
    screens: {
      desktop: { min: "1900px" },
      "3xl": { max: "1890px" },
      "2xl": { max: "1535px" },
      xl: { max: "1279px" },
      lg: { max: "1023px" },
      md: { max: "767px" },
      sm: { max: "639px" },
      xs: { max: "480px" },
    },
    colors: {
      ...require("tailwindcss/colors"),
      primary: "#01FF00",
      dark: "#0e0a18",
      upbeat: "#ff6f00",
      chill: "#7bffb4",
      relaxed: "#1a63fe",
      melancholic: "#6e00d0",
    },
    extend: {},
  },
  plugins: [],
};
