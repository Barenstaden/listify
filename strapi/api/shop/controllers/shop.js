"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const axios = require("axios");

module.exports = {
  async nearestStore(ctx) {
    const { lat, long } = ctx.params;
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=matbutikk&radius=2000&location=${lat},${long}&language=no&key=${process.env.GOOGLE_API_KEY}`
      );
      ctx.send(response.data.results);
    } catch (error) {
      ctx.send("Something went wrong", 500);
    }
  },
};
