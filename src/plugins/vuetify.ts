// src/plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VDateInput } from 'vuetify/labs/VDateInput'
export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components: {
      VDateInput,
    },
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: '#1976D2',
            secondary: '#424242',
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
