import { resolve } from 'path';

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
    resolve: {
      alias: {
        '@shared': resolve(__dirname, '../shared'),
        '~': resolve(__dirname, '.'),
      },
    },
    server: {
      allowedHosts: [process.env.VDOMAIN || ''],
    }
  }
})
