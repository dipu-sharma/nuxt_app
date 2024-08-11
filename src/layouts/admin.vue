<template>
  <div class="flex h-screen bg-gray-50 dark:bg-white" :class="{ 'overflow-hidden': navStore.isSideMenuOpen }">
    <!-- SideBar -->
    <SideBar />
    <div class="flex flex-col flex-1 w-full">
      <!-- Topbar Open -->
      <Topbar />
      <!-- Top Bar Close -->

      <!-- Main page open -->
      <main class="h-full pb-16 overflow-y-auto">
        <div class="container grid px-6 mx-auto">
          <NuxtPage />
        </div>
      </main>
      <!-- Main Page close -->
    </div>
  </div>
</template>

<script setup>
import SideBar from '~/components/AdminPage/Sidebar.vue';
import Topbar from '~/components/AdminPage/Topbar.vue';
import { useNavStore } from '~/stores/navStore';
const navStore = useNavStore();
</script>

<style scoped>
/* Optional: Add custom styles here */
</style>