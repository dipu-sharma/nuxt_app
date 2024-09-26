<template>
  <!-- Desktop sidebar -->
  <aside class="z-20 hidden w-64 overflow-y-auto bg-black dark:bg-gray-800 md:block flex-shrink-0">
    <div class="py-4 text-gray-500 dark:text-gray-400">
      <a class="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
        D-Shop
      </a>
      <ul class="mt-6">
        <li :class="['relative px-6 py-3', { active: isActive('/admin/') }]">
          <a class="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100" :href="routes.dashboard">
            <svg class="w-5 h-5" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span class="ml-4">Dashboard</span>
          </a>
        </li>

        <li class="relative px-6 py-3">
          <button class="inline-flex items-center justify-between w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" @click="toggleUsersMenu" aria-haspopup="true">
            <span class="inline-flex items-center">
              <svg class="w-5 h-5" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM4 21a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z"></path>
              </svg>
              <span class="ml-4">Users</span>
            </span>
            <svg v-if="isUsersMenuOpen" class="w-4 h-4" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 9l-7 7-7-7"></path>
            </svg>
            <svg v-if="!isUsersMenuOpen" class="w-4 h-4" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke="none" d="M0 0h24v24H0z"/>  
              <polyline points="9 6 15 12 9 18" /></svg>
          </button>
          <ul v-if="isUsersMenuOpen" class="mt-2 space-y-3">
            <li v-for="(item, index) in usersMenuItems" :key="index" :class="['relative px-6 py-3', { active: isActive(item.path) }]">
              <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" :href="item.path">
                <span class="ml-4">{{ item.label }}</span>
              </a>
            </li>
          </ul>
        </li>

        <li v-for="(item, index) in sidebarItems" :key="index" :class="['relative px-6 py-3', { active: isActive(item.path) }]">
          <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" :href="item.path">
            <svg class="w-5 h-5" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
              <path :d="item.iconPath"></path>
            </svg>
            <span class="ml-4">{{ item.label }}</span>
          </a>
        </li>
      </ul>
      <div class="px-6 my-6">
        <button class="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
          Create account
          <span class="ml-2" aria-hidden="true">+</span>
        </button>
      </div>
    </div>
  </aside>

  <!-- Mobile sidebar -->
  <div v-if="navStore.isSideMenuOpen" class="fixed inset-0 z-10 flex items-end bg-white-100 bg-opacity-50 sm:items-center sm:justify-center"></div>
  <aside class="fixed inset-y-0 z-20 flex-shrink-0 w-64 mt-16 overflow-y-auto bg-black dark:bg-gray-800 md:hidden" v-if="navStore.isSideMenuOpen" @click.self="navStore.toggleSideMenu" @keydown.esc="navStore.toggleSideMenu">
    <div class="py-4 text-gray-500 dark:text-gray-400">
      <a class="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
        D-Shop
      </a>
      <ul class="mt-6">
        <li :class="['relative px-6 py-3', { active: isActive('/admin/') }]">
          <a class="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100" :href="routes.dashboard">
            <svg class="w-5 h-5" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span class="ml-4">Dashboard</span>
          </a>
        </li>

        <li class="relative px-6 py-3">
          <button class="inline-flex items-center justify-between w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" @click="toggleMobileUsersMenu" aria-haspopup="true">
            <span class="inline-flex items-center">
              <svg class="w-5 h-5" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM4 21a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z"></path>
              </svg>
              <span class="ml-4">Users</span>
            </span>
            <svg v-if="isMobileUsersMenuOpen" class="w-4 h-4" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 9l-7 7-7-7"></path>
            </svg>
            <svg v-if="!isMobileUsersMenuOpen" class="w-4 h-4" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke="none" d="M0 0h24v24H0z"/>  
              <polyline points="9 6 15 12 9 18" /></svg>
          </button>
          <ul v-if="isMobileUsersMenuOpen" class="mt-2 space-y-3">
            <li v-for="(item, index) in usersMenuItems" :key="index" :class="['relative px-6 py-3', { active: isActive(item.path) }]">
              <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" :href="item.path">
                <span class="ml-4">{{ item.label }}</span>
              </a>
            </li>
          </ul>
        </li>

        <li v-for="(item, index) in sidebarItems" :key="index" :class="['relative px-6 py-3', { active: isActive(item.path) }]">
          <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" :href="item.path">
            <svg class="w-5 h-5" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
              <path :d="item.iconPath"></path>
            </svg>
            <span class="ml-4">{{ item.label }}</span>
          </a>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useNavStore } from '~/stores/navStore';

// Define your routes dynamically
const routes = {
  dashboard: '/admin/',
};

const sidebarItems = [
  {
    path: '/admin/products',
    label: 'Products',
    iconPath: 'M12 4v16m8-8H4',
  },
  {
    path: '/admin/orders',
    label: 'Orders',
    iconPath: 'M12 4v16m8-8H4',
  },
  {
    path: '/admin/cards',
    label: 'Cards',
    iconPath: 'M12 4v16m8-8H4',
  },
];

const usersMenuItems = [
  {
    path: '/admin/users',
    label: 'All Users',
  },
  {
    path: '/admin/users/doss',
    label: 'Doss',
  },
  {
    path: '/admin/users/merchants',
    label: 'Merchants',
  },
];

const navStore = useNavStore();
const route = useRoute();

const isUsersMenuOpen = ref(false);
const isMobileUsersMenuOpen = ref(false);

const toggleUsersMenu = () => {
  isUsersMenuOpen.value = !isUsersMenuOpen.value;
};

const toggleMobileUsersMenu = () => {
  isMobileUsersMenuOpen.value = !isMobileUsersMenuOpen.value;
};

const isActive = (path) => {
  return route.path.startsWith(path);
};
</script>

<style scoped>
/* Add your CSS here for styling active links */
.active {
  font-weight: bold;
  color: #4a5568; /* Adjust as needed */
}
</style>
