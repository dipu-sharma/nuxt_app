// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // === Basic Configuration ===
  srcDir: 'src',
  future: {
    compatibilityVersion: 4,
  },
  devServer: {
    port: 5000,
  },
  ssr: true,
  compatibilityDate: '2025-01-01',

  // === DevTools ===
  devtools: {
    enabled: false,
  },

  // === CSS & Styling ===
  css: [
    '~/assets/css/tailwind.css',
    '@mdi/font/css/materialdesignicons.min.css',
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
    '@pinia/nuxt',
    'vuetify-nuxt-module',
  ],

  // === Pinia configuration ===
  pinia: {
    storesDirs: ['./src/stores/**'],
  },

  // === Auto-imports ===
  imports: {
    dirs: ['api'],
  },

  // === Vuetify Module Settings ===
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      labComponents: true,
      date: {
        adapter: 'vuetify',
      },
      defaults: {
        VDatePicker: {
          color: 'primary',
        },
      },
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            dark: false,
            colors: {
              primary: "#3B82F6",
              secondary: "#F3F4F6",
              accent: "#EF4444",
              error: "#DC2626",
              info: "#3B82F6",
              success: "#10B981",
              warning: "#F59E0B",
              background: "#FFFFFF",
              surface: "#FFFFFF",
            },
          },
          dark: {
            dark: true,
            colors: {
              primary: "#60A5FA",
              secondary: "#1F2937",
              accent: "#F87171",
              error: "#EF4444",
              info: "#60A5FA",
              success: "#34D399",
              warning: "#FBBF24",
              background: "#111827",
              surface: "#1F2937",
            },
          },
          sepia: {
            dark: false,
            colors: {
              primary: "#F59E0B",
              secondary: "#FEF9C3",
              accent: "#EA580C",
              error: "#DC2626",
              info: "#F59E0B",
              success: "#10B981",
              warning: "#F59E0B",
              background: "#FEF3C7",
              surface: "#FEF3C7",
            },
          },
          blue: {
            dark: false,
            colors: {
              primary: "#2563EB",
              secondary: "#DBEAFE",
              accent: "#6366F1",
              error: "#DC2626",
              info: "#2563EB",
              success: "#10B981",
              warning: "#F59E0B",
              background: "#EFF6FF",
              surface: "#EFF6FF",
            },
          },
          green: {
            dark: false,
            colors: {
              primary: "#22C55E",
              secondary: "#DCFCE7",
              accent: "#10B981",
              error: "#DC2626",
              info: "#3B82F6",
              success: "#22C55E",
              warning: "#F59E0B",
              background: "#ECFDF5",
              surface: "#ECFDF5",
            },
          },
          coolBlue: {
            dark: true,
            colors: {
              primary: "#06B6D4",
              secondary: "#1E293B",
              accent: "#14B8A6",
              error: "#EF4444",
              info: "#06B6D4",
              success: "#10B981",
              warning: "#F59E0B",
              background: "#0F172A",
              surface: "#1E293B",
            },
          },
          glassmorphism: {
            dark: false,
            colors: {
              primary: "#667EEA",
              secondary: "#764BA2",
              accent: "#F5576C",
              error: "#DC2626",
              info: "#4FACFE",
              success: "#00F2FE",
              warning: "#FEE140",
              background: "#F0F4FF",
              surface: "rgba(255, 255, 255, 0.1)",
            },
          },
        },
      }
    },
  },

  // === Plugins ===
  plugins: [
    '~/plugins/auth.js',
    '~/plugins/vue3-toastify.js',
    { src: '~/plugins/recaptcha-v3.js', mode: 'client' },
  ],

  // === Vite Configuration ===
  vite: {
    server: {
      watch: {
        ignored: [
          '**/node_modules/**',
          '**/dist/**',
          '**/.git/**',
        ],
      },
    },
    ssr: {
      noExternal: ['vuetify'],
    },
  },

  // === Nitro / Server Settings ===
  nitro: {
    compressPublicAssets: true,
  },

  // === Runtime Config ===
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8001',
    },
  },
})