export const state = () => ({
  userInfo: null
});
export const mutations = {
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  },
  deleteUserInfo(state) {
    state.userInfo = null;
  }
};
