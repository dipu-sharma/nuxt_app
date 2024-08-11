// stores/authStore.js

import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useNavStore = defineStore('navdata', () => {
  // State
  const isSideMenuOpen = ref(false);

  // Actions
  function toggleSideMenu() {
    console.log("Toggle Side menu__________________________");
    
    isSideMenuOpen.value = !isSideMenuOpen.value;
  }
  function $reset() {
    isSideMenuOpen.value = false
  }
  // Return the state, actions, and any getters
  return { isSideMenuOpen, toggleSideMenu, $reset };
});
