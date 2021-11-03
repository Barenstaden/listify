<template>
  <AnimatedList :duration="duration" class="p-3">
    <li
      class="bg-gray-100 m-auto shadow my-1 p-3 text-left rounded flex"
      v-for="item in items"
      :key="item.name"
      @click="
        [
          (item.purchased = !item.purchased),
          item.purchased
            ? (item.purchased_at = new Date())
            : (item.purchased_at = null)
        ]
      "
    >
      <p
        class="w-11/12 cursor-pointer"
        :class="item.purchased ? 'line-through' : ''"
      >
        {{ item.name }}
      </p>
      <InputCheckbox :icon="item.purchased && !hidePurchased ? 'check' : ''" />
    </li>
  </AnimatedList>
</template>

<script>
export default {
  props: {
    items: Array,
    hidePurchased: Boolean,
    duration: Number
  }
};
</script>

<style></style>
