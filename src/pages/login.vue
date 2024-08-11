<template>
  <div class="flex min-h-screen items-center justify-center bg-white shadow-lg" >
    <div class="w-full max-w-md space-y-8 p-8 bg-white shadow-lg rounded-md">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">Sign in to your account</h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input id="email" name="email" type="email" required
              class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Email address" v-model="loginform.email" />
          </div>
          <div class="mt-4">
            <label for="password" class="sr-only">Password</label>
            <input id="password" name="password" type="password" required
              class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Password" v-model="loginform.password" />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="is_remember" name="is_remember" type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" v-model="loginform.is_remember" />
            <label for="is_remember" class="ml-2 block text-sm text-gray-900">Remember me</label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
          </div>
        </div>

        <div>
          <button type="submit"
            class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
// Create a store instance
const authStore = useAuthStore();

const loginform = ref({
  email: '',
  password: '',
  is_remember: false // Default value for checkbox should be boolean
})

const handleLogin = () => {
  console.log("Login Form clicked________________________", authStore.isAuthenticated);
  alert(`Login with email: ${loginform.value.email}`); 
  authStore.setAuthenticated(true)
  return navigateTo('/user', { redirectCode: 301 })
}
</script>
