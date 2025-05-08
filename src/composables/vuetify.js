import { createVuetify } from 'vuetify'
import { VDatePicker } from 'vuetify/labs/VDatePicker'

export default defineNuxtPlugin((nuxtApp) => {
	const vuetify = createVuetify({
		components: {
			VDatePicker,
		},
		date: {
			adapter: 'vuetify', // Explicitly set the date adapter
		},
		defaults: {
			VDatePicker: {
				color: 'primary',
			},
		},
	})

	nuxtApp.vueApp.use(vuetify)
})
