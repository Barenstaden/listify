<template>
  <div class="my-2 px-2">
    <label v-if="label" class="text-sm font-medium float-left">{{
      label
    }}</label>
    <input
      class="w-full bg-transparent p-4 mt-2"
      :type="type"
      :placeholder="
        placeholder ? placeholder : 'Fyll inn ' + label.toLowerCase()
      "
      :required="required"
      ref="input"
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    placeholder: {
      type: String,
      default: ""
    },
    required: Boolean,
    type: {
      type: String,
      default: "Select input type"
    },
    focus: Boolean,
    value: {
      type: [String, Number],
      default: ""
    }
  },
  mounted() {
    if (this.focus) this.$refs.input.focus();
  }
};
</script>

<style></style>
