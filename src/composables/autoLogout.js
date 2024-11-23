import { useAuthStore } from "~/stores/auth";

export function useAutoLogout() {
  const authStore = useAuthStore();
  const logoutTimer = ref(null);
  const countdownTimer = ref(null);
  const remainingTime = ref(30 * 60); // 30 minutes in seconds

  // Reset Timer Function
  const resetTimer = () => {
    // Clear existing timers
    if (logoutTimer.value) clearTimeout(logoutTimer.value);
    if (countdownTimer.value) clearInterval(countdownTimer.value);

    // Reset remaining time and start countdown
    remainingTime.value = 30 * 60; // Reset to 30 minutes
    countdownTimer.value = setInterval(() => {
      remainingTime.value -= 1;
      if (remainingTime.value <= 0) {
        clearInterval(countdownTimer.value);
      }
    }, 1000);

    // Set logout timer
    logoutTimer.value = setTimeout(() => {
      authStore.$ResetAuth();
      navigateTo("/login"); // Redirect to login
    }, 30 * 60 * 1000); // 30 minutes
  };

  // Start Listening for User Activity
  const startTimer = () => {
    resetTimer(); // Initialize timer
  };

  // Stop Listening and Clear Timers
  const stopTimer = () => {
    if (logoutTimer.value) clearTimeout(logoutTimer.value);
    if (countdownTimer.value) clearInterval(countdownTimer.value);
    remainingTime.value = 30 * 60; // Reset time
  };

  return { startTimer, stopTimer, remainingTime };
}
