<template>
  <transition-group
    tag="div"
    enter-active-class="transform-gpu duration-500"
    :enter-class="enterClass"
    leave-active-class="transform-gpu duration-500"
    leave-to-class="opacity-0"
  >
    <slot />
  </transition-group>
</template>

<script>
export default {
  props: {
    enter: String
  },
  computed: {
    enterClass() {
      if (!this.enter || this.enter == "down") return "-translate-y-full";
      else return "translate-y-full";
    }
  }
};
</script>

<style></style>
