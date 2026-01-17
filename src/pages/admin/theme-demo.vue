<template>
	<div class="p-6" style="background-color: rgb(var(--color-background)); color: rgb(var(--color-text)); min-height: 100vh">
		<div class="max-w-4xl mx-auto">
			<h1 class="text-4xl font-bold mb-8 text-center" style="color: rgb(var(--color-text))">
				🎨 Multiple Theme System Demo
			</h1>

		<header class="mb-8 p-6 rounded-lg shadow-lg" style="background-color: rgb(var(--color-sidebar)); color: rgb(var(--color-sidebar-text)); border: 1px solid rgb(var(--color-border))">
			<h2 class="text-2xl font-semibold mb-4" style="color: rgb(var(--color-sidebar-text))">
					Current Theme: <span class="capitalize font-bold" style="color: rgb(var(--color-primary))">{{ themeStore.currentTheme }}</span>
				</h2>
				<p class="mb-4" style="color: rgb(var(--color-text))">
					Click the theme toggle button in the topbar to cycle through all available themes.
				</p>
				<div class="flex flex-wrap gap-2">
					<span v-for="theme in themeStore.themes" :key="theme"
						class="px-3 py-1 rounded-full text-sm"
						:class="theme === themeStore.currentTheme ? 'font-bold' : ''"
						:style="{
							backgroundColor: theme === themeStore.currentTheme ? 'rgb(var(--color-primary))' : 'rgb(var(--color-secondary))',
							color: theme === themeStore.currentTheme ? 'white' : 'rgb(var(--color-text))'
						}">
						{{ theme }}
					</span>
				</div>
			</header>

			<!-- Theme Components Demo -->
			<div class="grid md:grid-cols-2 gap-8">
				<!-- Cards Demo -->
				<div class="p-6 rounded-lg shadow-lg" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
					<h3 class="text-xl font-semibold mb-4" style="color: rgb(var(--color-text))">Sample Cards</h3>
					<div class="space-y-4">
						<div class="p-4 rounded-lg" style="background-color: rgb(var(--color-secondary)); border: 1px solid rgb(var(--color-border))">
							<h4 class="font-medium" style="color: rgb(var(--color-text))">Card Title</h4>
							<p class="text-sm" style="color: rgb(var(--color-text))">This card adapts to the current theme colors.</p>
						</div>
						<div class="p-4 rounded-lg" style="background-color: rgb(var(--color-secondary)); border: 1px solid rgb(var(--color-border))">
							<h4 class="font-medium" style="color: rgb(var(--color-text))">Another Card</h4>
							<p class="text-sm" style="color: rgb(var(--color-text))">All colors change dynamically with the theme.</p>
						</div>
					</div>
				</div>

				<!-- Buttons Demo -->
				<div class="p-6 rounded-lg shadow-lg" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
					<h3 class="text-xl font-semibold mb-4" style="color: rgb(var(--color-text))">Sample Buttons</h3>
					<div class="space-y-3">
						<button class="w-full px-4 py-2 rounded-lg font-medium transition-colors"
							style="background-color: rgb(var(--color-primary)); color: white">
							Primary Button
						</button>
						<button class="w-full px-4 py-2 rounded-lg font-medium transition-colors border-2"
							style="border-color: rgb(var(--color-primary)); color: rgb(var(--color-primary)); background-color: transparent">
							Secondary Button
						</button>
						<button class="w-full px-4 py-2 rounded-lg font-medium transition-colors"
							style="background-color: rgb(var(--color-accent)); color: white">
							Accent Button
						</button>
					</div>
				</div>

				<!-- Form Elements Demo -->
				<div class="p-6 rounded-lg shadow-lg" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
					<h3 class="text-xl font-semibold mb-4" style="color: rgb(var(--color-text))">Form Elements</h3>
					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium mb-2" style="color: rgb(var(--color-text))">Sample Input</label>
							<input type="text" placeholder="Type something..."
								class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
								style="background-color: rgb(var(--color-background)); color: rgb(var(--color-text)); border-color: rgb(var(--color-border)); --tw-ring-color: rgb(var(--color-primary))">
						</div>
						<div>
							<label class="block text-sm font-medium mb-2" style="color: rgb(var(--color-text))">Sample Select</label>
							<select class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
								style="background-color: rgb(var(--color-background)); color: rgb(var(--color-text)); border-color: rgb(var(--color-border)); --tw-ring-color: rgb(var(--color-primary))">
								<option>Option 1</option>
								<option>Option 2</option>
								<option>Option 3</option>
							</select>
						</div>
					</div>
				</div>

				<!-- Color Palette Demo -->
				<div class="p-6 rounded-lg shadow-lg" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
					<h3 class="text-xl font-semibold mb-4" style="color: rgb(var(--color-text))">Color Palette</h3>
					<div class="grid grid-cols-2 gap-3">
						<div class="text-center">
							<div class="w-full h-12 rounded-lg mb-2" style="background-color: rgb(var(--color-background))"></div>
							<span class="text-xs" style="color: rgb(var(--color-text))">Background</span>
						</div>
						<div class="text-center">
							<div class="w-full h-12 rounded-lg mb-2" style="background-color: rgb(var(--color-text))"></div>
							<span class="text-xs" style="color: rgb(var(--color-text))">Text</span>
						</div>
						<div class="text-center">
							<div class="w-full h-12 rounded-lg mb-2" style="background-color: rgb(var(--color-primary))"></div>
							<span class="text-xs" style="color: rgb(var(--color-text))">Primary</span>
						</div>
						<div class="text-center">
							<div class="w-full h-12 rounded-lg mb-2" style="background-color: rgb(var(--color-accent))"></div>
							<span class="text-xs" style="color: rgb(var(--color-text))">Accent</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Instructions -->
			<div class="mt-12 p-6 rounded-lg shadow-lg text-center" style="background-color: rgb(var(--color-secondary)); border: 1px solid rgb(var(--color-border))">
				<h3 class="text-xl font-semibold mb-4" style="color: rgb(var(--color-text))">How to Use</h3>
				<p class="mb-4" style="color: rgb(var(--color-text))">
					Click the theme toggle button in the top-right corner to cycle through all available themes.
					Your preference is automatically saved and will persist across page reloads and sessions.
				</p>
				<div class="flex justify-center space-x-4 text-sm">
					<span style="color: rgb(var(--color-text))">Available themes:</span>
					<span v-for="theme in themeStore.themes" :key="theme" class="capitalize px-2 py-1 rounded" style="background-color: rgb(var(--color-primary)); color: white">
						{{ theme }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useThemeStore } from '~/stores/themeStore'

const themeStore = useThemeStore()

definePageMeta({
	title: 'Theme Demo',
	layout: 'admin'
})
</script>