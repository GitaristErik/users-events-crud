<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-wrapper">
    <RouterView />
  </div>
</template>

<style scoped>
.app-wrapper {
  background: #0f0f23;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  width: 100%;
  background: #0f0f23;
}

#app {
  width: 100vw;
  min-height: 100vh;
}
</style>
