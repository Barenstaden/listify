module.exports = {
  async find(ctx) {
    if (!Object.keys(ctx.query).length)
      return ctx.send("You are not allowed to list users.", 403);
    const publicInfo = ["first_name"];
    const res = await strapi.plugins[
      "users-permissions"
    ].services.user.fetchAll(ctx.query);

    // If application
    if (ctx.state.user && ctx.state.user.role.type == "application") {
      return res;
    }
    console.log(res);
    // Everyone else
    return res.filter((res) => {
      // Delete private fields and return user object
      Object.keys(res).filter((key) => {
        if (!publicInfo.includes(key)) delete res[key];
      });

      return true;
    }, []);
  },
};
