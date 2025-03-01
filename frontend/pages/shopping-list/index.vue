<template>
  <div class="text-center">
    <Content v-if="!$auth.loggedIn">
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
    <Content v-else class="text-white pt-10">
      <h1 class="text-2xl lg:text-4xl">Dine handlelister</h1>
      <div class="grid lg:grid-cols-3 mt-10 gap-8">
        <nuxt-link
          class="bg-gray-50 p-4 text-gray-900 rounded-xl"
          v-for="(list, index) in $auth.user.shopping_lists"
          :key="list.id"
          :to="`/shopping-list/${list.id}`"
        >
          <h2 class="text-lg">
            {{ list.title ? list.title : `Handleliste ${index + 1}` }}
          </h2>
          <p class="text-xs p-2 rounded">
            Oppdatert for {{ $dayjs(list.updated_at).fromNow() }}
          </p>
          <p>
            Inneholder
            <strong>{{
              list.groceries.length ? list.groceries.length : "ingen"
            }}</strong>
            varer
          </p>
        </nuxt-link>
      </div>
      <div class="mt-6">
        <Button @click.native="addList = true" color="white"
          >Opprett en ny handleliste</Button
        >
        <Modal v-if="addList" @closeModal="addList = false">
          <form @submit.prevent="createShoppingList()">
            <Input
              label="Tittel på handleliste"
              placeholder="Handleliste for hyttetur"
              v-model="title"
            />
            <div>
              <Button type="submit" class="mr-2" color="green"
                ><Loading :loading="loading" text="Lagre"
              /></Button>
              <Button type="button" color="red" @click.native="addList = false"
                >Avbryt</Button
              >
            </div>
          </form>
        </Modal>
      </div>
    </Content>
  </div>
</template>

<script>
export default {
  data: () => ({
    addList: false,
    title: "",
    loading: false
  }),
  async mounted() {
    if (!this.$auth.loggedIn) return;
    const { shopping_lists } = this.$auth.user;
    if (!shopping_lists.length) this.createShoppingList();
    // If one shopping list and just logged in
    if (
      shopping_lists.length == 1 &&
      this.$dayjs().diff(this.$auth.user.last_login, "seconds") < 2
    ) {
      this.redirectToShoppingList(shopping_lists[0].id);
    }
  },
  methods: {
    redirectToShoppingList(id) {
      this.$router.push(`/shopping-list/${id}`);
    },
    checkIfUserHasShoppingList(user) {
      if (user.shopping_lists.length == 1) {
        this.redirectToShoppingList(user.shopping_lists[0].id);
      } else {
        this.createShoppingList();
      }
    },
    async createShoppingList() {
      console.log("hei");
      this.loading = true;
      try {
        const res = await this.$axios({
          url: "/shopping-lists",
          method: "post",
          data: {
            users: this.$auth.user.id,
            title: this.title || "Ny handleliste"
          }
        });
        this.$auth.fetchUser();
        this.addList = false;
        this.title = "";
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    }
  }
};
</script>
