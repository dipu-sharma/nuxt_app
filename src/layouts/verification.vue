<template>
	<div class="verification-container">
		<h1 class="neon-text">Account Verification</h1>

		<div v-if="isLoading" class="neon-loader-container">
			<div class="neon-loader"></div>
			<p class="loading-text">Verifying your account...</p>
		</div>

		<div v-else class="verification-result">
			<div v-if="isVerified" class="success-message">
				<i class="fas fa-check-circle success-icon"></i>
				<p>Your account has been successfully verified!</p>
				<button @click="redirectToDashboard" class="neon-button">Go to Dashboard</button>
			</div>

			<div v-else class="error-message">
				<i class="fas fa-times-circle error-icon"></i>
				<p>{{ errorMessage || 'Verification failed. Please try again.' }}</p>
				<button @click="retryVerification" class="neon-button">Retry Verification</button>
			</div>
		</div>
	</div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const verificationToken = route.query.token

// State
const isLoading = ref(true)
const isVerified = ref(false)
const errorMessage = ref('')

// Verify token function
const verifyToken = async () => {
	try {
		isLoading.value = true

		// Call your verification API
		const { data, error } = await useFetch('/api/verify', {
			method: 'POST',
			body: { token: verificationToken },
		})

		if (error.value) {
			throw new Error(error.value.data?.message || 'Verification failed')
		}

		isVerified.value = true
		errorMessage.value = ''
	} catch (err) {
		isVerified.value = false
		errorMessage.value = err.message
	} finally {
		isLoading.value = false
	}
}

// Initial verification on page load
onMounted(() => {
	if (!verificationToken) {
		errorMessage.value = 'No verification token provided'
		isLoading.value = false
		return
	}

	verifyToken()
})

// Helper functions
const redirectToDashboard = () => {
	router.push('/dashboard')
}

const retryVerification = () => {
	isLoading.value = true
	verifyToken()
}
</script>

<style scoped>
.verification-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	background-color: #0a0a1a;
	color: white;
	padding: 2rem;
	text-align: center;
}

.neon-text {
	font-size: 2.5rem;
	margin-bottom: 2rem;
	color: #fff;
	text-shadow: 0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #0ff;
	animation: flicker 1.5s infinite alternate;
}

.neon-loader-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.5rem;
}

.neon-loader {
	width: 80px;
	height: 80px;
	border: 5px solid #0ff;
	border-radius: 50%;
	position: relative;
	box-shadow: 0 0 10px #0ff, 0 0 20px #0ff, inset 0 0 10px #0ff;
	animation: spin 1.5s linear infinite;
}

.neon-loader::before {
	content: '';
	position: absolute;
	top: -15px;
	left: 50%;
	transform: translateX(-50%);
	width: 20px;
	height: 20px;
	background: #0ff;
	border-radius: 50%;
	box-shadow: 0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff;
}

.loading-text {
	font-size: 1.2rem;
	color: #0ff;
	text-shadow: 0 0 5px #0ff;
}

.verification-result {
	max-width: 500px;
	margin: 0 auto;
}

.success-message,
.error-message {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
}

.success-icon {
	font-size: 4rem;
	color: #0f0;
	text-shadow: 0 0 10px #0f0;
}

.error-icon {
	font-size: 4rem;
	color: #f00;
	text-shadow: 0 0 10px #f00;
}

.neon-button {
	background: transparent;
	color: #0ff;
	border: 2px solid #0ff;
	padding: 0.75rem 1.5rem;
	font-size: 1rem;
	border-radius: 4px;
	cursor: pointer;
	margin-top: 1rem;
	transition: all 0.3s ease;
	box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.neon-button:hover {
	background: rgba(0, 255, 255, 0.1);
	box-shadow: 0 0 20px #0ff;
}

/* Animations */
@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

@keyframes flicker {
	0%,
	19%,
	21%,
	23%,
	25%,
	54%,
	56%,
	100% {
		text-shadow: 0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #0ff;
	}
	20%,
	24%,
	55% {
		text-shadow: none;
	}
}
</style>
