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
    // Private keys — only available server-side
    NUXT_SECRET_KEY: process.env.NUXT_SECRET_KEY || 'supersecret',

    // Public keys — exposed to client-side (accessible via useRuntimeConfig().public)
    public: {
      API_BASE_URL: process.env.API_BASE_URL || 'http://192.168.157.128:8001',
      NUXT_API_URL: process.env.NUXT_API_URL || 'http://localhost:8001',
      APP_URL: process.env.APP_URL || 'http://localhost:5000',

      // Google OAuth (SSO)
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',

      // Facebook OAuth (SSO)
      FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID || '',

      // Microsoft OAuth
      MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID || '',
      MICROSOFT_DIRECTORY_ID: process.env.MICROSOFT_DIRECTORY_ID || '',

      // reCAPTCHA
      RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY || '',
      CAPTCHA_Site_Key: process.env.CAPTCHA_Site_Key || '',
    },
  },

  // === DevTools (only in development) ===
  devtools: {
    enabled: process.env.NODE_ENV === 'development',
  },
})