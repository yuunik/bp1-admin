import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  server: {
    port: 3000,
    host: "0.0.0.0"
  },
  css: {
    preprocessorOptions: {
      scss: {
        // javascriptEnabled: true,
        additionalData: '@use "@/styles/variable.scss" as *;',
      },
    },
  },
})
