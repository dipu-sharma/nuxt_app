import { createPersistedState } from 'pinia-plugin-persistedstate';

export default defineNuxtPlugin(nuxtApp => {
  // Register the plugin with Pinia
  const pinia = nuxtApp.$pinia;
  pinia.use(createPersistedState());
});