<template>
  <div class="grid grid-cols-12 h-16 items-center bg-gray-50 border-b-2">
    <router-link class="inline-block w-40 text-2xl font-semibold ml-10" to="/"
      >Listify</router-link
    >
    <Button
      v-if="$apolloHelpers.getToken() && $store.state.userInfo"
      @click.native="
        [
          $apolloHelpers.onLogout(),
          $router.push('/'),
          $store.commit('deleteUserInfo')
        ]
      "
      color="red"
      class="col-span-2 col-start-11 items-right float-right"
      >Logg ut</Button
    >
    <Button
      v-if="!$apolloHelpers.getToken() && !$store.state.userInfo"
      to="/login"
      class="col-span-2 col-start-11 items-right float-right"
      >Logg inn</Button
    >
  </div>
</template>

<script>
export default {
  async mounted() {
    if (this.$apolloHelpers.getToken()) {
      this.$axios.setHeader(
        "Authorization",
        `Bearer ${this.$apolloHelpers.getToken()}`
      );
      this.$store.commit(
        "setUserInfo",
        await this.$axios.get("/users/me").then(res => res.data)
      );
    }
  }
};
</script>

<style></style>
