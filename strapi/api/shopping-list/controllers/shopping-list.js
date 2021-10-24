"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async addItem(ctx) {
    const { list, name, grocery } = ctx.request.body;
    const entity = await fetchList(list);
    if (!isOwner(entity.users)) return error(ctx);
    entity.groceries.unshift({ name, grocery, purchased: false });
    const updatedList = await updateList(list, entity.groceries);
    ctx.send(updatedList.groceries[0]);
  },
  async removeItem(ctx) {
    const { list, item, user } = ctx.params;
    const entity = await fetchList(list);
    if (!isOwner(entity.users)) return error(ctx);
    const groceries = entity.groceries.filter((grocery) => grocery.id != item);
    await updateList(list, groceries);
    ctx.send("Updated", 204);
  },
  async itemPurchased(ctx) {
    const { list, item } = ctx.params;
    const entity = await fetchList(list);
    if (!isOwner(entity.users)) return error(ctx);
    const groceries = entity.groceries.filter((grocery) => {
      if (grocery.id == item) {
        grocery.purchased = !grocery.purchased;
        grocery.purchased_at = grocery.purchased ? new Date() : null;
      }
      return item;
    });
    await updateList(list, groceries);
    ctx.send("Updated", 204);
  },
};

const fetchList = async (id) => {
  return await strapi.services["shopping-list"].findOne({ id });
};

const isOwner = async (users, userId) => {
  return users.some((user) => user.id == userId);
};

const error = (ctx) => {
  ctx.send("Not your shopping list", 403);
};

const updateList = async (id, groceries) => {
  try {
    return await strapi.query("shopping-list").update({ id }, { groceries });
  } catch (error) {
    return false;
  }
};
