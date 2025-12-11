// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // keep if you actually use this plugin
import path from 'path'
import { fileURLToPath } from 'url'

// create __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // `@` -> /src
      '@': path.resolve(__dirname, './src'),
    },
  },
})
