import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../.env') })

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
    port: process.env.CLIENT_PORT ? parseInt(process.env.CLIENT_PORT) : 3000,
  },
  vite: {
    server: {
      allowedHosts: ['nuxt-nest.local'],
    }
  }
})
