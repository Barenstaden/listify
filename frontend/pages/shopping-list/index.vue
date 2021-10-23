<template>
  <div class="text-center">
    <Content v-if="!$apolloHelpers.getToken() && !$store.state.userInfo">
      <h1 class="text-4xl mb-3 text-white pt-10">Opprett en handleliste</h1>
      <p class="lg:w-2/3 mx-auto text-xl text-white text-left mb-6">
        Fyll inn en e-post for å opprette bruker. Registrering tar bare et par
        sekunder og du kan slette brukeren din og all data med et enkelt klikk.
      </p>
      <Login
        :focus="true"
        @loggedIn="checkIfUserHasShoppingList($event)"
      ></Login>
    </Content>
    <Content v-else> </Content>
  </div>
</template>

<script>
export default {
  async mounted() {
    if (!this.$store.state.userInfo) return;
    if (this.$store.state.userInfo?.shopping_lists.length) {
      return this.redirectToShoppingList(
        this.$store.state.userInfo.shopping_lists[0].id
      );
    }
    const createdShoppingList = await this.createShoppingList();
    this.redirectToShoppingList(createdShoppingList.id);
  },
  methods: {
    redirectToShoppingList(id) {
      this.$router.push(`/shopping-list/${id}`);
    },
    checkIfUserHasShoppingList(user) {
      if (user.shopping_lists.length) {
        this.redirectToShoppingList(user.shopping_lists[0].id);
      } else {
        const createdShoppingList = this.createShoppingList();
        this.redirectToShoppingList(createdShoppingList.id);
      }
    },
    async createShoppingList() {
      try {
        const res = await this.$axios({
          url: "/shopping-lists",
          method: "post",
          data: {
            users: this.$store.state.userInfo.id
          }
        });
        return red.data;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
