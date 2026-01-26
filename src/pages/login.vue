<template>
	<div class="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
		<div class="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
			<div class="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
				<div>
					<!-- Placeholder for logo -->
					<div class="w-32 mx-auto">
						<svg
							class="w-24 h-24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M12 2L2 7L12 12L22 7L12 2Z"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M2 17L12 22L22 17"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M2 12L12 17L22 12"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
				</div>
				<div class="mt-12 flex flex-col items-center">
					<h1 class="text-2xl xl:text-3xl font-extrabold">Sign in for our app</h1>
					<div class="w-full flex-1 mt-8">
						<div class="flex flex-col items-center">
							<button
								@click="handleGoogleLogin"
								class="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
							>
								<div class="bg-white p-2 rounded-full">
									<svg class="w-4" viewBox="0 0 24 24">
										<path
											d="M20.283 10.356h-8.327v4.348h4.792c-.446 2.193-2.313 3.45-4.792 3.45-2.827 0-5.12-2.308-5.12-5.13s2.293-5.13 5.12-5.13c1.613 0 2.97.593 3.863 1.44l3.43-3.43C17.4 2.55 15.073 1.5 12 1.5 6.486 1.5 2 5.986 2 11.5s4.486 10 10 10c5.79 0 9.802-4.024 9.802-9.833 0-.618-.07-1.22-.197-1.804z"
											fill="#4285F4"
										/>
									</svg>
								</div>
								<span class="ml-4"> Sign in with Google </span>
							</button>

							<button
								@click="handleFacebookLogin"
								class="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5"
							>
								<div class="bg-white p-2 rounded-full">
									<svg class="w-4" viewBox="0 0 24 24">
										<path
											d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2.25 18.25V12H7.5V9.75h2.25V7.9c0-2.22 1.35-3.425 3.34-3.425 1.02 0 1.9.076 2.16.11v2.09h-1.24c-1.08 0-1.29.51-1.29 1.27v1.65H18l-.28 2.25h-2.47v6.25h-3z"
											fill="#1877F2"
										/>
									</svg>
								</div>
								<span class="ml-4"> Sign in with Facebook </span>
							</button>
						</div>

						<div class="my-12 border-b text-center">
							<div
								class="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2"
							>
								Or sign in with e-mail
							</div>
						</div>

						<form class="mx-auto max-w-xs" @submit.prevent="handleLogin">
							<input
								class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
								type="email"
								placeholder="Email"
								v-model="loginform.username"
							/>
							<input
								class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
								:type="showPassword ? 'text' : 'password'"
								placeholder="Password"
								v-model="loginform.password"
							/>
							<button
								type="submit"
								class="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
							>
								<svg
									class="w-6 h-6 -ml-2"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
									<circle cx="8.5" cy="7" r="4" />
									<path d="M20 8v6M23 11h-6" />
								</svg>
								<span class="ml-3"> Sign In </span>
							</button>
							<p class="mt-6 text-xs text-gray-600 text-center">
								<a href="#" class="border-b border-gray-500 border-dotted"> Forgot Password? </a>
							</p>
							<p class="mt-6 text-xs text-gray-600 text-center">
								Don't have an account?
								<a href="/register" class="border-b border-gray-500 border-dotted">
									Register here
								</a>
							</p>
						</form>
					</div>
				</div>
			</div>
			<div class="flex-1 bg-indigo-100 text-center hidden lg:flex">
				<div
					class="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
					style="
						background-image: url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg');
					"
				></div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useThemeStore } from '~/stores/themeStore'
import { useSSO } from '~/composables/useSSO'
definePageMeta({
	title: 'Login',
	description: 'Learn more about our company',
	layout: 'login',
})
const { handleGoogleLogin, handleFacebookLogin } = useSSO()
const useTheme = useThemeStore()
import { useAuthStore } from '~/stores/auth'
import { toast } from 'vue3-toastify'
import { onMounted } from 'vue'

const authStore = useAuthStore()

const loginform = ref({
	username: 'admin@yopmail.com',
	password: 'Dipu1234@',
})
const UserType = {
	ADMIN: 'ADMIN',
	BUSINESS_OWNER: 'BUSINESS_OWNER',
	BUSINESS_MEMBER: 'BUSINESS_MEMBER',
	USER: 'USER',
}
const showPassword = ref(false)
const captchaToken = ref(null)

const handleCaptchaSuccess = (token) => {
	captchaToken.value = token
}

const submitForm = () => {
	if (captchaToken.value) {
		// Send captchaToken.value to your server for verification
	} else {
		console.error('Please solve the CAPTCHA first.')
	}
}
const togglePasswordVisibility = () => {
	showPassword.value = !showPassword.value
}

const handleLogin = async () => {
	const { login_user, get_current_user } = authApi()
	const response = await login_user(loginform.value)
	authStore.setLoginData(response)
	const response_user = await get_current_user()

	authStore.addUser(response_user.data)

	if (response?.data?.access_token) {
		toast.success('Logged in Successfully', {
			position: 'top-right',
			autoClose: 3000,
			limit: 1,
		})
		redirectToRole(response?.data?.role)
		// redirectToRole('Admin')
	} else {
		toast.error('Invalid Credentials', {
			position: 'top-right',
			autoClose: 3000,
			limit: 1,
		})
	}
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
		case UserType.ADMIN:
			navigateTo('/admin', { redirectCode: 301 })
			break
		case UserType.BUSINESS_OWNER:
			navigateTo('/business', { redirectCode: 301 })
			break
		case UserType.BUSINESS_MEMBER:
			navigateTo('/business', { redirectCode: 301 })
			break
		default:
			navigateTo('/user', { redirectCode: 301 })
			break
	}
}
</script>

<style scoped>
/* You can add additional styles here if needed */
</style>
