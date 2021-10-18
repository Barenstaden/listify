<template>
  <div
    class="backdrop-filter backdrop-blur backdrop-brightness-50 fixed grid inset-0 z-50"
    id="closeOnClick"
    @click="closeModal($event)"
    ref="background"
  >
    <div
      class="bg-white rounded-lg filter drop-shadow-2xl m-auto text-gray-900 p-6 md:w-2/3 lg:w-1/2 xl:w-1/3"
    >
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    closeModal(event) {
      if (event.target.id === "closeOnClick") this.$emit("closeModal");
    }
  }
};
</script>
