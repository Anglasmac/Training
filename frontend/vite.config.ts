import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/customers': { target: 'http://backend:8000', changeOrigin: true },
      '/meals': { target: 'http://backend:8000', changeOrigin: true },
      '/orders': { target: 'http://backend:8000', changeOrigin: true },
      '/dashboard': { target: 'http://backend:8000', changeOrigin: true },
    },
    host: '0.0.0.0',
    port: 5173
  }
})
