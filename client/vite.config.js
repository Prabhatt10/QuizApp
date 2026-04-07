import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        // target: 'http://localhost:5000', 
        // target: 'https://quizapp-tjsd.onrender.com' ,
        target : 'https://quiz-app-m9j8.vercel.app/',
        changeOrigin: true
      }
    }
  }
})
