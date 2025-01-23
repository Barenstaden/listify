<template>
  <div class="px-2">
    <div v-if="shoppingList" class="py-2 lg:w-96 m-auto">
      <div v-if="deferredPrompt" class="bg-gray-50 p-4 rounded mb-2">
        <h1 class="text-lg text-green-700">Last ned Listify</h1>
        <p class="text-sm">
          Gjør det enkelt å finne tilbake til handlelisten ved å installere
          appen. Det er helt gratis og tar kun noen sekunder.
        </p>
        <Button @click.native="install" class="mt-4">Last ned</Button>
        <Button @click.native="dismiss" color="red" class="mt-4 ml-2">Lukk</Button>
      </div>
      <div class="mb-2 bg-gray-50 p-4 rounded text-sm" v-if="!loading">
        <!-- Users -->
        <p v-if="
          nearestStore &&
          distanceToNearestStore < isStore &&
          storeSetup &&
          !newStore
        ">
          Varene er sortert for {{ nearestStore.name }}.
        </p>
        <p v-if="
          (!storeSetup && nearestStore && distanceToNearestStore < isStore) ||
          newStore
        ">
          Du er med på å bestemme hvordan varene for
          {{ nearestStore.name }} skal sorteres. Etter du har fullført første
          handletur vil varene begynne å sortere seg automatisk.
        </p>
        <p class="text-sm" v-if="distanceToNearestStore > isStore && nearestStore">
          Du er {{ distanceToNearestStore }} meter unna {{ nearestStore.name }}.
          Varene sorteres når du nærmer deg en butikk.
        </p>
        <p class="text-sm" v-if="this.nearbyStores && !this.nearbyStores.length">
          Det finnes ingen butikker i nærheten.
        </p>
        <div class="mt-2 font-semibold">
          <p v-if="
            shoppingList.users.length == 1 &&
            $auth.loggedIn &&
            shoppingList.users[0].id == $auth.user.id
          ">
            Du er den eneste med tilgang til listen
          </p>
          <p v-else>
            {{ users[0].toUpperCase() + users.substring(1, 1000) }} deler denne
            listen
          </p>
        </div>
      </div>
      <div class="bg-red-600 px-4 py-2 text-white mb-2 rounded grid" v-if="!$auth.loggedIn">
        <p>
          Du må logge inn eller opprette en bruker for å krysse av varer på
          listen.
        </p>
        <Button @click.native="createUser = true" color="white">Kom i gang</Button>
      </div>
      <div v-if="loading" class="text-center text-white text-xl grid place-items-center">
        <div class="text-white">
          <p class="text-sm mt-2">{{ loadingText }}</p>
        </div>
      </div>
      <ShoppingListAddItem :items="shoppingList.groceries" :categories="categories" />
      <!-- <p v-if="shoppingList.groceries.length" class="text-sm my-1 text-white">
        <span v-if="!editGroceries">Hold inne en vare for å redigere</span
        ><span v-else>Hold på en vare for å avslutte redigering</span>
      </p> -->
      <AnimatedList v-if="shoppingList" class="grid mt-1">
        <li class="bg-gray-100 w-full lg:w-96 m-auto shadow my-0.5 p-3 text-left rounded grid grid-cols-12"
          v-for="item in sortedItems" :key="item.id">
          <p @mousedown="holding(item.id)" @mouseup="interactingElement = null" class="col-span-11 cursor-pointer"
            :class="item.purchased ? 'line-through' : ''">
            {{
              item.name[0].toUpperCase() +
              item.name.substring(1, item.name.length)
            }}
          </p>
          <InputCheckbox v-if="!editGroceries" :icon="item.purchased ? 'check' : ''" :disabled="!$auth.loggedIn"
            @click="toggleItemPurchased(item, !item.purchased)" />
          <font-awesome-icon class="m-auto text-red-600" v-if="editGroceries" icon="trash"
            @click="removeItem(item.id)" />
          <p class="text-sm col-span-12 text-green-700" v-if="item.purchased && item.purchased_by && $auth.loggedIn">
            {{
              item.purchased_by.id == $auth.user.id
                ? "Deg"
                : item.purchased_by.name
            }}
          </p>
        </li>
      </AnimatedList>
      <ShoppingListShareList :listName="shoppingList.title" :token="shoppingList.access_token" />
      <Modal v-if="createUser" @closeModal="createUser = false">
        <Login @loggedIn="joinList()" />
        <Button class="float-right" color="red" @click.native="createUser = false">Lukk</Button>
      </Modal>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client"
export default {
  data: () => ({
    deferredPrompt: null,
    position: null,
    locatorId: null,
    isStore: 50,
    nearbyStoresFetched: false,
    nearbyStores: [],
    shoppingList: null,
    storeSetup: null,
    storeDoesntExists: false,
    loading: false,
    loadingText: "",
    interactingElement: null,
    editGroceries: false,
    newStore: false,
    socket: null,
    audio: null,
    createUser: false
  }),
  async mounted() {
    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault()
      this.deferredPrompt = e
    })
    window.addEventListener("appinstalled", () => {
      this.deferredPrompt = null
    })
    this.shoppingList = await this.$axios
      .get(
        `/shopping-lists/${this.$route.params.list}/${this.$route.query.access_token}`
      )
      .then(res => res.data)
    this.socket = io.connect({
      query: {
        id: this.$auth.user?.id || "",
        list: this.$route.params.list
      }
    })
    this.socket.on("item_added", item => {
      this.shoppingList.groceries.unshift(item)
    })
    this.socket.on("item_removed", item => {
      this.shoppingList.groceries = this.shoppingList.groceries.filter(
        grocery => grocery.id != item
      )
    })
    this.socket.on("item_purchased", item => {
      // Missing id on grocery.category. Fetching shopping list
      const index = this.shoppingList.groceries.findIndex(g => g.id == item.id)
      this.shoppingList.groceries.splice(index, 1, item)
    })
    if (navigator.geolocation) {
      this.trackPosition()
    }
    if (this.$auth.loggedIn) {
      await this.$axios({
        method: "put",
        url: `/users/${this.$auth.user.id}`,
        data: {
          last_used_list: this.shoppingList.id
        }
      })
    }
  },
  async fetch() {
    this.categories = await this.$axios
      .get("/categories")
      .then(res => res.data)
  },
  methods: {
    async dismiss() {
      this.deferredPrompt = null
    },
    async install() {
      this.deferredPrompt.prompt()
    },
    async trackPosition() {
      this.locatorId = navigator.geolocation.watchPosition(
        this.updatePosition,
        this.error,
        {
          enableHighAccuracy: true,
          timeout: 1000,
          maximumAge: 0
        }
      )
    },
    async updatePosition(position) {
      const { latitude, longitude } = position.coords

      // Return if position is the same as previous update
      if (
        this.position &&
        this.nearbyStores &&
        this.position.latitude == latitude &&
        this.position.longitude == longitude
      ) {
        return
      }

      // Fetch nearby stores first time
      if (!this.nearbyStoresFetched) {
        this.nearbyStoresFetched = true
        this.nearbyStores = await this.findNearbyStores(position.coords)
      }

      if (this.position) {
        console.log(
          "Brukeren har beveget seg",
          this.metersFromSavedPosition(latitude, longitude),
          "meter siden sist."
        )
      }

      // If position is set and user is outside store radius and has moved 500 meters or more since last time, fetch stores and update position
      if (
        this.position &&
        !this.nearbyStores.length &&
        this.metersFromSavedPosition(latitude, longitude) > 500
      ) {
        this.nearbyStores = await this.findNearbyStores(position.coords)
        this.position = position.coords
      }
      // If still no stores and position set, dont update position and return
      if (this.position && !this.nearbyStores.length) return

      // Update position
      this.position = position.coords

      // Check if user is moving away from all stores
      const stillInRadius = this.nearbyStores.some(s => {
        if (!s.distance) return true
        const { lat, lng } = s.geometry.location
        return this.metersFromSavedPosition(lat, lng) <= s.distance
      })

      // Double check if stillInRadious worked (fix me)
      if (!stillInRadius && this.nearbyStores.length) {
        this.loadingText = "Finner butikker..."
        this.nearbyStores = await this.findNearbyStores(position.coords)
      }

      // Update distance to all stores
      this.nearbyStores = this.nearbyStores.filter(s => {
        const { lat, lng } = s.geometry.location
        s.distance = this.metersFromSavedPosition(lat, lng)
        return s
      })

      // User is arriving store, fetch storesetup
      if (
        this.distanceToNearestStore < this.isStore &&
        this.storeDoesntExists != this.nearestStore.name &&
        !this.storeSetup
      ) {
        this.storeSetup = await this.findStoreSetup()
        this.storeDoesntExists = this.storeSetup
          ? false
          : this.nearestStore.name
      }

      // If user is leaving store, remove storesetup
      if (this.distanceToNearestStore > this.isStore && this.storeSetup) {
        this.storeSetup = null
        this.storeDoesntExists = false
      }
      this.loadingText = ""
    },
    error(err) {
      // navigator.geolocation.clearWatch(this.locatorId);
    },
    metersFromSavedPosition(latitude, longitude) {
      const earthR = 6371000 // Earth radius in meters
      const p = Math.PI / 180
      const c = Math.cos
      const a =
        0.5 -
        c((latitude - this.position.latitude) * p) / 2 +
        (c(this.position.latitude * p) *
          c(latitude * p) *
          (1 - c((longitude - this.position.longitude) * p))) /
        2

      return Math.round(earthR * 2 * Math.asin(Math.sqrt(a))) //km
    },
    async findNearbyStores(coords) {
      const { latitude, longitude } = coords
      console.log("Henter butikker")
      // console.log("------------------");
      const res = await this.$axios
        .get(`/nearest-store/${latitude}/${longitude}`)
        .then(res => res.data)
      const userInfo = await this.$axios({
        method: "put",
        url: `/users/${this.$auth.user.id}`,
        data: {
          nearby_stores: res
        }
      })
      return res
    },
    async findStoreSetup() {
      return await this.$axios
        .get(`/shops?_name=${this.nearestStore.name}`)
        .then(res => (res.data.length ? res.data[0] : null))
    },
    findIndexOfCategory(categoryToFind) {
      const index = this.storeSetup.grocery_placement?.findIndex(
        category => category.category.name == categoryToFind
      )
      return index != -1 ? index : 10
    },
    async toggleItemPurchased(item, purchased) {
      if (!this.$auth.loggedIn) return
      // Update list locally
      const purchased_at = purchased ? new Date() : null
      const { latitude, longitude } = this.position
      this.shoppingList.groceries = this.shoppingList.groceries.filter(
        _item => {
          if (_item.id == item.id) {
            item.purchased = purchased
            item.purchased_at = purchased_at
            // For checking distance to store when sorting new categories
            item.latitude = latitude
            item.longitude = longitude
          }
          return item
        }
      )
      if (purchased) {
        this.audio = new Audio(`/complete.mp3`)
        this.audio.play()
      }
      // Update list on server
      await this.$axios({
        method: "put",
        url: `/item-purchased`,
        data: {
          list: this.$route.params.list,
          item: item.id,
          purchased_by: this.$auth.user?.id,
          latitude,
          longitude
        }
      })
      // Create store if user is nearby store and storeSetup is null
      if (
        this.nearestStore &&
        !this.storeSetup &&
        this.metersFromSavedPosition(
          this.nearestStore.geometry.location.lat,
          this.nearestStore.geometry.location.lng
        ) < this.isStore
      ) {
        if (purchased) {
          this.storeSetup = await this.createStore(item.grocery.category)
          this.newStore = true
        }
      }
      if (this.storeSetup?.new_store && purchased) {
        const categoriesForShop = this.updateStoreCategories()
        console.log(categoriesForShop)
        if (!categoriesForShop) return
        this.storeSetup = await this.updateStore(categoriesForShop)
      }
    },
    updateStoreCategories() {
      // category.id changed to category.category
      const categoriesInPurchasedItems = this.findCategoriesInPurchasedItems()
      // If no categories in store

      if (this.storeSetup.grocery_placement.length < 2)
        return categoriesInPurchasedItems

      return this.findAllCategoriesFromShoppingListAndStore(
        categoriesInPurchasedItems
      )
    },
    findAllCategoriesFromShoppingListAndStore(categories) {
      // If no new items return existing
      if (!categories.some(c => !c.new))
        return this.storeSetup.grocery_placement
      const existingItems = this.storeSetup.grocery_placement.filter(
        c => (c.category = c.category.id)
      )
      return categories.reduce((allCategories, category, index) => {
        if (category.new && !categories[index - 1]?.new) {
          const insertAfterIndex = allCategories.findIndex(
            c => c.category == allCategories[index - 1]?.category
          )
          if (insertAfterIndex > -1)
            allCategories.splice(insertAfterIndex + 1, 0, category)
          else allCategories.push(category)
          category.new = false
        }
        return allCategories
        // If item is new and previous item is not new
      }, existingItems)
    },
    findCategoriesInPurchasedItems() {
      return this.shoppingList.groceries
        .reduce((categories, item) => {
          // If item is purchased, not in storeSetup and purchased within 40 meters from current position
          if (
            item.purchased &&
            !categories.some(cat => cat.category == item.grocery.category.id) &&
            this.metersFromSavedPosition(item.latitude, item.longitude) < 40
          ) {
            const newItem = !this.storeSetup.grocery_placement.some(grocery => {
              return grocery.category.id == item.grocery.category.id
            })
            // Check if item
            categories.push({
              category: item.grocery.category.id,
              name: item.grocery.category.name,
              new: newItem,
              latitude: item.latitude,
              longitude: item.longitude
            })
          }
          return categories
        }, [])
        .reverse()
    },
    async findPurchasedItem(id) {
      return this.shoppingList.groceries.find(g => g.id == id)
    },
    async createStore(category) {
      return await this.$axios({
        method: "post",
        url: "/shops",
        data: {
          name: this.nearestStore.name,
          new_store: true,
          latitude: this.position.latitude,
          longitude: this.position.longitude,
          grocery_placement: [
            {
              name: category.name,
              category: category.id
            }
          ]
        }
      }).then(res => res.data)
    },
    async updateStore(categories) {
      const new_store = categories.length < this.categories.length
      return await this.$axios({
        method: "put",
        url: `/shops/${this.storeSetup.id}`,
        data: {
          list: this.shoppingList.id,
          token: this.$route.query.access_token,
          grocery_placement: categories,
          new_store
        }
      }).then(res => res.data)
    },
    async removeItem(id) {
      await this.$axios.put(`/remove-item/${this.$route.params.list}/${id}`)
      this.shoppingList.groceries = this.shoppingList.groceries.filter(
        grocery => grocery.id != id
      )
    },
    async joinList() {
      this.createUser = false
      const isUser = this.shoppingList.users.some(
        user => user.id == this.$auth.user.id
      )
      if (isUser) return
      this.shoppingList = await this.$axios
        .put("/add-new-user", {
          list: this.$route.params.list,
          id: this.$auth.user.id
        })
        .then(res => res.data)
    },
    holding(id) {
      this.interactingElement = id
      setTimeout(() => {
        if (this.editGroceries && this.interactingElement == id)
          return (this.editGroceries = false)
        if (this.interactingElement == id) this.editGroceries = true
      }, 600)
    }
  },
  computed: {
    nearestStore() {
      if (!this.nearbyStores || !this.nearbyStores.length) return null
      return this.nearbyStores.concat().sort((a, b) => {
        const distA = this.metersFromSavedPosition(
          a.geometry.location.lat,
          a.geometry.location.lng
        )
        const distB = this.metersFromSavedPosition(
          b.geometry.location.lat,
          b.geometry.location.lng
        )
        return distA - distB
      })[0]
    },
    distanceToNearestStore() {
      if (!this.nearestStore) return Infinity
      const { lat, lng } = this.nearestStore.geometry.location
      return this.metersFromSavedPosition(lat, lng)
    },
    users() {
      return this.shoppingList.users.reduce((users, user, index) => {
        users += user.id == this.$auth.user?.id ? "du" : user.name
        if (index == 0 && index < this.shoppingList.users.length - 2) {
          users += ", "
        }
        if (index < this.shoppingList.users.length - 1) {
          users += " og "
        }
        return users
      }, "")
    },
    sortedItems() {
      if (!this.shoppingList.groceries?.length) return []
      if (
        !this.storeSetup ||
        this.distanceToNearestStore > this.isStore ||
        this.newStore
      ) {
        return this.shoppingList.groceries.sort((a, b) => {
          if (a.purchased || b.purchased) {
            return a.purchased - b.purchased
          }
          return a.purchased - b.purchased || b.id - a.id
        })
      }
      return this.shoppingList.groceries.sort((a, b) => {
        if (a.purchased || b.purchased) {
          return a.purchased - b.purchased
        }
        return (
          this.findIndexOfCategory(a.grocery.category.name) -
          this.findIndexOfCategory(b.grocery.category.name)
        )
      })
    }
  },
  beforeDestroy() {
    navigator.geolocation.clearWatch(this.locatorId)
  }
}
</script>

<style></style>
