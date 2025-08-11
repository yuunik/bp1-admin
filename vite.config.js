import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import path from 'path'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
    UnoCSS(),
    AutoImport({
      // Auto import functions from Vue, e.g. ref, reactive, toRef...
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ['vue'],

      // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
          directives: true,
          version: '2.1.5',
        }),
        // Auto import icon components
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
    }),
    Components({
      resolvers: [
        // Auto register Element Plus components
        // 自动导入 Element Plus 组件
        ElementPlusResolver({
          importStyle: 'sass',
          directives: true,
          version: '2.1.5',
        }),
        // Auto register icon components
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep'],
        }),
      ],
    }),

    Icons({
      autoInstall: true,
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
