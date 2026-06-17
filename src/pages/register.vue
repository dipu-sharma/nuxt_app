<template>
	<div class="flex justify-center items-center">
		<div class="glass-card-light flex flex-col lg:flex-row w-full overflow-hidden shadow-xl border border-slate-200 animate-fade-in bg-white/70 backdrop-blur-xl rounded-3xl">
			<!-- Left Side: Illustration & Branding -->
			<div class="hidden lg:flex lg:w-1/2 bg-slate-50 relative overflow-hidden flex-col justify-center items-center p-16 border-r border-slate-100">
				<!-- Decorative Elements -->
				<div class="absolute top-1/4 -left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px]"></div>
				<div class="absolute bottom-1/4 -right-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px]"></div>
				
				<div class="relative z-10 text-center animate-float">
					<img 
						src="https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg" 
						alt="Register illustration"
						class="max-w-md drop-shadow-xl scale-x-[-1]"
					/>
					<div class="mt-12 space-y-4">
						<h2 class="text-3xl font-bold text-slate-900">Join Our Community</h2>
						<p class="text-slate-500 max-w-sm mx-auto">
							Create an account today and unlock the full potential of our management platform.
						</p>
					</div>
				</div>

				<div class="absolute bottom-12 left-0 right-0 flex justify-center gap-4 px-8">
					<div class="bg-white/80 backdrop-blur py-2 px-4 rounded-full text-xs text-slate-600 border border-slate-200 shadow-sm">✨ Smart Workflow</div>
					<div class="bg-white/80 backdrop-blur py-2 px-4 rounded-full text-xs text-slate-600 border border-slate-200 shadow-sm">☁️ Cloud Sync</div>
				</div>
			</div>

			<!-- Right Side: Form -->
			<div class="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
				<div class="animate-slide-down">
					<h1 class="text-3xl xl:text-4xl font-extrabold text-slate-900 text-center lg:text-left">Create Account</h1>
					<p class="text-slate-500 text-center lg:text-left mt-2">Get started with your free account</p>
				</div>

				<div class="w-full mt-10">
					<!-- Form -->
					<form class="space-y-4 animate-slide-up" style="animation-delay: 0.1s;" @submit.prevent="handleRegister">
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div class="relative group">
								<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
									<Icon name="mdi:email-outline" class="w-5 h-5" />
								</div>
								<input
									class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
									type="email"
									placeholder="Email"
									v-model="payload.email_id"
								/>
							</div>

							<div class="relative group">
								<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
									<Icon name="mdi:phone-outline" class="w-5 h-5" />
								</div>
								<input
									class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
									type="text"
									placeholder="Mobile No"
									v-model="payload.mobile_no"
								/>
							</div>
						</div>

						<div class="relative group">
							<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
								<Icon name="mdi:lock-outline" class="w-5 h-5" />
							</div>
							<input
								class="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
								:type="showPassword ? 'text' : 'password'"
								placeholder="Password"
								v-model="payload.password"
							/>
							<button 
								type="button"
								@click="togglePasswordVisibility"
								class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
							>
								<Icon :name="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="w-5 h-5" />
							</button>
						</div>

						<div class="relative group">
							<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
								<Icon name="mdi:lock-check-outline" class="w-5 h-5" />
							</div>
							<input
								class="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
								:type="showConfirmPassword ? 'text' : 'password'"
								placeholder="Confirm Password"
								v-model="payload.confirm_password"
							/>
							<button 
								type="button"
								@click="toggleConfirmPasswordVisibility"
								class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
							>
								<Icon :name="showConfirmPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="w-5 h-5" />
							</button>
						</div>

						<div class="relative group">
							<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
								<Icon name="mdi:account-outline" class="w-5 h-5" />
							</div>
							<select
								class="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm appearance-none cursor-pointer"
								v-model="payload.user_type"
							>
								<option value="" disabled>Select User Type</option>
								<option v-for="userType in user_type_list" :key="userType.value" :value="userType.value">
									{{ userType.label }}
								</option>
							</select>
							<div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
								<Icon name="mdi:chevron-down" class="w-5 h-5" />
							</div>
						</div>

						<div class="flex items-center text-xs text-slate-500 py-2">
							<input type="checkbox" class="mr-2 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" required />
							<span>I agree to the <a href="#" class="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" class="text-indigo-600 hover:underline">Privacy Policy</a></span>
						</div>

						<button
							type="submit"
							:disabled="loading"
							class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-200 transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
						>
							<svg v-if="loading" class="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
							</svg>
							<span>{{ loading ? 'Creating Account...' : 'Sign Up' }}</span>
							<Icon v-if="!loading" name="mdi:account-plus-outline" class="w-5 h-5" />
						</button>

						<p class="text-center text-slate-600 mt-8">
							Already have an account?
							<a href="/login" class="text-indigo-600 font-bold hover:underline">
								Sign In
							</a>
						</p>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

definePageMeta({
	title: 'Register',
	description: 'Create an account',
	layout: 'login',
})

// Backend expects these exact values — confirmed via Swagger
const user_type_list = ref([
	{ label: 'Customer / User', value: 'USER' },
	{ label: 'Business Owner', value: 'BUSINESS_OWNER' },
	{ label: 'Admin', value: 'ADMIN' },
])

const payload = ref({
	email_id: '',
	mobile_no: '',
	password: '',
	confirm_password: '',
	user_type: '',
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)

const togglePasswordVisibility = () => {
	showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
	showConfirmPassword.value = !showConfirmPassword.value
}

const handleRegister = async () => {
	// — Client-side validation —
	if (!payload.value.email_id) {
		return toast.error('Email is required')
	}
	if (!payload.value.mobile_no) {
		return toast.error('Mobile number is required')
	}
	if (!payload.value.password) {
		return toast.error('Password is required')
	}
	if (payload.value.password !== payload.value.confirm_password) {
		return toast.error('Passwords do not match')
	}
	if (!payload.value.user_type) {
		return toast.error('Please select a user type')
	}

	loading.value = true
	try {
		const { register } = useAuth()
		await register(payload.value)
		toast.success('Account created! Please check your email to verify your account.')
		// Redirect to verification page or login
		navigateTo('/login')
	} catch (err) {
		const msg =
			err?.data?.message ||
			err?.data?.detail ||
			err?.message ||
			'Registration failed. Please try again.'
		toast.error(msg)
	} finally {
		loading.value = false
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
