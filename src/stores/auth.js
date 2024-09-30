// stores/authStore.js

import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", () => {
  // State
  const isAuthenticated = ref(false);
  const token = ref("");
  const current_user = ref({});

  // Actions
  function addToken(newToken) {
    localStorage.setItem("token", newToken);
    token.value = newToken;
    isAuthenticated.value = true;
  }

  function setUserData(payload) {
    localStorage.setItem("user", JSON.stringify(payload));
    current_user.value = payload;
  }

  function setAuthenticated(authStatus) {
    isAuthenticated.value = authStatus;
  }

  function $ResetAuth() {
    isAuthenticated.value = false;
    token.value = "";
    current_user.value = {};
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // Return the state, actions, and any getters
  return {
    isAuthenticated,
    token,
    current_user,
    addToken,
    setUserData,
    setAuthenticated,
    $ResetAuth,
  };
});
