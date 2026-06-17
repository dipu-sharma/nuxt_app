<template>
	<div class="flex justify-center items-center">
		<div class="glass-card-light flex flex-col lg:flex-row w-full overflow-hidden shadow-xl border border-slate-200 animate-fade-in bg-white/70 backdrop-blur-xl rounded-3xl">
			<!-- Left Side: Form -->
			<div class="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
				<div class="animate-slide-down">
					<!-- Logo -->
					<div class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mx-auto lg:mx-0 mb-8">
						<svg
							class="w-10 h-10 text-white"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
							<path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
							<path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</div>
					<h1 class="text-3xl xl:text-4xl font-extrabold text-slate-900 text-center lg:text-left">Welcome Back</h1>
					<p class="text-slate-500 text-center lg:text-left mt-2">Sign in to continue your journey</p>
				</div>

				<div class="w-full mt-10">
					<!-- SSO Buttons -->
					<div class="flex flex-col sm:flex-row gap-4 animate-slide-up" style="animation-delay: 0.1s;">
						<button
							@click="handleGoogleLogin"
							class="flex-1 border border-slate-200 py-3 px-4 rounded-xl text-slate-700 font-medium flex items-center justify-center gap-3 hover:bg-slate-50 transition-all duration-300"
						>
							<svg class="w-4 h-4" viewBox="0 0 24 24">
								<path d="M20.283 10.356h-8.327v4.348h4.792c-.446 2.193-2.313 3.45-4.792 3.45-2.827 0-5.12-2.308-5.12-5.13s2.293-5.13 5.12-5.13c1.613 0 2.97.593 3.863 1.44l3.43-3.43C17.4 2.55 15.073 1.5 12 1.5 6.486 1.5 2 5.986 2 11.5s4.486 10 10 10c5.79 0 9.802-4.024 9.802-9.833 0-.618-.07-1.22-.197-1.804z" fill="#4285F4" />
							</svg>
							<span>Google</span>
						</button>

						<button
							@click="handleFacebookLogin"
							class="flex-1 border border-slate-200 py-3 px-4 rounded-xl text-slate-700 font-medium flex items-center justify-center gap-3 hover:bg-slate-50 transition-all duration-300"
						>
							<svg class="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
								<path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2.25 18.25V12H7.5V9.75h2.25V7.9c0-2.22 1.35-3.425 3.34-3.425 1.02 0 1.9.076 2.16.11v2.09h-1.24c-1.08 0-1.29.51-1.29 1.27v1.65H18l-.28 2.25h-2.47v6.25h-3z" />
							</svg>
							<span>Facebook</span>
						</button>
					</div>

					<!-- Divider -->
					<div class="relative my-10 animate-fade-in" style="animation-delay: 0.2s;">
						<div class="absolute inset-0 flex items-center">
							<div class="w-full border-t border-slate-100"></div>
						</div>
						<div class="relative flex justify-center text-sm">
							<span class="px-4 text-slate-400 bg-white">Or continue with email</span>
						</div>
					</div>

					<!-- Form -->
					<form class="space-y-5 animate-slide-up" style="animation-delay: 0.3s;" @submit.prevent="handleLogin">
						<div class="relative group">
							<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
								<Icon name="mdi:email-outline" class="w-5 h-5" />
							</div>
							<input
								class="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
								type="email"
								placeholder="Email address"
								v-model="loginform.username"
							/>
						</div>

						<div class="relative group">
							<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
								<Icon name="mdi:lock-outline" class="w-5 h-5" />
							</div>
							<input
								class="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
								:type="showPassword ? 'text' : 'password'"
								placeholder="Password"
								v-model="loginform.password"
							/>
							<button 
								type="button"
								@click="togglePasswordVisibility"
								class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
							>
								<Icon :name="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="w-5 h-5" />
							</button>
						</div>

						<div class="flex items-center justify-between text-xs sm:text-sm">
							<label class="flex items-center text-slate-600 cursor-pointer">
								<input type="checkbox" class="mr-2 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
								Remember me
							</label>
							<a href="#" class="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">Forgot Password?</a>
						</div>

						<button
							type="submit"
							class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-200 transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2"
						>
							<span>Sign In</span>
							<Icon name="mdi:arrow-right" class="w-5 h-5" />
						</button>

						<p class="text-center text-slate-600 mt-8">
							Don't have an account?
							<a href="/register" class="text-indigo-600 font-bold hover:underline">
								Create an account
							</a>
						</p>
					</form>
				</div>
			</div>

			<!-- Right Side: Illustration & Branding -->
			<div class="hidden lg:flex lg:w-1/2 bg-slate-50 relative overflow-hidden flex-col justify-center items-center p-16 border-l border-slate-100">
				<!-- Decorative Elements -->
				<div class="absolute top-1/4 -right-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px]"></div>
				<div class="absolute bottom-1/4 -left-20 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px]"></div>
				
				<div class="relative z-10 text-center animate-float">
					<img 
						src="https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg" 
						alt="Login illustration"
						class="max-w-md drop-shadow-xl"
					/>
					<div class="mt-12 space-y-4">
						<h2 class="text-3xl font-bold text-slate-900">Advanced Management</h2>
						<p class="text-slate-500 max-w-sm mx-auto">
							Experience the next generation of business management with our modern, intuitive platform.
						</p>
					</div>
				</div>

				<div class="absolute bottom-12 left-0 right-0 flex justify-center gap-4 px-8">
					<div class="bg-white/80 backdrop-blur py-2 px-4 rounded-full text-xs text-slate-600 border border-slate-200 shadow-sm">🚀 High Performance</div>
					<div class="bg-white/80 backdrop-blur py-2 px-4 rounded-full text-xs text-slate-600 border border-slate-200 shadow-sm">🔒 Secure Data</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useThemeStore } from '~/stores/themeStore'
import { useSSO } from '~/composables/useSSO'
import { useAuthStore } from '~/stores/auth'
import { toast } from 'vue3-toastify'
import { onMounted, ref } from 'vue'

definePageMeta({
	title: 'Login',
	description: 'Sign in to your account',
	layout: 'login',
})

const { handleGoogleLogin, handleFacebookLogin } = useSSO()
const useTheme = useThemeStore()
const authStore = useAuthStore()

const loginform = ref({
	username: '',
	password: '',
})

const UserType = {
	ADMIN: 'ADMIN',
	BUSINESS_OWNER: 'BUSINESS_OWNER',
	BUSINESS_MEMBER: 'BUSINESS_MEMBER',
	USER: 'USER',
}

const showPassword = ref(false)

const togglePasswordVisibility = () => {
	showPassword.value = !showPassword.value
}

const handleLogin = async () => {
	try {
		const { login, getMe } = useAuth()
		const response = await login(loginform.value)

		if (response?.data?.access_token) {
			// 1. Save token + role to cookie FIRST so getMe() picks it up
			authStore.setLoginData(response)

			// 2. Now fetch the full user profile (token is in cookie now)
			try {
				const userResponse = await getMe()
				// API wraps response: { data: { ... }, success: true }
				authStore.addUser(userResponse?.data || userResponse)
			} catch {
				// Non-critical — user info can be loaded later
			}

			toast.success('Logged in Successfully', {
				position: 'top-right',
				autoClose: 3000,
			})
			redirectToRole(response?.data?.role)
		} else {
			toast.error('Invalid Credentials', {
				position: 'top-right',
				autoClose: 3000,
			})
		}
	} catch (error) {
		toast.error('Something went wrong. Please try again.', {
			position: 'top-right',
			autoClose: 3000,
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
			navigateTo('/admin')
			break
		case UserType.BUSINESS_OWNER:
			navigateTo('/business')
			break
		case UserType.BUSINESS_MEMBER:
			navigateTo('/business')
			break
		default:
			navigateTo('/user')
			break
	}
}
</script>

<style scoped>
.animate-fade-in {
	animation: fadeIn 0.8s ease-out forwards;
}

.animate-slide-up {
	opacity: 0;
	animation: slideUp 0.8s ease-out forwards;
}

.animate-slide-down {
	opacity: 0;
	animation: slideDown 0.8s ease-out forwards;
}

.animate-float {
	animation: float 6s ease-in-out infinite;
}

@keyframes fadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}

@keyframes slideUp {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes slideDown {
	from {
		opacity: 0;
		transform: translateY(-30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes float {
	0%, 100% {
		transform: translateY(0px);
	}
	50% {
		transform: translateY(-10px);
	}
}
</style>
