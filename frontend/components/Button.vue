<template>
  <div class="inline-block m-auto">
    <div v-if="to" class="inline-block">
      <router-link :class="[colors[color], size, classList]" :to="to">
        <slot />
      </router-link>
    </div>
    <button
      @click="$emit('click', $event)"
      v-else
      :disabled="disabled"
      :type="type"
      :class="[colors[color], size || 'text-sm', classList]"
    >
      <slot />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "Button"
    },
    type: {
      type: String,
      default: "button"
    },
    to: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "green"
    },
    size: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    colors: {
      green:
        "border-green-800 text-green-800 hover:bg-green-800 hover:text-white",
      red: "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
    },
    classList:
      "font-bold border-2 py-1 lg:py-2 px-3 lg:px-6 rounded shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100 active:shadow-lg duration-200 disabled:opacity-20"
  })
};
</script>

<style></style>
