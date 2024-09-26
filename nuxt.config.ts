import vuetifyPlugin from "vite-plugin-vuetify"; // Import the Vite Vuetify plugin

export default defineNuxtConfig({
  devServer: {
    port: 5000
  },
  ssr: true,
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  srcDir: "src",
  css: [
    "~/assets/css/tailwind.css",
    "vuetify/styles", // Include Vuetify styles
    "@mdi/font/css/materialdesignicons.min.css", // Include MDI icons
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  plugins: ["~/plugins/piniaPersist.js"],
  modules: ["@pinia/nuxt"],
  pinia: {
    storesDirs: ["./stores/**", "./custom-folder/stores/**"],
  },
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    ssr: {
      noExternal: ["vuetify"],
    },
    plugins: [
      vuetifyPlugin({
        autoImport: true,
        styles: true,
      }),
    ],
  },
  runtimeConfig: {
    secretKey: process.env.NUXT_SECRET_KEY, // Private variable
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL, // Public variable
    }
  }
});
