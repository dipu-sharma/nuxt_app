import { useAuthStore } from "~/stores/auth";

export function useAutoLogout() {
  const authStore = useAuthStore();
  let logoutTimer = null;

  const resetTimer = () => {
    if (logoutTimer) clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
      authStore.$ResetAuth();
      navigateTo("/login");
    }, 30 * 60 * 1000);
  };

  const startTimer = () => {
    document.addEventListener("mousemove", resetTimer);
    document.addEventListener("keypress", resetTimer);
    resetTimer();
  };

  const stopTimer = () => {
    if (logoutTimer) clearTimeout(logoutTimer);
    document.removeEventListener("mousemove", resetTimer);
    document.removeEventListener("keypress", resetTimer);
  };

  return { startTimer, stopTimer };
}
