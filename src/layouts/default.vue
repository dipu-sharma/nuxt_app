<template>
  <div style="background-color: rgb(var(--color-background)); min-height: 100vh" class="relative overflow-hidden transition-colors duration-500">
    <!-- Global Ambient Gradient Background -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 opacity-80 mix-blend-normal"></div>
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] mix-blend-multiply opacity-50 animate-blob"></div>
      <div class="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[150px] mix-blend-multiply opacity-50 animate-blob animation-delay-2000"></div>
    </div>

    <div class="relative z-10 flex flex-col min-h-screen">
      <header class="relative z-[100]">
        <Navbar />
      </header>
      <main :class="['flex-grow', { 'pt-20': !isLoginPage }]">
        <slot />
      </main>
      <AutoLogOut />
    </div>
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