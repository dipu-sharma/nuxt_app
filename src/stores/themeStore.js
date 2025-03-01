// stores/authStore.js
import { defineStore } from "pinia";

export const useThemeStore = defineStore("themeStore", () => {
  const theme = ref("");
  function initializeThemeStorage() {
    if (typeof window !== "undefined") {
      theme.value = localStorage.getItem("theme") || "";
      return {
        theme: theme.value,
      };
    }
    // Return empty values for SSR or fallback
    return {
      theme: "",
    };
  }
  function getData() {
    return initializeThemeStorage();
  }
  function addTheme(newTheme) {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
    theme.value = newTheme;
  }

  function $ResetTheme() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("theme");
    }
    theme.value = "";
  }

  function checkAuth() {
    initializeThemeStorage();
  }

  return {
    theme,
    addTheme,
    $ResetTheme,
    getData,
    checkAuth,
  };
});
