// stores/authStore.js
import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", () => {
  const isAuthenticated = ref(false);
  const token = ref("");
  const current_user = ref({});
  const roles = ref([]);

  function initializeAuthFromStorage() {
    if (typeof window !== "undefined") {
      token.value = localStorage.getItem("token") || "";
      current_user.value = JSON.parse(localStorage.getItem("user")) || {};
      roles.value = JSON.parse(localStorage.getItem("roles")) || [];
      isAuthenticated.value =
        localStorage.getItem("is_authenticated") === "true";
      return {
        token: token.value,
        current_user: current_user.value,
        roles: roles.value,
        isAuthenticated: isAuthenticated.value,
      };
    }
    // Return empty values for SSR or fallback
    return {
      token: "",
      current_user: {},
      roles: [],
      isAuthenticated: false,
    };
  }
  function getData() {
    return initializeAuthFromStorage();
  }
  function addToken(newToken) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", newToken);
      localStorage.setItem("is_authenticated", true);
    }
    token.value = newToken;
    isAuthenticated.value = true;
  }

  function setUserData(payload) {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(payload));
    }
    current_user.value = payload;
  }

  function setRoles(userRoles) {
    if (typeof window !== "undefined") {
      localStorage.setItem("roles", JSON.stringify(userRoles));
    }
    roles.value = userRoles;
  }

  function $ResetAuth() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("roles");
      localStorage.removeItem("is_authenticated");
    }
    isAuthenticated.value = false;
    token.value = "";
    current_user.value = {};
    roles.value = [];
  }

  function checkAuth() {
    initializeAuthFromStorage();
  }
  // onMounted(() => {
  //   initializeAuthFromStorage();
  // });

  return {
    isAuthenticated,
    token,
    current_user,
    roles,
    addToken,
    setUserData,
    setRoles,
    $ResetAuth,
    checkAuth,
    getData,
  };
});
