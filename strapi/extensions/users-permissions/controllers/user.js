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
};
