<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup>
import { useThemeStore } from '~/stores/themeStore'
import { useThemeIntegration } from '~/composables/useThemeIntegration'
import { useNotifications } from '~/composables/useNotifications'

const themeStore = useThemeStore()
useThemeIntegration()

// Initialize real-time global websocket notifications
useNotifications()

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
