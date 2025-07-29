<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import NavBar from './components/NavBar.vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

onMounted(() => {
  // Initialize user data if token exists
  if (authStore.token) {
    authStore.getCurrentUser()
  }
})
</script>

<template>
  <div class="app-wrapper">
    <NavBar />
    <main :class="['main-content', { 'with-navbar': isAuthenticated }]">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-wrapper {
  background: #0f0f23;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
}

.main-content {
  flex: 1;
  width: 100%;
  background: #0f0f23;
  transition: margin-top 0.3s ease;
}

.main-content.with-navbar {
  margin-top: 70px; /* Account for fixed app bar when authenticated */
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
