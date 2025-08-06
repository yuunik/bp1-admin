import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import path from 'path'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
    UnoCSS(),
    AutoImport({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
          directives: true,
          version: '2.1.5',
        }),
      ],
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
          directives: true,
          version: '2.1.5',
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3333,
    host: '0.0.0.0',
    open: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // javascriptEnabled: true,
        additionalData: `
          @use "@/styles/reset.scss" as *;
          @use "@/styles/variable.scss" as *;
        `,
      },
    },
  },
})
