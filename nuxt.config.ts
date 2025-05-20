import { defineNuxtConfig } from 'nuxt/config'

import * as dotenv from 'dotenv'
import { join } from 'path'
import { transformAssetUrls } from 'vite-plugin-vuetify'

// Load environment variables
const env = process.env.NUXT_ENV ?? process.env.NODE_ENV ?? 'dev'
dotenv.config({ path: `.env.${env}` })

// Explicit environment file loading (optional, the above line might be enough)
if (process.env.NUXT_ENV === 'dev') {
	dotenv.config({ path: join(__dirname, '.env.dev') })
} else if (process.env.NUXT_ENV === 'uat') {
	dotenv.config({ path: join(__dirname, '.env.uat') })
} else if (process.env.NUXT_ENV === 'prod') {
	dotenv.config({ path: join(__dirname, '.env.prod') })
} else {
	dotenv.config({ path: join(__dirname, '.env') })
}

export default defineNuxtConfig({
	devServer: {
		port: 5000,
	},
	ssr: true,
	compatibilityDate: '2024-04-03',
	devtools: { enabled: true },
	srcDir: 'src',
	imports: { dirs: ['api'] },
	css: ['~/assets/css/tailwind.css', '@mdi/font/css/materialdesignicons.min.css', 'vuetify/styles'],
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	modules: ['@nuxt/icon'],
	pinia: {
		autoImports: ['defineStore', 'acceptHMRUpdate'],
	},
	plugins: [
		'~/plugins/pinia.js',
		'~/plugins/vue3-toastify.js',
		'~/plugins/vuetify.ts',
		{ src: '~/plugins/recaptcha-v3.js', mode: 'client' },
	],
	build: {
		transpile: ['vuetify'],
	},
	vuetify: { moduleOptions: {}, vuetifyOptions: { labComponents: true } },
	vite: {
		ssr: { noExternal: ['vuetify'] },
		vue: { template: { transformAssetUrls } },
	},
	runtimeConfig: {
		public: {
			API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8001',
		},
	},
})
