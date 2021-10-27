<template>
  <div>
    <div class="border-2 border-green-500 shadow p-4 text-xl rounded-lg">
      <h3>{{ items[selectedItem].name }}</h3>
    </div>
    <div class="mt-2 opacity-50 text-lg">
      <p>Kategori: {{ items[selectedItem].result.category }}</p>
      <p>Plassering: {{ items[selectedItem].result.placement }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: [
      { name: "4 bananer", result: { category: "Frukt", placement: "1" } },
      {
        name: "400 gram kylling",
        result: { category: "Kylling", placement: "2" }
      },
      {
        name: "grovt brød",
        result: { category: "Brød", placement: "4" }
      },
      { name: "to liter melk", result: { category: "Melk", placement: "3" } }
    ],
    selectedItem: 0
  }),
  mounted() {
    setInterval(() => {
      if (this.selectedItem == this.items.length - 1) {
        this.selectedItem = 0;
      } else {
        this.selectedItem++;
      }
    }, 4000);
  },
  methods: {}
};
</script>

<style></style>
