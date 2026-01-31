import { useAuthStore } from "~/stores/auth";

const LOGOUT_TIME = 30 * 60 * 1000; // 30 minutes
const MODAL_TIME = 1 * 60 * 1000; // 1 minute

export function useAutoLogout() {
  const authStore = useAuthStore();
  const modalTimer = ref(null);
  const countdownTimer = ref(null);
  const remainingTime = ref(LOGOUT_TIME / 1000); 
  const isModalVisible = ref(false);

  // Reset Timer Function
  const resetTimer = () => {
    // Clear existing timers
    remainingTime.value = LOGOUT_TIME / 1000;
    isModalVisible.value = false;
    if (modalTimer.value) clearTimeout(modalTimer.value);
    if (countdownTimer.value) clearInterval(countdownTimer.value);

    if (import.meta.client) {
        countdownTimer.value = setInterval(() => {
            remainingTime.value -= 1;
            if (remainingTime.value <= 0) {
                clearInterval(countdownTimer.value);
                authStore.doLogout();
                navigateTo("/login");
            }
        }, 1000);
    }

    // Set modal timer
    modalTimer.value = setTimeout(() => {
      isModalVisible.value = true;
    }, LOGOUT_TIME - MODAL_TIME);
  };

  // Start Listening for User Activity
  const startTimer = () => {
    resetTimer();
  };

  // Stop Listening and Clear Timers
  const stopTimer = () => {
    if (modalTimer.value) clearTimeout(modalTimer.value);
    if (countdownTimer.value) clearInterval(countdownTimer.value);
    remainingTime.value = LOGOUT_TIME / 1000;
    isModalVisible.value = false;
  };

  return { startTimer, stopTimer, remainingTime, isModalVisible, resetTimer };
}
