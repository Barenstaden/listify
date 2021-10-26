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
    },
    scale: {
      "0": "0",
      "25": ".25",
      "50": ".5",
      "60": ".6",
      "75": ".75",
      "90": ".9",
      "95": ".95",
      "100": "1",
      "105": "1.05",
      "110": "1.1",
      "125": "1.25",
      "150": "1.5",
      "200": "2"
    }
  }
};
