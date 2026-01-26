import { useAuthStore } from "~/stores/auth";

export function useAutoLogout() {
  const authStore = useAuthStore();
  const logoutTimer = ref(null);
  const countdownTimer = ref(null);
  const remainingTime = ref(30 * 60); // 30 minutes in seconds

  // Reset Timer Function
  const resetTimer = () => {
    // Clear existing timers
    remainingTime.value = 30 * 60;
    if (logoutTimer.value) clearTimeout(logoutTimer.value);
    if (countdownTimer.value) clearInterval(countdownTimer.value);
    if (import.meta.client) {
        countdownTimer.value = setInterval(() => {
            remainingTime.value -= 1;
            if (remainingTime.value <= 0) {
                clearInterval(countdownTimer.value);
            }
        }, 1000);
    }

    // Set logout timer
    logoutTimer.value = setTimeout(() => {
      authStore.doLogout()
      navigateTo("/login");
    }, 30 * 60 * 1000);
  };

  // Start Listening for User Activity
  const startTimer = () => {
    resetTimer();
  };

  // Stop Listening and Clear Timers
  const stopTimer = () => {
    if (logoutTimer.value) clearTimeout(logoutTimer.value);
    if (countdownTimer.value) clearInterval(countdownTimer.value);
    remainingTime.value = 30 * 60;
  };

  return { startTimer, stopTimer, remainingTime };
}
