<template>
  <div class="flex h-screen bg-gray-50 dark:bg-white">
    <!-- Sidebar: Visible only on desktop or toggled on mobile -->
    <SideBar v-if="isDesktop" />

    <div class="flex flex-col flex-1 w-full">
      <!-- Topbar -->
      <Topbar />

      <!-- Main page content -->
      <main class="h-full pb-16 overflow-y-auto">
        <div class="container grid px-6 mx-auto">
          <slot />
        </div>
      </main>
      <AutoLogOut />
    </div>
  </div>
</template>

<script setup>
import SideBar from '~/components/AdminPage/Sidebar.vue'
import Topbar from '~/components/AdminPage/Topbar.vue'
import { useAuthStore } from '~/stores/auth'
import { useAutoLogout } from '~/composables/autoLogout'

const authStore = useAuthStore()

const { startTimer, stopTimer } = useAutoLogout()

const isDesktop = ref(false)

watch(
  () => authStore.isAuthenticated,
  (isLoggedIn) => {
    if (isLoggedIn) {
      startTimer();
    } else {
      stopTimer();
    }
  }
);

onMounted(() => {
  const updateIsDesktop = () => {
    isDesktop.value = window.innerWidth >= 1024;
  };
  updateIsDesktop()
  window.addEventListener('resize', updateIsDesktop);

  onUnmounted(() => {
    window.removeEventListener('resize', updateIsDesktop);
  });
});
</script>

<style scoped>
/* Custom styles (optional) */
</style>
