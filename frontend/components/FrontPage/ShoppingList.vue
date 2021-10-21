<template>
  <AnimatedList :duration="duration" class="p-3">
    <li
      class="bg-gray-100 m-auto shadow my-0.5 p-3 text-left rounded capitalize flex"
      v-for="item in items"
      :key="item.name"
    >
      <p class="w-11/12 cursor-pointer">
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
