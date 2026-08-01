import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // In local dev, run `vercel dev` instead of `vite` to get /api routes working.
      // This proxy is a fallback placeholder only.
    }
  }
})
