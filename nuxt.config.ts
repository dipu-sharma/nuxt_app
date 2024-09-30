import dotenv from "dotenv";
import { defineNuxtConfig } from "nuxt/config";
import vuetifyPlugin from "vite-plugin-vuetify"; // Import the Vite Vuetify plugin
import { join } from "path";

// Logic to handle environment file based on the NODE_ENV value set in the package.json
if (process.env.NUXT_ENV === "dev") {
  dotenv.config({ path: join(__dirname, ".env.dev") });
} else if (process.env.NUXT_ENV === "uat") {
  dotenv.config({ path: join(__dirname, ".env.uat") });
} else if (process.env.NUXT_ENV === "prod") {
  dotenv.config({ path: join(__dirname, ".env.prod") });
} else {
  // console.log("Directory Name_________________________", __dirname);

  dotenv.config({ path: join(__dirname, ".env") });
}

const publicRuntimeConfig: Record<string, string> = {};
const privateRuntimeConfig: Record<string, string> = {};

// All environment variables need to start with NUXT_
for (const key in process.env) {
  if (key.startsWith("NUXT_PUBLIC_")) {
    publicRuntimeConfig[key] = process.env[key] as string;
  } else if (key.startsWith("NUXT_")) {
    privateRuntimeConfig[key] = process.env[key] as string;
  }
}

export default defineNuxtConfig({
  devServer: {
    port: 5000,
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
  // runtimeConfig: {
  //   public: {
  //     ...publicRuntimeConfig,
  //   },
  //   ...privateRuntimeConfig,
  // },
  runtimeConfig: {
    public: {
      apiUrl:
        process.env[`NUXT_API_URL_${process.env.NODE_ENV?.toUpperCase()}`],
    },
    secretKey: process.env[`SECRET_KEY_${process.env.NODE_ENV?.toUpperCase()}`],
  },
});
