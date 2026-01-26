// stores/navStore.js

import { defineStore } from 'pinia'
export const useNavStore = defineStore('navdata', () => {
	const isDesktopSidebarOpen = ref(true)
	const isMobileSidebarOpen = ref(false)

	function toggleDesktopSideMenu() {
		isDesktopSidebarOpen.value = !isDesktopSidebarOpen.value
	}

	function toggleMobileSideMenu() {
		isMobileSidebarOpen.value = !isMobileSidebarOpen.value
	}

	function $reset() {
		isDesktopSidebarOpen.value = true
		isMobileSidebarOpen.value = false
	}
	return { isDesktopSidebarOpen, isMobileSidebarOpen, toggleDesktopSideMenu, toggleMobileSideMenu, $reset }
})
