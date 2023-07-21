// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: "/brotli-online/",
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 9999,
    },
  },
});
