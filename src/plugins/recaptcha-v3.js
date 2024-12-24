import { VueReCaptcha } from "vue-recaptcha-v3";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueReCaptcha, {
    siteKey: "6LfTpaQqAAAAAHo7ax_C_K4OkIopH75t2IsQNtgY",
    // loaderOptions: {
    //   autoHideBadge: false,
    //   explicitRenderParameters: {
    //     badge: "bottomleft",
    //   },
    // },
  });
});
