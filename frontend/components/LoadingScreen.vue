<template>
  <div
    class="fixed transform duration-300 grid inset-0 bg-gradient-to-tr from-green-600 to-cyan-600 z-50 text-white"
  >
    <div class="m-auto text-center text-2xl lg:text-5xl">
      <font-awesome-icon icon="spinner" class="animate-spin" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style></style>
