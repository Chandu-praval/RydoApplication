import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/Auth": {
        target: "https://localhost:7025",
        changeOrigin: true,
        secure: false
      },
      "/Customer":{
        target: "https://localhost:7025",
        changeOrigin: true,
        secure: false
      },
      "/Driver":{
        target: "https://localhost:7025",
        changeOrigin: true,
        secure: false
      },
      "/User":{
        target: "https://localhost:7025",
        changeOrigin: true,
        secure: false
      },
      "/Ride":{
        target: "https://localhost:7025",
        changeOrigin: true,
        secure: false
      },
      "/Booking":{
        target: "https://localhost:7025",
        changeOrigin: true,
        secure: false
      }
    }
  }
});