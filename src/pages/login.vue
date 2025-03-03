<template>
	<div class="fill-height" fluid>
		<div class="grid grid-cols-3 gap-4 place-items-center">
			<div></div>
			<div class="mt-10 details-field">
				<div class="w-full max-w-xl px-6 py-6 mt-10 bg-white shadow-lg rounded-md">
					<div>
						<h2 class="mt-6 text-center text-3xl font-bold text-gray-900">Sign-In</h2>
					</div>

					<form class="mt-8 space-y-6" @submit.prevent="handleLogin">
						<div class="rounded-md shadow-sm">
							<div>
								<label for="email" class="sr-only">Email address</label>
								<input
									id="username"
									name="username"
									type="email"
									required
									class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
									placeholder="Email address"
									v-model="loginform.username"
								/>
							</div>

							<div class="mt-4 relative">
								<label for="password" class="sr-only">Password</label>
								<input
									:type="showPassword ? 'text' : 'password'"
									id="password"
									name="password"
									required
									class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
									placeholder="Password"
									v-model="loginform.password"
								/>
								<span
									@click="togglePasswordVisibility"
									class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
								>
									<i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
								</span>
							</div>
						</div>

						<div class="flex items-center justify-between">
							<div class="flex items-center">
								<input
									id="is_remember"
									name="is_remember"
									type="checkbox"
									class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
									v-model="loginform.is_remember"
								/>
								<label for="is_remember" class="ml-2 block text-sm text-gray-900"
									>Remember me</label
								>
							</div>

							<div class="text-sm">
								<a href="#" class="font-medium text-indigo-600 hover:text-indigo-500"
									>Forgot your password?</a
								>
							</div>
						</div>
						<!-- <Captcha @onSuccess="handleCaptchaSuccess" /> -->
						<div>
							<button
								type="submit"
								class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							>
								Sign in
							</button>
						</div>
						<div class="mt-4 text-center">
							<p class="text-sm text-gray-600">
								Don't have an account?
								<a href="/register" class="font-medium text-indigo-600 hover:text-indigo-500"
									>Register here</a
								>
							</p>
						</div>
					</form>
				</div>
			</div>
			<div></div>
		</div>
	</div>
</template>

<script setup>
definePageMeta({
	title: 'Login',
	description: 'Learn more about our company',
	layout: 'default',
	role: ['admin', 'user', 'vendor'],
})
import { useAuthStore } from '~/stores/auth'
// import authAPI from "@/utils/api/autheAPI";
import { toast } from 'vue3-toastify'
import { onMounted } from 'vue'

const authStore = useAuthStore()

const loginform = ref({
	username: '',
	password: '',
})
const UserType = {
	SUPERADMIN: 'superadmin',
	ADMIN: 'admin',
	VENDOR: 'vendor',
	USER: 'user',
}
const showPassword = ref(false)
const captchaToken = ref(null)

const handleCaptchaSuccess = (token) => {
	console.log('Captcha solved, token:', token)
	captchaToken.value = token
}

const submitForm = () => {
	if (captchaToken.value) {
		console.log('Form submitted with captcha token:', captchaToken.value)
		// Send captchaToken.value to your server for verification
	} else {
		console.error('Please solve the CAPTCHA first.')
	}
}
const togglePasswordVisibility = () => {
	showPassword.value = !showPassword.value
}

const handleLogin = () => {
	const staticToken = 'staticToken123'
	const staticUser = {
		id: 1,
		name: 'John Doe',
		email: 'johndoe@example.com',
		user_type: UserType.ADMIN,
	}

	// Store token and user data
	authStore.addToken(staticToken)
	authStore.setUserData(staticUser)
	authStore.setRoles(staticUser.user_type)

	// Notify user of successful login
	toast.success('Logged in Successfully', {
		position: 'top-right',
		autoClose: 3000,
	})

	// Redirect based on role
	redirectToRole(staticUser.user_type)
}
onMounted(() => {
	if (import.meta.client) {
		const storedUser = JSON.parse(localStorage.getItem('user'))
		if (storedUser && storedUser.user_type) {
			redirectToRole(storedUser.user_type)
		}
	}
})

const redirectToRole = (userType) => {
	switch (userType) {
		case UserType.SUPERADMIN:
		case UserType.ADMIN:
			navigateTo('/admin', { redirectCode: 301 })
			break
		case UserType.VENDOR:
			navigateTo('/vendor', { redirectCode: 301 })
			break
		default:
			navigateTo('/user', { redirectCode: 301 })
			break
	}
}

// watch(authStore?.isAuthenticated, (newValue, oldValue) => {
//   console.log(`Count changed from ${oldValue} to ${newValue}`);
// });
</script>

<style scoped>
/* Import Font Awesome icons */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.details-field {
	width: 25rem !important;
}
</style>
