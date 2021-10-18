<template>
  <div class="">
    <font-awesome-icon
      v-if="loading"
      icon="spinner"
      class="animate-spin text-center"
    />
    <font-awesome-icon v-if="success" icon="check" class="text-center" />
    <span v-if="!loading && !success">{{ text }}</span>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    text: String
  },
  data: () => ({
    success: false
  }),
  watch: {
    loading() {
      if (this.loading == false) {
        this.success = true;
        setTimeout(() => {
          this.success = false;
        }, 300);
      }
    }
  }
};
</script>

<style></style>
