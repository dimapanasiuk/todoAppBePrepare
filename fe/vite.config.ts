import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Auth Service
      '/api/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Todos Service
      '/api/tasks': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})

