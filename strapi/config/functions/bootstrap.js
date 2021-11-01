"use strict";

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

module.exports = async () => {
  process.nextTick(async () => {
    var io = require("socket.io")(strapi.server);

    io.on("connection", async (socket) => {
      socket.join(socket.handshake.query.list);
      if (!socket.handshake.query.id) return console.log("No id provided");
      const res = await strapi
        .query("user", "users-permissions")
        .update({ id: socket.handshake.query.id }, { online: true });
      console.log(res.email, "logged in");

      // listen for user diconnect
      socket.on("disconnect", async () => {
        if (!socket.handshake.query.id)
          return console.log("No id on disconnect");
        const res = await strapi
          .query("user", "users-permissions")
          .update({ id: socket.handshake.query.id }, { online: false });
        console.log(res.email, "logged off");
      });
    });
    strapi.io = io; // register socket io inside strapi main object to use it globally anywhere
  });
};
