<template>
  <div>
    <nav class="grid grid-flow-col w-full h-16 bg-gray-50 border-b-2 my-auto">
      <div class="col-span-3 my-auto">
        <router-link
          class="text-sm lg:text-2xl font-semibold ml-2 lg:ml-10"
          to="/"
          >Listify
          <span
            class="text-xs block w-10 lg:inline-block text-white bg-cyan-500 rounded font-light px-2 py-0.5 ml-2 lg:ml-0"
            >Beta</span
          ></router-link
        >
      </div>
      <div
        class="grid grid-flow-col justify-end mr-2 lg:mr-6 items-center gap-2 lg:gap-8 font-semibold text-sm lg:text-base"
      >
        <nuxt-link to="/about">Om Listify</nuxt-link>
        <nuxt-link
          :to="`/shopping-list`"
          v-if="
            $store.state.userInfo && $store.state.userInfo.shopping_lists.length
          "
        >
          <span v-if="$store.state.userInfo.shopping_lists.length == 1"
            >Min handleliste</span
          >
          <span v-else>Mine handlelister</span>
        </nuxt-link>
        <!-- <nuxt-link :to="`/shopping-list?new=true`">
        <span v-if="$store.state.userInfo.shopping_lists.length > 1"
          >Mine handlelister</span
        ><span v-else>Ny handleliste</span>
      </nuxt-link> -->
        <Button
          v-if="$apolloHelpers.getToken() && $store.state.userInfo"
          @click.native="
            [
              $apolloHelpers.onLogout(),
              $router.push('/login'),
              $store.commit('deleteUserInfo'),
              $axios.setHeader('Authorization', '')
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
    <LoadingScreen v-if="loading" />
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  async mounted() {
    if (this.$apolloHelpers.getToken()) {
      this.loading = true;
      this.$axios.setHeader(
        "Authorization",
        `Bearer ${this.$apolloHelpers.getToken()}`
      );
      this.$store.commit(
        "setUserInfo",
        await this.$axios.get("/users/me").then(res => res.data)
      );
      this.$store.commit("setLoggedInAt");

      // Redirect user at login
      if (
        this.$store.state.userInfo.last_used_list &&
        this.$dayjs().diff(this.$store.state.loggedInAt, "seconds") < 2
      ) {
        this.$router.push(
          `/shopping-list/${this.$store.state.userInfo.last_used_list.id}`
        );
      }
      this.loading = false;
    }
  }
};
</script>

<style></style>
