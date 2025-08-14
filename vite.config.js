import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import path from 'path'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载 .env 文件
  const env = loadEnv(mode, process.cwd())

  // api 基地址
  const baseApi = env.VITE_BASE_URL_API
  // 文件基地址
  const fileApi = env.VITE_BASE_URL_FILE

  // 服务器地址
  const serverApi = env.VITE_SERVER_URL_API

  return {
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
      createSvgIconsPlugin({
        /// 指定存放图标的文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // symbolId 格式：icon-文件夹名-文件名
        symbolId: 'icon-[dir]-[name]',
        inject: 'body-last', // 插入到 body 最后
        customDomId: '__svg__icons__dom__',
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
      proxy: {
        [baseApi]: {
          target: serverApi,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${baseApi}`), ''),
        },
        [fileApi]: {
          target: serverApi,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${fileApi}`), ''),
        },
      },
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
  }
})
