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
import { MeiliSearch } from "meilisearch";
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
    groceries: [],
    searchTimer: 0,
    client: new MeiliSearch({
      host: window.location.origin + "/search/",
      apiKey: "d3ebc0d6-d383-4a0d-91aa-a24d1845d5a1"
    })
  }),
  methods: {
    async search() {
      this.groceries = await this.searchWord.reduce(
        async (previousPromise, word) => {
          let hits = await previousPromise;
          const wholeWordHit = await this.client
            .index("grocery")
            .search(this.searchWord.join(" "), {
              attributesToHighlight: ["name", "category"]
            });
          if (wholeWordHit.hits.length) {
            hits.push(...wholeWordHit.hits);
            return hits;
          }
          const res = await this.client.index("grocery").search(word, {
            attributesToHighlight: ["name", "category"]
          });
          if (!hits.length) {
            hits.push(...res.hits);
          } else {
            const newHits = res.hits.filter(
              hit => !hits.some(h => h.id == hit.id)
            );
            hits.push(...newHits);
          }
          return hits;
        },
        Promise.resolve([])
      );
      this.groceries.filter(g => console.log(g.name));
    },
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
          word = word.substring(0, word.length - 1);
        }

        if (word.length) words.push(word);
        return words;
      }, []);
    }
  },
  watch: {
    searchWord() {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.search();
      }, 50);
    }
  }
};
</script>

<style></style>
