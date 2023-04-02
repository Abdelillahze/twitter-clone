/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      white: {
        100: "white",
        50: "rgb(255 255 255 / 50%)",
        10: "rgb(255 255 255 / 10%)",
        5: "rgb(255 255 255 / 5%)",
      },
      black: {
        100: "black",
        70: "rgb(0 0 0 / 70%)",
        30: "rgb(0 0 0 / 30%)",
      },
      transparent: "transparent",
      blue: {
        100: "#1d9bf0",
        10: "#1e9cf11a",
        5: "#1e9cf10d",
      },
      pink: {
        100: "rgb(249 24 128)",
        10: "rgb(249 24 128 / 10%)",
      },
      p: "#606469",
      green: {
        100: "rgb(0 186 124)",
        10: "rgb(0 186 124 / 10%)",
      },
      banner: "rgb(51 54 57)",
      borderColor: "#2f3336",
      red: {
        100: "rgb(244 33 46)",
        10: "rgb(244 33 46 / 10%)",
      },
    },
    screens: {
      xs: "475px",
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [],
};
