<template>
  <nav class="grid grid-flow-col w-full h-16 bg-gray-50 border-b-2 my-auto">
    <div class="col-span-3 my-auto">
      <router-link class="text-2xl font-semibold ml-10" to="/"
        >Listify
        <span
          class="text-xs text-white bg-cyan-500 rounded font-light px-2 py-0.5"
          >Beta</span
        ></router-link
      >
    </div>
    <div
      class="grid grid-flow-col justify-end mr-6 items-center gap-8 font-semibold"
    >
      <div>
        <nuxt-link to="/about">Om Listify</nuxt-link>
      </div>
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
        >Logg ut</Button
      >
      <Button
        v-if="!$apolloHelpers.getToken() && !$store.state.userInfo"
        to="/login"
        >Logg inn</Button
      >
    </div>
  </nav>
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
