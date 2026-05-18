// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       "/Auth": {
//         target: "https://rydo-c5hea5ggafcngzgz.southindia-01.azurewebsites.net/",
//         changeOrigin: true,
//         secure: false
//       },
//       "/Customer":{
//         target: "https://rydo-c5hea5ggafcngzgz.southindia-01.azurewebsites.net/",
//         changeOrigin: true,
//         secure: false
//       },
//       "/Driver":{
//         target: "https://rydo-c5hea5ggafcngzgz.southindia-01.azurewebsites.net/",
//         changeOrigin: true,
//         secure: false
//       },
//       "/User":{
//         target: "https://rydo-c5hea5ggafcngzgz.southindia-01.azurewebsites.net/",
//         changeOrigin: true,
//         secure: false
//       },
//       "/Ride":{
//         target: "https://rydo-c5hea5ggafcngzgz.southindia-01.azurewebsites.net/",
//         changeOrigin: true,
//         secure: false
//       },
//       "/Booking":{
//         target: "https://rydo-c5hea5ggafcngzgz.southindia-01.azurewebsites.net/",
//         changeOrigin: true,
//         secure: false
//       }
//     }
//   }
// });
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    chunkSizeWarningLimit: 1500
  }
})