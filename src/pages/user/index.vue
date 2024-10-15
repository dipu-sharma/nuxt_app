<template>
    <div>
        <h1 class="pt-10">User Page</h1>
    </div>
</template>


<script setup>
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();

if (!authStore.isAuthenticated) {
    navigateTo('/login')
}
</script>