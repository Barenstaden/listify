<template>
  <form
    class="lg:w-96 mx-auto shadow-xl bg-white rounded flex flex-wrap"
    @submit.prevent="addItem()"
  >
    <Input
      class="w-10/12"
      type="text"
      v-model="item"
      placeholder="Trykk enter eller + for å legge til"
    />
    <button type="submit" class="text-3xl w-2/12">+</button>
    <div
      class="w-full grid grid-cols-12 mb-3 px-3 gap-x-2"
      v-if="categories && groceries && !groceries.length && searchWord.length"
    >
      <v-select
        label="name"
        :options="categories"
        :value="lastUsedCategory"
        v-model="category"
        class="col-span-9 text-left"
        placeholder="Velg en kategori"
        @input="addItem()"
      ></v-select>
      <button
        class="col-span-3 text-white font-semibold bg-green-600 rounded"
        style="height: 34px"
      >
        Lagre
      </button>
      <p v-if="missingCategory" class="col-span-12 text-red-900 text-sm">
        Du må velge en kategori
      </p>
    </div>
    <p class="text-red-600" v-if="alreadyInList">
      Varen finnes allerede i handlelisten
    </p>
  </form>
</template>

<script>
import Vue from "vue";
import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";
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
    missingCategory: false,
    grocery: null,
    searchTimer: 0
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
      result: res => console.log(res.data),
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
      return await this.$axios({
        method: "post",
        url: "/groceries",
        data: {
          name: this.item.toLowerCase(),
          category: this.category.id,
          times_added: 1,
          list: this.$route.params.list
        }
      }).then(res => res.data);
    },
    lastUsedCategory() {
      if (!this.items.length) return 0;
      return this.categories.find(
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

      return searchWord.reduce((words, word) => {
        word = word.replace(/[0-9]/g, "").toLowerCase();
        if (word.endsWith("er")) {
          word = word.substring(0, word.length - 2);
        }

        if (word.length) words.push(word);
        return words;
      }, []);
    }
  },
  watch: {
    searchWord() {
      clearTimeout(this.searchTimer);
      this.$apollo.queries.groceries.stop();
      this.searchTimer = setTimeout(() => {
        this.searchWord.length
          ? this.$apollo.queries.groceries.start()
          : this.$apollo.queries.groceries.stop();
      }, 50);
    }
  }
};
</script>

<style></style>
