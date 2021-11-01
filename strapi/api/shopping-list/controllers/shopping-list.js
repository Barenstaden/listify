"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const crypto = require("crypto");
const populate = ["groceries.grocery.category", "users"];
module.exports = {
  async findOne(ctx) {
    const { id, token } = ctx.params;
    if (!ctx.state.user && !token) return error(ctx);
    const entity = await strapi
      .query("shopping-list")
      .findOne({ id }, populate);
    if (token && token == entity.access_token) return entity;
    if (!ctx.state.user) return error(ctx);
    await isOwner(entity.users, ctx.state.user.id, token);
    return entity;
  },
  async create(ctx) {
    const { users, title } = ctx.request.body;
    const token = crypto.randomBytes(20).toString("hex");
    const entity = await strapi.services["shopping-list"].create({
      users,
      title,
      access_token: token,
    });
    return entity;
  },
  async addItem(ctx) {
    const { list, name, grocery } = ctx.request.body;
    const entity = await fetchList(list);
    if (!isOwner(entity.users)) return error(ctx);
    entity.groceries.unshift({ name, grocery, purchased: false });
    const updatedList = await updateList(list, "groceries", entity.groceries);
    ctx.send(updatedList.groceries[0]);
    strapi.io.to(list).emit("item_added", updatedList.groceries[0]);
    strapi
      .query("grocery")
      .model.query((qb) => {
        qb.where("id", grocery);
        qb.increment("times_added", 1);
      })
      .fetch();
  },
  async addNewUser(ctx) {
    const { list, id } = ctx.request.body;
    const entity = await fetchList(list);
    const users = entity.users.reduce((users, user) => {
      users.push(user.id);
      return users;
    }, []);
    users.push(id);
    const updatedList = await updateList(list, "users", users);
    console.log(updatedList);
    return updatedList;
  },
  async removeItem(ctx) {
    const { list, item, user } = ctx.params;
    const entity = await fetchList(list);
    if (!isOwner(entity.users)) return error(ctx);
    const groceries = entity.groceries.filter((grocery) => grocery.id != item);
    await updateList(list, "groceries", groceries);
    strapi.io.to(list).emit("item_removed", item);

    ctx.send("Updated", 204);
  },
  async itemPurchased(ctx) {
    const { list, item, latitude, longitude, purchased_by } = ctx.request.body;
    const entity = await fetchList(list);
    if (!isOwner(entity.users)) return error(ctx);
    const groceries = entity.groceries.filter((grocery) => {
      if (grocery.id == item) {
        grocery.purchased = !grocery.purchased;
        grocery.purchased_at = grocery.purchased ? new Date() : null;
        grocery.purchased_by = grocery.purchased ? purchased_by : null;
        grocery.latitude = grocery.purchased ? latitude : null;
        grocery.longitude = grocery.purchased ? longitude : null;
      }
      return item;
    });
    const updatedGrocery = groceries.find((g) => g.id == item);
    await updateList(list, "groceries", groceries);
    strapi.io.to(list).emit("item_purchased", updatedGrocery);
    ctx.send("Updated", 204);
  },
};

const fetchList = async (id) => {
  return await strapi.services["shopping-list"].findOne({ id }, populate);
};

const isOwner = async (users, userId) => {
  return users.some((user) => user.id == userId);
};

const error = (ctx) => {
  ctx.send("Not your shopping list", 403);
};

const updateList = async (id, field, data) => {
  try {
    await strapi.query("shopping-list").update({ id }, { [field]: data });
    return await strapi.query("shopping-list").findOne({ id }, populate);
  } catch (error) {
    return false;
  }
};
