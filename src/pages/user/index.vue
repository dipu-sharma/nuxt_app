<template>
	<div class="p-6">
		<UploadFileInput @update:inputValue="handleInputValue" @update:file="handleFile" />

		<v-container>
			<v-time-picker v-model="time" label="Select Time"></v-time-picker>
			<v-btn @click="setTimeToNow">Set to Current Time</v-btn>
			<v-btn @click="clearTime">Clear Time</v-btn>
			<p>Selected Time: {{ time }}</p>
		</v-container>
	</div>
</template>

<script setup>
definePageMeta({
	title: 'User Dashboard',
	description: 'Manage your user profile',
	middleware: ['auth-role'],
	role: ['User', 'ADMIN'],
})

const time = ref(null)

const setTimeToNow = () => {
	const now = new Date()
	const hours = String(now.getHours()).padStart(2, '0')
	const minutes = String(now.getMinutes()).padStart(2, '0')
	time.value = `${hours}:${minutes}`
}

const clearTime = () => {
	time.value = null
}

const handleInputValue = (value) => {
	// Function intentionally left blank
}

const handleFile = (file) => {
	// Function intentionally left blank
}
</script>
