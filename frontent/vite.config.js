import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  ,
  server: {
    port: 5173,
  },
  // 👇 This handles SPA fallback routing for Render or any static host
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  base: './',
})
