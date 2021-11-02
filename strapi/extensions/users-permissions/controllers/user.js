const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  async exists(ctx) {
    const res = await strapi.plugins[
      "users-permissions"
    ].services.user.fetchAll(ctx.query);
    return res[0] != null || false;
  },
  async me(ctx) {
    const { id } = ctx.state.user;
    const entity = await strapi.plugins[
      "users-permissions"
    ].services.user.fetch({
      id,
    });
    return sanitizeEntity(entity, {
      model: strapi.plugins["users-permissions"].models.user,
    });
  },
  async update(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;
    const { body } = ctx.request;
    if (id == user.id) {
      return await strapi
        .query("user", "users-permissions")
        .update({ id }, body);
    } else {
      return ctx.send("Not you.", 403);
    }
  },
};
