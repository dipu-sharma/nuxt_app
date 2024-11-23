<template>
    <div v-if="isLoggedIn" class="fixed bottom-4 right-4 bg-gray-100 px-4 py-2 rounded shadow-md">
        <p class="text-sm text-bold">Auto-logout in: {{ formattedTime }}</p>
    </div>
</template>

<script setup>
import { useAutoLogout } from "~/composables/autoLogout";
import { useAuthStore } from "~/stores/auth";

const { remainingTime, startTimer, stopTimer } = useAutoLogout()
const authStore = useAuthStore();

const isLoggedIn = computed(() => authStore.isAuthenticated);

const formattedTime = computed(() => {
    const minutes = Math.floor(remainingTime.value / 60);
    const seconds = remainingTime.value % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

watch(
    () => authStore.isAuthenticated,
    (isLoggedIn) => {
        if (isLoggedIn) {
            startTimer();
        } else {
            stopTimer();
        }
    },
    { immediate: true }
);

</script>

<style scoped>
/* Add any styles you need */
</style>
