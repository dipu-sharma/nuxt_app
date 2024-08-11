// stores/authStore.js

import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useAuthStore = defineStore('auth', () => {
  // State
  const isAuthenticated = ref(false);

  // Actions
  function setAuthenticated(auth) {
    console.log('Authenticate Store called_______________', auth);
    isAuthenticated.value = auth;
  }

  function $reset() {
    isAuthenticated.value = false;
  }
  // Return the state, actions, and any getters
  return { isAuthenticated, setAuthenticated, $reset };
});
