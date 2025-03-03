<template>
	<div>
		<form @submit.prevent="onSubmit">
			<button type="submit">Submit</button>
		</form>
	</div>
</template>

<script setup>
import { useReCaptcha } from 'vue-recaptcha-v3'

const recaptchaToken = ref(null)
const recaptchaInstance = useReCaptcha()

const recaptcha = async () => {
	await recaptchaInstance?.recaptchaLoaded()
	const token = await recaptchaInstance?.executeRecaptcha('submit')

	return token
}

const onSubmit = async () => {
	const token = await recaptcha() // Await the token from reCAPTCHA
	// Send the token to your server for verification
}
</script>
