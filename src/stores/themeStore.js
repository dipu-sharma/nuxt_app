import { defineStore } from 'pinia'
import { ref, nextTick, onMounted } from 'vue'

export const useThemeStore = defineStore('theme', () => {
	// Available themes
	const themes = ['light', 'dark', 'sepia', 'blue', 'green', 'coolBlue', 'glassmorphism']

	const currentTheme = ref('light') // Default theme

	function setTheme(theme) {
		if (themes.includes(theme)) {
			currentTheme.value = theme
			if (process.client) {
				localStorage.setItem('theme', theme)
				const themeCookie = useCookie('theme', { maxAge: 60 * 60 * 24 * 365 })
				themeCookie.value = theme
				document.documentElement.setAttribute('data-theme', theme)
			}
		}
	}

	function initializeTheme() {
		let theme = 'light';
		if (process.client) {
			const themeCookie = useCookie('theme');
			theme = themeCookie.value || localStorage.getItem('theme') || 'light';
		} else {
			const themeCookie = useCookie('theme');
			theme = themeCookie.value || 'light';
		}
		setTheme(theme);
	}
	
	initializeTheme();

	function toggleTheme() {
		const currentIndex = themes.indexOf(currentTheme.value)
		const nextIndex = (currentIndex + 1) % themes.length
		setTheme(themes[nextIndex])
	}

	function getThemeColors() {
		const themeColors = {
			light: {
				background: 'bg-white',
				text: 'text-gray-900',
				primary: 'bg-blue-500',
				secondary: 'bg-gray-100',
				accent: 'bg-red-500'
			},
			dark: {
				background: 'bg-gray-900',
				text: 'text-gray-100',
				primary: 'bg-blue-600',
				secondary: 'bg-gray-800',
				accent: 'bg-red-600'
			},
			sepia: {
				background: 'bg-yellow-50',
				text: 'text-yellow-900',
				primary: 'bg-amber-600',
				secondary: 'bg-yellow-100',
				accent: 'bg-orange-600'
			},
			blue: {
				background: 'bg-blue-50',
				text: 'text-blue-900',
				primary: 'bg-blue-600',
				secondary: 'bg-blue-100',
				accent: 'bg-indigo-600'
			},
			green: {
				background: 'bg-green-50',
				text: 'text-green-900',
				primary: 'bg-green-600',
				secondary: 'bg-green-100',
				accent: 'bg-emerald-600'
			},
			coolBlue: {
				background: 'bg-slate-900',
				text: 'text-slate-50',
				primary: 'bg-cyan-500',
				secondary: 'bg-slate-800',
				accent: 'bg-teal-500'
			}
		}
		themeColors.glassmorphism = {
		background: 'bg-blue-50',
		text: 'text-slate-800',
		primary: 'bg-purple-600',
		secondary: 'bg-purple-100',
		accent: 'bg-pink-500'
	}
	return themeColors[currentTheme.value] || themeColors.light
	}

	onMounted(() => {
		if (process.client) {
			document.documentElement.setAttribute('data-theme', currentTheme.value)
		}
	})

	return {
		themes,
		currentTheme,
		setTheme,
		toggleTheme,
		getThemeColors,
	}
})
