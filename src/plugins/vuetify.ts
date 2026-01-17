// src/plugins/vuetify.ts
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { VTimePicker } from "vuetify/components"; // Import VTimePicker from standard components

// Import experimental (Labs) components
import { VDateInput } from "vuetify/labs/components";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components: {
      ...components, // All standard Vuetify components
      VTimePicker, // Standard component
      VDateInput, // Experimental (Labs) component
    },
    directives, // All Vuetify directives
    theme: {
      defaultTheme: "light",
      themes: {
        light: {
          dark: false,
          colors: {
            primary: "#3B82F6", // blue-500
            secondary: "#F3F4F6", // gray-100
            accent: "#EF4444", // red-500
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
            primary: "#60A5FA", // blue-400
            secondary: "#1F2937", // gray-800
            accent: "#F87171", // red-400
            error: "#EF4444",
            info: "#60A5FA",
            success: "#34D399",
            warning: "#FBBF24",
            background: "#111827", // gray-900
            surface: "#1F2937", // gray-800
          },
        },
        sepia: {
          dark: false,
          colors: {
            primary: "#F59E0B", // amber-500
            secondary: "#FEF9C3", // yellow-100
            accent: "#EA580C", // orange-600
            error: "#DC2626",
            info: "#F59E0B",
            success: "#10B981",
            warning: "#F59E0B",
            background: "#FEF3C7", // yellow-50
            surface: "#FEF3C7",
          },
        },
        blue: {
          dark: false,
          colors: {
            primary: "#2563EB", // blue-600
            secondary: "#DBEAFE", // blue-100
            accent: "#6366F1", // indigo-500
            error: "#DC2626",
            info: "#2563EB",
            success: "#10B981",
            warning: "#F59E0B",
            background: "#EFF6FF", // blue-50
            surface: "#EFF6FF",
          },
        },
        green: {
          dark: false,
          colors: {
            primary: "#22C55E", // green-500
            secondary: "#DCFCE7", // green-100
            accent: "#10B981", // emerald-500
            error: "#DC2626",
            info: "#3B82F6",
            success: "#22C55E",
            warning: "#F59E0B",
            background: "#ECFDF5", // green-50
            surface: "#ECFDF5",
          },
        },
        coolBlue: {
          dark: true,
          colors: {
            primary: "#06B6D4", // cyan-500
            secondary: "#1E293B", // slate-800
            accent: "#14B8A6", // teal-500
            error: "#EF4444",
            info: "#06B6D4",
            success: "#10B981",
            warning: "#F59E0B",
            background: "#0F172A", // slate-900
            surface: "#1E293B", // slate-800
          },
        },
        glassmorphism: {
          dark: false,
          colors: {
            primary: "#667EEA", // purple gradient start
            secondary: "#764BA2", // purple gradient end
            accent: "#F5576C", // pink accent
            error: "#DC2626",
            info: "#4FACFE",
            success: "#00F2FE",
            warning: "#FEE140",
            background: "#F0F4FF", // light blue background
            surface: "rgba(255, 255, 255, 0.1)", // glass surface
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
