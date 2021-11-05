<template>
  <Content class="grid items-center">
    <Login
      :focus="true"
      @loggedIn="$router.push('/shopping-list')"
      class="m-auto"
    ></Login>
  </Content>
</template>

<script>
export default {};
</script>

<style></style>
