<template>
  <div>
    <Navigation />
    <Nuxt
      v-if="!$apolloHelpers.getToken() || $store.state.userInfo"
      class="bg-gradient-to-tr from-green-600 to-cyan-600"
      style="min-height: 93.5vh;"
    />
  </div>
</template>

<script>
export default {};
</script>

<style></style>
