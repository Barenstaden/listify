<template>
  <div class="my-4 w-full">
    <label class="text-sm font-medium float-left">{{ label }}</label>
    <textarea
      :rows="value ? value.length / 50 : 1"
      class="w-full bg-transparent pt-1 pb-3 border-b border-gray-dark focus:outline-none inline-block"
      :placeholder="
        placeholder ? placeholder : 'Fyll inn ' + label.toLowerCase()
      "
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "Input label"
    },
    placeholder: {
      type: String,
      default: ""
    },
    value: {
      type: [String, Number],
      default: ""
    }
  }
};
</script>

<style scoped>
textarea {
  min-height: 10px;
  max-height: 800px;
}
</style>
