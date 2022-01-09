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
          v-if="$auth.loggedIn && $auth.user.shopping_lists.length"
        >
          <span v-if="$auth.user.shopping_lists.length == 1"
            >Min handleliste</span
          >
          <span v-else>Mine handlelister</span>
        </nuxt-link>
        <Button v-if="$auth.loggedIn" @click="$auth.logout()" color="red"
          >Logg ut</Button
        >
        <Button v-if="!$auth.loggedIn" to="/login">Logg inn</Button>
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
    if (this.$auth.loggedIn) {
      this.loading = true;

      // Redirect user at login
      if (
        this.$auth.user.last_used_list &&
        this.$dayjs().diff(this.$auth.user.last_login, "seconds") < 2
      ) {
        this.$router.push(
          `/shopping-list/${this.$auth.user.last_used_list.id}`
        );
      }
      this.loading = false;
    }
  }
};
</script>

<style></style>
