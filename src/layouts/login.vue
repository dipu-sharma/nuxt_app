<template>
	<div class="bg-gray-100 dark:bg-gray-900 min-h-screen">
		<main class="">
			<slot />
		</main>
	</div>
</template>

<script setup></script>

<style scoped>
.default-main {
	align-items: center !important;
	justify-content: center !important;
}
</style>
