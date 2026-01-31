// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import * as dotenv from 'dotenv'
import { join } from 'path'
import { transformAssetUrls } from 'vite-plugin-vuetify'

/**
 * Load environment variables based on NUXT_ENV or fallback to NODE_ENV
 */
const env = process.env.NUXT_ENV ?? process.env.NODE_ENV ?? 'dev'

// Primary loading (most common way)
dotenv.config({ path: `.env.${env}` })

// Fallback explicit loading (useful in some CI/CD or Windows edge cases)
if (!process.env.API_BASE_URL) {
  if (env === 'dev') {
    dotenv.config({ path: join(__dirname, '.env.dev') })
  } else if (env === 'uat') {
    dotenv.config({ path: join(__dirname, '.env.uat') })
  } else if (env === 'prod') {
    dotenv.config({ path: join(__dirname, '.env.prod') })
  } else {
    dotenv.config({ path: join(__dirname, '.env') })
  }
}

export default defineNuxtConfig({
  // === Basic Configuration ===
  srcDir: 'src',
  devServer: {
    port: 5000,
  },
  ssr: true, 
  compatibilityDate: '2025-01-01',

  // === DevTools - Most important for your 8GB RAM ===
  devtools: {
    enabled: false,
    // timeline: { enabled: false } // optional extra strict mode
  },

  // === CSS & Styling ===
  css: [
    '~/assets/css/tailwind.css',
    '@mdi/font/css/materialdesignicons.min.css',
    'vuetify/styles',
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // === Modules ===
  modules: [
    '@nuxt/icon',
    // '@pinia/nuxt' → not needed anymore if you use autoImports below
  ],

  // === Pinia Auto-imports ===
  imports: {
    dirs: ['api'], // your custom api composables folder
  },

  // Pinia configuration
  pinia: {
    autoImports: [
      'defineStore',
      'acceptHMRUpdate',
    ],
  },

  // === Plugins ===
  plugins: [
    '~/plugins/pinia.js',              // probably not needed anymore with autoImports
    '~/plugins/auth.js',
    '~/plugins/vue3-toastify.js',
    '~/plugins/vuetify.ts',
    { src: '~/plugins/recaptcha-v3.js', mode: 'client' },
  ],

  // === Build / Transpile ===
  build: {
    transpile: ['vuetify'],
  },

  // === Vuetify Module Settings ===
  vuetify: {
    moduleOptions: {},
    vuetifyOptions: {
      labComponents: true,
    },
  },

  vite: {
    server: {
      watch: {
        ignored: [
          '**/node_modules/**',
          '**/dist/**',
          '**/venv/**',
          '**/.git/**',
        ],
      },
      hmr: {
        overlay: true,
      },
    },
    optimizeDeps: {
      // disabled: false
    },

    vue: {
      template: {
        transformAssetUrls,
      },
    },

    ssr: {
      noExternal: ['vuetify'],
    },
  },

  // === Nitro / Server Settings ===
  nitro: {
    compressPublicAssets: true,
    // minify: false,
  },

  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8001',
    },
  },

  experimental: {
    // payloadExtraction: false,   // sometimes helps memory
    // renderJsonPayloads: true,
  },
})