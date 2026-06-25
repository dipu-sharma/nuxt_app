<template>
  <div style="background-color: rgb(var(--color-background)); min-height: 100vh">
    <header class="relative z-[100]">
      <Navbar />
    </header>
    <main :class="{ 'pt-20': !isLoginPage }">
      <slot />
    </main>
    <AutoLogOut />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const isLoginPage = computed(() => route.path === '/login')
// or more flexible:
// route.path.startsWith('/login') 
// || route.name === 'Login'
// || ['login', 'signin', 'auth'].includes(route.name)
</script>

<style scoped>
/* your existing styles */
</style>