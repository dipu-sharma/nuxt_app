<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="animate-pulse">Loading orders...</div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: [
    'auth-role',
    function (to, from) {
      return navigateTo('/user?tab=orders', { replace: true })
    }
  ],
  role: ['User', 'ADMIN']
})
</script>
