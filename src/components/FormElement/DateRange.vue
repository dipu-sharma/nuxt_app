<template>
	<v-app>
		<v-container>
			<v-date-picker v-model="range" is-range />
			<div v-if="range" class="mt-4">
				Selected from {{ formatDate(range.start) }} to {{ formatDate(range.end) }}
			</div>
		</v-container>
	</v-app>
</template>

<script setup>
const range = ref({
	start: new Date(),
	end: new Date(new Date().setDate(new Date().getDate() + 7)),
})

const formatDate = (date) => {
	return date.toLocaleDateString()
}
</script>
