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
					<h1 class="text-2xl xl:text-3xl font-extrabold">Sign up for our app</h1>
					<div class="w-full flex-1 mt-8">
						<form class="mx-auto max-w-xs" @submit.prevent="handleRegister">
							<input
								class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
								type="email"
								placeholder="Email"
								v-model="payload.email_id"
							/>
							<input
								class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
								type="text"
								placeholder="Mobile No"
								v-model="payload.mobile_no"
							/>
							<input
								class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
								:type="showPassword ? 'text' : 'password'"
								placeholder="Password"
								v-model="payload.password"
							/>
							<input
								class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
								:type="showConfirmPassword ? 'text' : 'password'"
								placeholder="Confirm Password"
								v-model="payload.confirm_password"
							/>
							<select
								class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
								v-model="payload.user_type"
							>
								<option value="" disabled>Select User Type</option>
								<option v-for="userType in user_type_list" :key="userType" :value="userType">
									{{ userType }}
								</option>
							</select>
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
								<span class="ml-3"> Sign Up </span>
							</button>
							<p class="mt-6 text-xs text-gray-600 text-center">
								Already have an account?
								<a href="/login" class="border-b border-gray-500 border-dotted">
									Sign In
								</a>
							</p>
						</form>
					</div>
				</div>
			</div>
			<div class="flex-1 bg-indigo-100 text-center hidden lg:flex">
				<div
					class="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
					style="background-image: url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg');"
				></div>
			</div>
		</div>
	</div>
</template>

<script setup>
definePageMeta({
	title: 'Register',
	description: 'Create an account',
	layout: 'login',
})
const user_type_list = ref(['Admin', 'User', 'Business'])

const payload = ref({
	email_id: '',
	mobile_no: '',
	password: '',
	confirm_password: '',
	user_type: '',
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const togglePasswordVisibility = () => {
	showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
	showConfirmPassword.value = !showConfirmPassword.value
}

const handleRegister = () => {
	// Handle form submission logic here
}
</script>

<style scoped>
/* You can add additional styles here if needed */
</style>
