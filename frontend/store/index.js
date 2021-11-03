export const state = () => ({
  userInfo: null,
  loggedInAt: null
});
export const mutations = {
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  },
  setLoggedInAt(state) {
    state.loggedInAt = new Date();
  },
  deleteUserInfo(state) {
    state.userInfo = null;
    state.loggedInAt = null;
  },
  addShoppingList(state, shoppingList) {
    state.userInfo.shopping_lists.push(shoppingList);
  }
};
