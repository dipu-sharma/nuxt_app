/** @type {import('tailwindcss').Config} */
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
				background: 'rgb(var(--color-background) / <alpha-value>)',
				text: 'rgb(var(--color-text) / <alpha-value>)',
				primary: 'rgb(var(--color-primary) / <alpha-value>)',
				secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
				accent: 'rgb(var(--color-accent) / <alpha-value>)',
				card: 'rgb(var(--color-card) / <alpha-value>)',
				border: 'rgb(var(--color-border) / <alpha-value>)',
			},
			keyframes: {
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				blob: {
					'0%': { transform: 'translate(0px, 0px) scale(1)' },
					'33%': { transform: 'translate(30px, -50px) scale(1.1)' },
					'66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
					'100%': { transform: 'translate(0px, 0px) scale(1)' },
				},
			},
			animation: {
				'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
				'fade-in-up-delay-1': 'fade-in-up 0.8s ease-out 0.2s forwards',
				'fade-in-up-delay-2': 'fade-in-up 0.8s ease-out 0.4s forwards',
				float: 'float 3s ease-in-out infinite',
				blob: 'blob 7s infinite',
			},
		},
	},
	plugins: [],
}
