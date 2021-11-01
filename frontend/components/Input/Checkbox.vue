<template>
  <div
    class="h-6 w-6 border-2 border-green-600 shadow rounded transform hover:scale-110 active:scale-90 duration-300 grid"
    @click="$emit('click')"
    :class="{ 'shadow-lg ring ring-green-300 ring-offset-3': enter }"
  >
    <font-awesome-icon
      class="m-auto transform duration-200"
      v-if="icon"
      :icon="icon"
    />
  </div>
</template>

<script>
export default {
  props: {
    icon: String,
  },
  data: () => ({
    enter: false
  }),
  watch: {
    icon() {
      if (!this.icon) return;
      this.enter = true;
      setTimeout(() => {
        this.enter = false;
      }, 500);
    }
  }
};
</script>

<style></style>
