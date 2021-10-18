<template>
  <div
    class="h-6 w-6 border-2 border-green-600 shadow rounded transform hover:scale-110 active:scale-90 duration-200 grid"
    @click="$emit('click')"
  >
    <font-awesome-icon class="m-auto" v-if="icon" :icon="icon" />
  </div>
</template>

<script>
export default {
  props: {
    icon: String
  }
};
</script>

<style></style>
