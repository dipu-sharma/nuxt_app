/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/components/**/*.{js,vue,ts}",
    "./src/layouts/**/*.vue",
    "./src/pages/**/*.vue",
    "./src/plugins/**/*.{js,ts}",
    "./src/app.vue",
    "./src/error.vue",
  ],
  theme: {
    extend: {
      colors: {
        'gradient-start': '#6EE7B7', // Customize gradient start color
        'gradient-end': '#3B82F6', // Customize gradient end color
      },
    },
  },
  plugins: [],
}

