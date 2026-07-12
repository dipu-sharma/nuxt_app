// src/composables/useThemeIntegration.ts
import { computed, watch, onMounted } from 'vue'
import { useThemeStore } from '@/stores/themeStore'
import { useTheme } from 'vuetify'

type ThemeName = 'light' | 'dark' | 'sepia' | 'blue' | 'green' | 'coolBlue' | 'glassmorphism'

/**
 * Composable for integrating theme system with Vuetify and providing theme utilities
 * Syncs Pinia theme store with Vuetify theme system
 */
export const useThemeIntegration = () => {
	const themeStore = useThemeStore()
	const vuetifyTheme = useTheme()

	// Theme to Vuetify mapping
	const themeMapping: Record<ThemeName, string> = {
		light: 'light',
		dark: 'dark',
		sepia: 'light',
		blue: 'light',
		green: 'light',
		coolBlue: 'dark',
		glassmorphism: 'light'
	}

	// Sync theme store with Vuetify
	const syncVuetifyTheme = () => {
		const currentTheme = themeStore.currentTheme as ThemeName
		const vuetifyThemeName = themeMapping[currentTheme] || 'light'

		if (vuetifyTheme) {
			if (typeof vuetifyTheme.change === 'function') {
				vuetifyTheme.change(vuetifyThemeName)
			} else if (vuetifyTheme.global) {
				vuetifyTheme.global.name.value = vuetifyThemeName
			}
		}

		// Apply data-theme attribute
		if (import.meta.client) {
			document.documentElement.setAttribute('data-theme', currentTheme)
		}
	}

	// Watch for theme changes
	watch(() => themeStore.currentTheme, () => {
		syncVuetifyTheme()
	})

	// Initialize on mount
	onMounted(() => {
		syncVuetifyTheme()
	})

	// Computed theme classes for components
	const themeClasses = computed(() => {
		const theme = themeStore.currentTheme
		const baseClasses = []

		// Add glassmorphism-specific classes
		if (theme === 'glassmorphism') {
			baseClasses.push('glass-theme')
		}

		// Add dark/light mode class
		if (['dark', 'coolBlue'].includes(theme)) {
			baseClasses.push('dark-mode')
		} else {
			baseClasses.push('light-mode')
		}

		return baseClasses.join(' ')
	})

	// Get CSS variable value
	const getCSSVariable = (variableName: string): string => {
		if (import.meta.client) {
			return getComputedStyle(document.documentElement)
				.getPropertyValue(`--${variableName}`)
				.trim()
		}
		return ''
	}

	// Get RGB color from CSS variable
	const getRGBColor = (variableName: string): string => {
		const rgb = getCSSVariable(`color-${variableName}`)
		return rgb ? `rgb(${rgb})` : ''
	}

	// Get RGBA color from CSS variable with custom opacity
	const getRGBAColor = (variableName: string, opacity: number | string = 1): string => {
		const rgb = getCSSVariable(`color-${variableName}`)
		return rgb ? `rgba(${rgb} / ${opacity})` : ''
	}

	// Check if current theme is dark
	const isDarkTheme = computed(() => {
		return ['dark', 'coolBlue'].includes(themeStore.currentTheme)
	})

	// Check if current theme is glassmorphism
	const isGlassmorphism = computed(() => {
		return themeStore.currentTheme === 'glassmorphism'
	})

	// Get theme-aware card style
	const getCardStyle = () => {
		if (isGlassmorphism.value) {
			return {
				background: getCSSVariable('glass-bg') || 'rgba(255, 255, 255, 0.1)',
				backdropFilter: getCSSVariable('glass-blur') || 'blur(10px)',
				border: `1px solid ${getCSSVariable('glass-border') || 'rgba(255, 255, 255, 0.2)'}`,
				boxShadow: getCSSVariable('glass-shadow') || '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
			}
		}
		return {
			backgroundColor: getRGBColor('card'),
			borderColor: getRGBColor('border')
		}
	}

	// Get theme-aware text style
	const getTextStyle = () => {
		return {
			color: getRGBColor('text')
		}
	}

	// Get theme-aware background style
	const getBackgroundStyle = () => {
		return {
			backgroundColor: getRGBColor('background')
		}
	}

	// Get theme-aware button style
	const getButtonStyle = (variant: string = 'primary') => {
		if (isGlassmorphism.value) {
			return {
				background: 'rgba(102, 126, 234, 0.2)',
				backdropFilter: 'blur(10px)',
				border: '1px solid rgba(102, 126, 234, 0.3)',
				color: getRGBColor('primary')
			}
		}
		return {
			backgroundColor: getRGBColor(variant),
			color: variant === 'primary' || variant === 'accent' ? 'rgb(255, 255, 255)' : getRGBColor('text')
		}
	}

	// Get Vuetify color based on current theme
	const getVuetifyColor = (colorType: string = 'primary'): string => {
		const colorMap: Record<string, string> = {
			primary: 'primary',
			secondary: 'secondary',
			accent: 'accent',
			error: 'error',
			info: 'info',
			success: 'success',
			warning: 'warning'
		}
		return colorMap[colorType] || 'primary'
	}

	return {
		// Theme state
		currentTheme: computed(() => themeStore.currentTheme),
		isDarkTheme,
		isGlassmorphism,
		themeClasses,

		// Theme methods
		setTheme: themeStore.setTheme,
		toggleTheme: themeStore.toggleTheme,
		syncVuetifyTheme,

		// CSS helpers
		getCSSVariable,
		getRGBColor,
		getRGBAColor,

		// Style getters
		getCardStyle,
		getTextStyle,
		getBackgroundStyle,
		getButtonStyle,
		getVuetifyColor
	}
}
