<template>
  <div>
    <Content class="bg-gray-50 text-green-800">
      <div class="grid lg:grid-cols-3">
        <div class="lg:col-span-1 px-4 md:px-2 mt-10 md:mt-32">
          <h1 class="text-2xl font-semibold lg:text-4xl">
            Kanskje norges smarteste handleliste for
            {{ shops[selectedShop].name }}
          </h1>
          <h2 class="text-xl lg:text-2xl mt-4">
            <!-- Trigger -->
            En handleliste som sorterer seg selv når du nærmer deg butikken
          </h2>
          <Button to="/shopping-list/local" class="mt-4"
            >Opprett handleliste</Button
          >
        </div>
        <div
          class="lg:col-span-2 mx-auto -mt-12 md:mt-0 -mb-20 md:mb-0 -ml-6 md:ml-0"
        >
          <FrontPageDevice
            class="mx-auto transform scale-75 md:scale-100"
            :items="itemsSortedByShop"
          />
        </div>
      </div>
    </Content>
    <Content class="text-white mt-20 text-center">
      <h2 class="text-3xl"></h2>
    </Content>
    <Content class="text-white md:-mt-3">
      <div
        class="lg:grid lg:grid-cols-3 gap-4 pt-4 pb-10 lg:py-20 items-center"
      >
        <div
          class="col-span-1 text-gray-900 bg-green-500 lg:w-64 mx-auto p-2 rounded-xl shadow-xl transform -rotate-2"
        >
          <div class="transform rotate-2 bg-gray-100 rounded-xl shadow">
            <FrontPageShoppingList :duration="1" :items="purchasingItems" />
          </div>
        </div>
        <!-- <div class="lg:col-span-2">
          <h2 class="text-4xl">Del lister</h2>
          <p class="text-xl"></p>
        </div> -->
      </div>
    </Content>
  </div>
</template>

<script>
export default {
  data: () => ({
    shoppingList: [
      {
        name: "Bananer",
        purchased: false,
        category: 1
      },
      {
        name: "Epler",
        purchased: false,
        category: 1
      },
      {
        name: "Brød",
        purchased: false,
        category: 3
      },
      {
        name: "Brunost",
        purchased: false,
        category: 4
      },
      {
        name: "Melk",
        purchased: false,
        category: 4
      },
      {
        name: "Yoghurt",
        purchased: false,
        category: 4
      }
    ],
    shops: [
      {
        name: "Meny",
        sort: [1, 4, 2, 3, 5]
      },
      {
        name: "Kiwi",
        sort: [2, 1, 5, 3, 4]
      },
      {
        name: "Rema 1000",
        sort: [5, 2, 3, 1, 4]
      },
      {
        name: "Bunnpris",
        sort: [4, 1, 5, 3, 2]
      },
      {
        name: "Coop Mega",
        sort: [3, 5, 1, 4, 2]
      }
    ],
    selectedShop: 0,
    notPurchasedItems: 0,
    purchasing: true
  }),
  mounted() {
    this.notPurchasedItems = this.shoppingList.length;
    setInterval(() => {
      this.mix();
    }, 3000);
    setInterval(() => {
      if (this.selectedShop == this.shops.length - 1) {
        this.selectedShop = 0;
      } else {
        this.selectedShop++;
      }
    }, 4000);
  },
  methods: {
    mix() {
      let random = Math.floor(Math.random() * this.notPurchasedItems);
      this.shoppingList[random].purchased = !this.shoppingList[random]
        .purchased;
      if (this.notPurchasedItems === 0) {
        this.purchasing = false;
        this.notPurchasedItems = this.shoppingList.length - 1;
      } else {
        this.purchasing = true;
      }
      this.purchasing ? this.notPurchasedItems-- : this.notPurchasedItems++;
    },
    findIndexOfCategory(idToFind) {
      return this.shops[this.selectedShop].sort.findIndex(id => id == idToFind);
    }
  },
  computed: {
    purchasingItems() {
      return this.shoppingList.concat().sort((a, b) => {
        if (a.purchased || b.purchased) {
          return a.purchased - b.purchased;
        }
        return a.category - b.category;
      });
    },
    itemsSortedByShop() {
      return this.shoppingList.concat().sort((a, b) => {
        return (
          this.findIndexOfCategory(a.category) -
          this.findIndexOfCategory(b.category)
        );
      });
    }
  }
};
</script>
