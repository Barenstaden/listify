<template>
  <div>
    <Content class="bg-gray-50 text-green-800">
      <div class="grid md:grid-cols-5 items-center">
        <div class="my-10 md:col-span-2 px-4 md:px-2 items-center">
          <h1 class="text-2xl font-semibold lg:text-4xl">
            Kanskje norges smarteste handleliste for
            <span class="font-black" :class="shops[selectedShop].color">{{
              shops[selectedShop].name
            }}</span>
          </h1>
          <h2 class="text-xl lg:text-2xl mt-4">
            <!-- Trigger -->
            En handleliste som sorteres automatisk når du kommer på butikken
          </h2>
          <Button to="/shopping-list" class="mt-4">Opprett handleliste</Button>
        </div>
        <div class="md:col-span-3 mx-auto md:my-10">
          <FrontPageDevice
            class="transform scale-90 md:scale-100 -ml-5 -mb-2 -mt-4 md:ml-0 md:mb-0 md:mt-0"
            :items="itemsSortedByShop"
          />
        </div>
      </div>
    </Content>

    <Content class="text-white md:-mt-3">
      <div
        class="lg:grid lg:grid-cols-3 gap-8 pt-4 pb-10 lg:py-20 items-center"
      >
        <div
          class="col-span-1 text-gray-900 bg-green-500 lg:w-64 mx-auto p-2 rounded-xl shadow-xl transform -rotate-2"
        >
          <div class="transform rotate-2 bg-gray-100 rounded-xl shadow">
            <FrontPageShoppingList :duration="0.5" :items="purchasingItems" />
          </div>
        </div>

        <div class="col-span-2 lg:w-2/3 mx-auto">
          <h2 class="text-3xl">
            Del med venner og familie
          </h2>
          <p class="text-xl mt-4">
            Listify lar deg enkelt dele handlelisten med venner og familie, helt
            uten at de trenger å laste ned en app - bare del linken til
            handelisten.
          </p>
          <Button to="/shopping-list" color="white" class="mt-6"
            >Kom i gang</Button
          >
        </div>

        <!-- <AnimatedList>
          <div
            v-for="item in purchasedItems"
            class="bg-white p-3 my-1 rounded text-gray-900"
            :key="item.name"
          >
            <p class="text-xs">
              {{ $dayjs(item.purchased_at).format("HH:mm") }}
            </p>
            Ola kjøpte {{ item.name.toLowerCase() }}
          </div>
        </AnimatedList> -->
      </div>
    </Content>
    <Content class="py-20 text-gray-800 bg-gray-100">
      <div class="grid grid-cols-3 gap-8">
        <div class="col-span-3 md:col-span-2">
          <h2 class="text-3xl">Enklere blir det ikke</h2>
          <p class="py-2 text-xl">
            Helt uten at du merker noe vil Listify hente data om varen i
            bakgrunnen og gjøre klart for din neste handletur. Når du er på
            butikken har Listify automatisk sortert varene etter plassering i
            butikken.
          </p>
          <p class="text-sm">
            Listify lærer mens du handler, og vil ikke alltid være sortert
            første gang du besøker en butikk.
          </p>
        </div>
        <FrontPageAddItem
          class="border-2 border-green-500  rounded-xl p-3 text-gray-900"
        />
      </div>
    </Content>
    <Content class="py-20 text-white">
      <h2 class="text-3xl">Dekker Listify min butikk?</h2>
      <p class="py-2 text-xl">
        Listify lærer mens du handler og blir bedre jo mer det blir handlet i en
        butikk. Bli med å gjøre Listify enda bedre ved å opprette en
        handleliste!
      </p>
      <Button to="/shopping-list" color="white" class="mt-4"
        >Opprett handleliste</Button
      >
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
        sort: [1, 4, 2, 3, 5],
        color: "text-red-600"
      },
      {
        name: "Kiwi",
        sort: [2, 1, 5, 3, 4],
        color: "text-green-500"
      },
      {
        name: "Rema 1000",
        sort: [5, 2, 3, 1, 4],
        color: "text-blue-500"
      },
      {
        name: "Bunnpris",
        sort: [4, 1, 5, 3, 2],
        color: "text-gray-900"
      },
      {
        name: "Coop Mega",
        sort: [3, 5, 1, 4, 2],
        color: "text-blue-700"
      }
    ],
    selectedShop: 0,
    notPurchasedItems: 0,
    purchasing: true
  }),
  mounted() {
    this.notPurchasedItems = this.shoppingList.length;
    setInterval(() => {
      if (this.selectedShop == this.shops.length - 1) {
        this.selectedShop = 0;
      } else {
        this.selectedShop++;
      }
    }, 4000);
  },
  methods: {
    findIndexOfCategory(idToFind) {
      return this.shops[this.selectedShop].sort.findIndex(id => id == idToFind);
    }
  },
  computed: {
    purchasingItems() {
      return this.shoppingList.concat().sort((a, b) => {
        return a.purchased - b.purchased;
      });
    },
    purchasedItems() {
      return this.purchasingItems
        .filter(i => i.purchased)
        .concat()
        .sort((a, b) => a.purchased_at - b.purchased_at);
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
