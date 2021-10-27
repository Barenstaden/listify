<template>
  <form
    class="lg:w-96 mx-auto shadow-xl bg-white rounded flex flex-wrap"
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
      :startIndex="lastUsedCategory()"
      class="w-full text-left px-2 text-blue-900"
    ></InputSelect>
    <p class="text-red-600" v-if="alreadyInList">
      Varen finnes allerede i handlelisten
    </p>
  </form>
</template>

<script>
import gql from "graphql-tag";
export default {
  props: {
    items: Array,
    categories: Array
  },
  data: () => ({
    alreadyInList: false,
    item: "",
    category: null,
    grocery: null
  }),
  apollo: {
    groceries: {
      query: gql`
        query groceries($name: [String]) {
          groceries(where: { name_in: $name }) {
            name
            id
            category {
              id
              name
            }
          }
        }
      `,
      skip: true,
      debounce: 100,
      variables() {
        console.log(this.searchWord);
        return {
          name: this.searchWord
        };
      }
    }
  },
  methods: {
    async addItem() {
      if (!this.groceries.length && this.category) {
        this.groceries.unshift(await this.addNewGrocery());
      }
      const res = await this.$axios({
        method: "post",
        url: "/add-item",
        data: {
          list: this.$route.params.list,
          name: this.item,
          grocery: this.groceries[0].id
        }
      });
      this.$emit("itemAdded", res.data);
      this.category = null;
      this.item = "";
    },
    async addNewGrocery() {
      const category = this.categories.find(cat => cat.id == this.category);
      return await this.$axios({
        method: "post",
        url: "/groceries",
        data: {
          name: this.item,
          category: category,
          times_added: 1
        }
      }).then(res => res.data);
    },
    lastUsedCategory() {
      if (!this.items.length) return 0;
      console.log(
        this.items[0].grocery.category.id || this.items[0].grocery.category
      );
      return this.categories.findIndex(
        c =>
          c.id == this.items[0].grocery.category.id ||
          parseInt(this.items[0].grocery.category)
      );
    }
  },
  computed: {
    searchWord() {
      const wordsToRemove = [
        "stk",
        "ltr",
        "l",
        "pakke",
        "pakker",
        "kartong",
        "boks",
        "pose",
        "flaske",
        "rull",
        "liter",
        "stykker",
        "en",
        "to",
        "x"
      ];
      const searchWord = wordsToRemove.reduce((searchWord, word) => {
        if (searchWord.includes(word)) {
          searchWord.splice(
            searchWord.findIndex(w => w == word),
            1
          );
        }
        return searchWord;
      }, this.item.split(" "));

      return searchWord.map(word => {
        word = word.replace(/[0-9]/g, "").toLowerCase();
        if (word.endsWith("er")) {
          word = word.substring(0, word.length - 2);
        }
        return word;
      });
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
