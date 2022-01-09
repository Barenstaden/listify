<template>
  <div>
    <transition-group name="home">
      <Navigation :key="1" />
      <Nuxt
        :key="2"
        class="bg-gradient-to-tr from-green-600 to-cyan-600"
        style="min-height: 93.5vh;"
      />
    </transition-group>
  </div>
</template>

<script>
export default {};
</script>

<style>
.home-enter-active,
.home-leave-active {
  transition: opacity 0.8s;
}
.home-enter,
.home-leave-active {
  opacity: 0.7;
}
</style>
