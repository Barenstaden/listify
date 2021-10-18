<template>
  <div class="my-2">
    <input
      :min="min"
      :max="max"
      type="range"
      :value="startValue"
      :step="step"
      @input="$emit('input', parseInt($event.target.value))"
    />
  </div>
</template>

<script>
export default {
  props: {
    min: Number,
    max: Number,
    step: Number,
    startValue: Number
  },
  created() {
    this.$emit("input", parseInt(this.startValue));
  }
};
</script>

<style scoped>
input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 15px;
  border-radius: 15px;
  background: #ed7729;
  outline: none;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}
input::-webkit-slider-thumb {
  -webkit-appearance: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  border: 2px solid #fff;
  appearance: none;
  width: 35px;
  height: 35px;
  background: #436195;
  cursor: pointer;
  border-radius: 50%;
}
input::-moz-range-thumb {
  width: 35px;
  height: 35px;
  background: #436195;
  cursor: pointer;
  border-radius: 50%;
}
</style>
