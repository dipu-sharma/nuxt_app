<template>
    <div>
        <!-- Mobile Sidebar -->
        <div v-show="navStore.isSideMenuOpen"
            class="fixed inset-0 z-10 top-16 w-64 bg-black text-gray-200 transform transition-transform duration-300 md:hidden">
            <div class="py-4 px-6">
                <h1 class="text-xl text-white mb-2">Admin Dashboard</h1>
                <ul>
                    <li v-for="(item, index) in sidebarItems" :key="index" class="relative px-6 py-3">
                        <NuxtLink
                            class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800"
                            :to="item.path" :class="{ 'text-black bg-white p-2 rounded-lg': isActive(item.path) }">
                            <svg class="w-5 h-5" aria-hidden="true" fill="none" stroke-linecap="round"
                                stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path :d="item.iconPath" />
                            </svg>
                            <span class="ml-4">{{ item.label }}</span>
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from "vue-router"
import { useNavStore } from '~/stores/navStore';

const navStore = useNavStore()

const sidebarItems = ref([
    { label: "Dashboard", path: "/admin/" },
    { label: "Products", path: "/admin/products", iconPath: "M12 2C8.14 2 5 5.14 5 9V17.59L2.7 19.9C2.53 20.05 2.39 20.28 2.35 20.54C2.31 20.79 2.37 21.05 2.5 21.27L12 22L21.5 21.27C21.63 21.05 21.69 20.79 21.65 20.54C21.61 20.28 21.47 20.05 21.3 19.9L19 17.59V9C19 5.14 15.86 2 12 2Z" },
    { label: "Orders", path: "/admin/orders", iconPath: "M4 4h16v2H4V4zm0 5h16v2H4V9zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" },
    { label: "Settings", path: "/admin/settings" },
    { label: "Cards", path: "/admin/cards" },
])
function isActive(path) {
    const route = useRoute()
    return route.path === path
}
</script>

<style scoped>
/* Transition for sliding in/out */
[v-show] {
    transform: translateX(-100%);
}

[v-show].is-visible {
    transform: translateX(0);
}
</style>
