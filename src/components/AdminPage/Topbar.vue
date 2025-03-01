<template>
  <div>
    <header
      :class="['z-10 py-4 bg-white shadow-md', { 'dark:bg-black': dark }]"
    >
      <div
        class="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300"
      >
        <!-- Mobile hamburger -->
        <button
          class="z-10 p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
          @click.self="navStore.toggleSideMenu"
          aria-label="Menu"
        >
          <svg
            class="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
        <!-- Search input -->
        <div class="flex justify-center flex-1 lg:mr-32">
          <div
            class="relative w-full max-w-xl mr-7 focus-within:text-purple-500"
          >
            <!-- <div class="absolute inset-y-0 flex items-center pl-2">
                            <svg class="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clip-rule="evenodd"></path>
                            </svg>
                        </div> -->
            <!-- <input
                            class="w-full pl-8 pr-2 py-2 text-sm text-black placeholder-white bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-white focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
                            type="text" placeholder="Search for projects" aria-label="Search" /> -->
          </div>
        </div>
        <ul class="flex items-center flex-shrink-0 space-x-6">
          <!-- Theme toggler -->
          <li class="flex">
            <button
              class="rounded-md focus:outline-none focus:shadow-outline-purple"
              @click="toggleTheme"
              aria-label="Toggle color mode"
            >
              <template v-if="!dark">
                <svg
                  class="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                  ></path>
                </svg>
              </template>
              <template v-else>
                <svg
                  class="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </template>
            </button>
          </li>
          <!-- Notifications menu -->
          <li class="relative">
            <button
              class="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
              @click="toggleNotificationsMenu"
              @keydown.escape="closeNotificationsMenu"
              aria-label="Notifications"
              aria-haspopup="true"
            >
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
                ></path>
              </svg>
              <!-- Notification badge -->
              <span
                aria-hidden="true"
                class="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"
              ></span>
            </button>
            <template v-if="isNotificationsMenuOpen">
              <ul
                @click.away="closeNotificationsMenu"
                @keydown.escape="closeNotificationsMenu"
                class="absolute right-0 z-10 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:text-gray-300 dark:border-gray-700 dark:bg-gray-700"
              >
                <li class="flex">
                  <a
                    class="inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    href="#"
                  >
                    <span>Messages</span>
                    <span
                      class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-600 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-600"
                    >
                      13
                    </span>
                  </a>
                </li>
                <li class="flex">
                  <a
                    class="inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    href="#"
                  >
                    <span>Sales</span>
                    <span
                      class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-600 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-600"
                    >
                      2
                    </span>
                  </a>
                </li>
                <li class="flex">
                  <a
                    class="inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    href="#"
                  >
                    <span>Alerts</span>
                  </a>
                </li>
              </ul>
            </template>
          </li>
          <!-- Profile menu -->
          <li class="relative">
            <button
              class="align-middle rounded-full focus:shadow-outline-purple focus:outline-none"
              @click="toggleProfileMenu"
              @keydown.escape="closeProfileMenu"
              aria-label="Account"
              aria-haspopup="true"
            >
              <img
                class="object-cover w-8 h-8 rounded-full"
                src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=128&h=128&q=80"
                alt=""
                aria-hidden="true"
              />
            </button>
            <template v-if="isProfileMenuOpen">
              <ul
                @click.away="closeProfileMenu"
                @keydown.escape="closeProfileMenu"
                class="absolute right-0 z-10 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700"
                aria-label="submenu"
              >
                <li class="flex">
                  <a
                    class="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    href="/admin/profile"
                  >
                    <svg
                      class="w-4 h-4 mr-3"
                      aria-hidden="true"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      ></path>
                    </svg>
                    <span>Profile</span>
                  </a>
                </li>
                <li class="flex">
                  <a
                    @click="logout"
                    class="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  >
                    <span>Log out</span>
                  </a>
                </li>
              </ul>
            </template>
          </li>
        </ul>
      </div>
    </header>
    <AdminPageMobileSidebar />
  </div>
</template>

<script setup>
import { toast } from "vue3-toastify";
import { useNavStore } from "~/stores/navStore";
import { useAuthStore } from "~/stores/auth";
import { useThemeStore } from "~/stores/themeStore";

const authStore = useAuthStore();
const navStore = useNavStore();
const isNotificationsMenuOpen = ref(false);
const isProfileMenuOpen = ref(false);
const dark = ref(true);

const themeStore = useThemeStore();

const toggleTheme = () => {
  dark.value = !dark.value;
  if (dark.value) {
    document.body.classList.add("dark");
    document.body.classList.remove("light");
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", "dark");
      themeStore.addTheme("dark");
    }
  } else {
    document.body.classList.add("light");
    document.body.classList.remove("dark");
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", "light");
      themeStore.addTheme("light");
    }
  }
};

// Initialize the theme based on user's preference stored in localStorage
onMounted(() => {
  if (typeof window !== "undefined") {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      dark.value = true;
      document.body.classList.add("dark");
      document.body.classList.remove("light");
      themeStore.addTheme("dark");
    } else {
      dark.value = false;
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      themeStore.addTheme("light");
    }
  }
});

// Notifications menu functions
const toggleNotificationsMenu = () => {
  isNotificationsMenuOpen.value = !isNotificationsMenuOpen.value;
};

const closeNotificationsMenu = () => {
  isNotificationsMenuOpen.value = false;
};

// Profile menu functions
const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

const closeProfileMenu = () => {
  isProfileMenuOpen.value = false;
};
const logout = () => {
  try {
    authStore.$ResetAuth();
    toast.error("Logout Successfully", {
      position: "top-right",
      autoClose: 3000,
    });
    // Redirect to login page
    navigateTo("/login", { redirectCode: 301 });
  } catch (error) {
    console.error("An error occurred during logout:", error);
  }
};
</script>

<style>
/* Add any custom styles here if needed */
</style>
