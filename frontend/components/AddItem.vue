<template>
  <form
    class="lg:w-96 mx-auto shadow-xl bg-white rounded flex flex-wrap mb-2"
    @submit.prevent="addItem"
  >
    <Input
      class="w-10/12"
      type="text"
      @input="[triggerSearch(), (alreadyInList = false)]"
      v-model="item"
      placeholder="Trykk enter eller + for å legge til"
    />
    <button type="submit" class="text-3xl w-2/12">+</button>
    <InputSelect
      v-if="categories && notFound"
      label="Velg en kategori *"
      :items="categories"
      human="name"
      v-model="category"
      @change.native="addItem()"
      inputValue="id"
      class="w-full text-left px-2 text-blue-900"
    ></InputSelect>
    <p class="text-red-600" v-if="alreadyInList">
      Varen finnes allerede i handlelisten
    </p>
  </form>
</template>

<script>
import { MeiliSearch } from "meilisearch";
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
    notFound: false,
    updateCategory: false,
    client: new MeiliSearch({
      host: window.location.origin + "/search/",
      apiKey: "266e2d0f7855516b3bb47172c89c80b639f8e90cbe932b16d1e0dd7267754537"
    })
  }),
  created() {
    this.client.index("category").updateSettings({
      rankingRules: ["exactness", "words", "typo", "proximity", "attribute"]
    });
  },
  apollo: {
    categories: {
      query: gql`
        query categories {
          categories {
            name
            groceries
            id
          }
        }
      `
    }
  },
  methods: {
    async addItem() {
      if (!this.category && !this.notFound) await this.search();
      if (!this.category)
        return (this.notFound = true), (this.updateCategory = true);
      if (typeof this.category === "string") {
        this.category = this.categories.find(cat => cat.id == this.category);
      }
      const items = this.items.map(item => {
        return {
          name: item.name,
          id: item.id,
          category: item.category.id
        };
      });
      items.unshift({
        name: this.item,
        category: this.category
      });

      if (this.updateCategory) {
        try {
          const res = await axios({
            url: `/api/categories/${this.category.id}`,
            method: "put",
            data: {
              groceries: this.category.groceries + ", " + this.item
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
      try {
        const res = await axios({
          url: `/api/shopping-lists/${this.$route.params.list}`,
          method: "put",
          data: {
            shopping_list: items
          }
        });
        this.$emit("itemAdded", res.data.shopping_list);
      } catch (error) {
        console.log(error);
      }
      this.category = null;
      this.updateCategory = false;
      this.notFound = false;
      this.item = "";
    },
    triggerSearch() {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.search();
      }, 500);
    },
    async search() {
      return await this.client
        .index("category")
        .search(this.item, {
          attributesToHighlight: ["groceries"]
        })
        .then(res => {
          if (res.hits.length) {
            this.category = res.hits[0];
          }
        });
    }
  }
};
</script>

<style></style>
