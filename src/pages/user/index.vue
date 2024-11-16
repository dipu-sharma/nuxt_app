<template>
    <div>
        <h1 class="pt-10">User Page</h1>
    </div>
</template>

<script setup>
definePageMeta({
  title: 'User',
  description: 'Learn more about our company',
  middleware: ['auth-role'],
  role: ['user', 'admin']
})
</script>