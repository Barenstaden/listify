const colors = require("tailwindcss/colors");
module.exports = {
  purge: [
    "./components/**/*.{vue,js}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}"
  ],
  darkMode: "class", // or 'media' or 'class'
  variants: {
    extend: {
      opacity: ["disabled"],
      backgroundColor: ["active"],
      scale: ["active"],
      boxShadow: ["active"]
    }
  },
  theme: {
    extend: {
      transitionProperty: {
        height: "height"
      }
    },
    colors: {
      gray: colors.blueGray,
      green: colors.teal,
      cyan: colors.cyan,
      "light-blue": colors.sky,
      white: colors.white,
      red: colors.red
    }
  }
};
