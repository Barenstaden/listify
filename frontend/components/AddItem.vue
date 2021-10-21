<template>
  <form
    class="lg:w-96 mx-auto shadow-xl bg-white rounded flex flex-wrap mb-2"
    @submit.prevent="addItem"
  >
    <Input
      class="w-10/12"
      type="text"
      v-model="item"
      placeholder="Trykk enter eller + for å legge til"
    />
    <button type="submit" class="text-3xl w-2/12">+</button>
    <InputSelect
      v-if="categories && groceries && !groceries.length"
      label="Velg en kategori *"
      :items="categories"
      human="name"
      v-model="category"
      @change.native="addItem()"
      inputValue="id"
      :startIndex="2"
      class="w-full text-left px-2 text-blue-900"
    ></InputSelect>
    <p class="text-red-600" v-if="alreadyInList">
      Varen finnes allerede i handlelisten
    </p>
  </form>
</template>

<script>
import axios from "axios";
import gql from "graphql-tag";
export default {
  props: {
    items: Array
  },
  data: () => ({
    alreadyInList: false,
    item: "",
    category: null,
    grocery: null
  }),
  apollo: {
    categories: {
      query: gql`
        query categories {
          categories {
            name
            groceries {
              name
            }
            id
          }
        }
      `
    },
    groceries: {
      query: gql`
        query groceries($name: String) {
          groceries(where: { name_contains: $name }) {
            name
            id
            category {
              id
              name
            }
          }
        }
      `,
      // result: res => console.log(res),
      skip: true,
      debounce: 100,
      variables() {
        return {
          name: this.item
        };
      }
    }
  },
  methods: {
    async addItem() {
      if (!this.groceries.length && this.category) {
        this.groceries.unshift(await this.addNewGrocery());
      }
      let item = {
        list: this.$route.params.list,
        name: this.item
      };

      if (this.$route.params.list === "local") {
        item.grocery = this.groceries[0];
        item.id = this.items.length;
        this.$emit("itemAdded", item);
      } else {
        item.grocery = this.groceries[0].id;
        const res = await axios({
          method: "post",
          url: "/api/add-item",
          data: item
        });
        this.$emit("itemAdded", res.data);
      }
      this.category = null;
      this.item = "";
    },
    async addNewGrocery() {
      const category = this.categories.find(cat => cat.id == this.category);
      return await axios({
        method: "post",
        url: "/api/groceries",
        data: {
          name: this.item,
          category: category
        }
      }).then(res => res.data);
    }
  },
  watch: {
    item() {
      this.item.length
        ? this.$apollo.queries.groceries.start()
        : this.$apollo.queries.groceries.stop();
    }
  }
};
</script>

<style></style>
