// src/plugins/vuetify.ts
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Import experimental (Labs) components
import { VDateInput, VTimePicker } from "vuetify/labs/components";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components: {
      ...components, // All standard Vuetify components
      VDateInput, // Experimental (Labs) component
      VTimePicker, // Experimental (Labs) component
    },
    directives, // All Vuetify directives
    theme: {
      defaultTheme: "light",
      themes: {
        light: {
          colors: {
            primary: "#1976D2",
            secondary: "#424242",
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
