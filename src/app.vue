<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup>
import { useThemeStore } from '~/stores/themeStore'

const themeStore = useThemeStore()

useHead({
	htmlAttrs: {
		'data-theme': () => themeStore.currentTheme,
	},
})
</script>

<style>
/* Global styles */
body {
	background-color: rgb(var(--color-background));
	color: rgb(var(--color-text));
	transition: background-color 0.3s, color 0.3s;
}
</style>
