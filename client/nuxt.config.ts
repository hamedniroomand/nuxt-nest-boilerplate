// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',
  devtools: { enabled: true },
  nitro: {
    preset: 'static',
  },
  app: {
    head: {
      title: 'Nuxt Nest',
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
      ],
    },
  },
  devServer: {
    port: 3000,
  },
  vite: {
    server: {
      allowedHosts: [process.env.VDOMAIN || ''],
    }
  }
})
