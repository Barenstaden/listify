export const state = () => ({
  userInfo: null
});
export const mutations = {
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  },
  deleteUserInfo(state) {
    state.userInfo = null;
  },
  addShoppingList(state, shoppingList) {
    state.userInfo.shopping_lists.push(shoppingList);
  }
};
