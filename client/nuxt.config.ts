import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../.env') })

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  nitro: {
    preset: 'static',
  },
  devServer: {
    port: process.env.CLIENT_PORT ? parseInt(process.env.CLIENT_PORT) : 3000,
  }
})
