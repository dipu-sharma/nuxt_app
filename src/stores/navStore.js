// stores/authStore.js

import { defineStore } from 'pinia'
export const useNavStore = defineStore('navdata', () => {
	const isSideMenuOpen = ref(false)

	function toggleSideMenu() {
		isSideMenuOpen.value = !isSideMenuOpen.value
	}
	function $reset() {
		isSideMenuOpen.value = false
	}
	return { isSideMenuOpen, toggleSideMenu, $reset }
})
