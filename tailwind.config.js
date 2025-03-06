/** @type {import('tailwindcss').Config} */
export default {
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
				primary: {
					light: '#3B82F6',
					dark: '#1E3A8A',
				},
			},
		},
	},
	plugins: [],
}
