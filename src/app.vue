<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useHead } from '#app'
// console.log(Object.keys(obj));
useHead({
  title: 'D-shop',
  meta: [
    { name: 'description', content: 'Page-specific description' }
  ]
})
</script>