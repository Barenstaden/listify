<template>
  <transition-group name="flip-list" :style="cssVars" tag="ul">
    <slot />
  </transition-group>
</template>

<script>
export default {
  props: {
    enter: String,
    duration: {
      type: Number,
      default: 0.5
    }
  },
  computed: {
    enterClass() {
      if (!this.enter || this.enter == "down") return "-translate-y-full";
      else return "translate-y-full";
    },
    cssVars() {
      return {
        "--duration": `transform ${this.duration}s`
      };
    }
  }
};
</script>

<style>
.flip-list-move {
  transition: var(--duration);
}
</style>
