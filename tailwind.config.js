/** @type {import('tailwindcss').Config} */
function withOpacity(variableName) {
	return ({ opacityValue }) => {
		if (opacityValue !== undefined) {
			return `rgba(var(${variableName}), ${opacityValue})`
		}
		return `rgb(var(${variableName}))`
	}
}

export default {
	darkMode: 'class', // or 'media'
	content: [
		'./src/components/**/*.{js,vue,ts}',
		'./src/layouts/**/*.vue',
		'./src/pages/**/*.vue',
		'./src/plugins/**/*.{js,ts}',
		'./src/app.vue',
		'./src/error.vue',
	],
	theme: {
		extend: {
			colors: {
				background: withOpacity('--color-background'),
				text: withOpacity('--color-text'),
				primary: withOpacity('--color-primary'),
				secondary: withOpacity('--color-secondary'),
				accent: withOpacity('--color-accent'),
				card: withOpacity('--color-card'),
				border: withOpacity('--color-border'),
			},
		},
	},
	plugins: [],
}
