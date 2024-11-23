<template>
  <div class="flex h-screen bg-gray-50 dark:bg-white">
    <!-- SideBar: Show only on desktop or when opened on mobile -->
    <SideBar v-if="isDesktop || navStore.isSideMenuOpen" />

    <div class="flex flex-col flex-1 w-full">
      <!-- Topbar -->
      <Topbar />
      <!-- Main page -->
      <main class="h-full pb-16 overflow-y-auto">
        <div class="container grid px-6 mx-auto">
          <NuxtPage />
        </div>
      </main>
    </div>

  </div>
</template>

<script setup>
import SideBar from '~/components/AdminPage/Sidebar.vue';
import Topbar from '~/components/AdminPage/Topbar.vue';
import { useNavStore } from '~/stores/navStore';

const navStore = useNavStore();
const isDesktop = ref(false);

onMounted(() => {
  isDesktop.value = window.innerWidth >= 1024;
  window.addEventListener('resize', () => {
    isDesktop.value = window.innerWidth >= 1024;
  });
});
</script>

<style scoped>
/* Optional: Add custom styles here */
</style>
