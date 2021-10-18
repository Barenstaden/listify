<template>
  <div class="grid">
    <label class="text-sm font-medium float-left">{{ label }}</label>
    <select
      v-model="input"
      @change="$emit('input', $event.target.value)"
      class="w-full bg-transparent pt-1 -ml-1 pb-3 border-b border-gray-dark text-lg focus:outline-none"
    >
      <option
        class="-ml-1"
        v-for="item in items"
        :key="item[inputValue]"
        :value="item[inputValue]"
        >{{ item[human] }}</option
      >
    </select>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ""
    },
    items: {
      type: Array
    },
    inputValue: String,
    human: {
      type: String
    }
  },
  data: () => ({
    input: null
  }),
  mounted() {
    this.input = this.items[0][this.inputValue];
    this.$emit("input", this.input);
  }
};
</script>

<style></style>
