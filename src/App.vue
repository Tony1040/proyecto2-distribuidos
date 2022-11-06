<!-- src/App.vue -->
<template>
  <div id="app" class="container">
    <div class="row" style="margin-top: 5%">
      <router-link
        class="button button-primary"
        style="margin-right: 10px"
        to="/trailer"
        >Trailers
      </router-link>
    </div>
    <router-view> </router-view>
  </div>
</template>

<script>
export default {};
</script>