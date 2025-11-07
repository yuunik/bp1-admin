import { createApp } from 'vue'

import App from './App.vue'
import store from '@/store/index.js'
import router from '@/router/index.js'
import debounce from '@/directives/debounce/index.js'
// 路由鉴权
import '@/permission.js'
import SvgIconPlugin from '@/plugins/svg-icon-plugin.js'
import 'quill/dist/quill.snow.css'

// 统一重置样式
import 'normalize.css'
// 图标库
import '@/assets/style.css'
// 全局样式
import '@/styles/index.scss'
// element-plus 样式
import 'element-plus/dist/index.css'
// uno.css 样式
import 'virtual:uno.css'
// svg 图标
import 'virtual:svg-icons-register'
import '@/utils/chart.js'
import clickOutside from '@/directives/clickOutside.js'
import downFile from '@/directives/downFile.js'

const app = createApp(App)

// 防抖指令
app.directive('debounce', debounce)
// 点击目标以外的区域后, 执行的指令
app.directive('click-outside', clickOutside)
// 下载文件指令
app.directive('down-file', downFile)

app.use(store)
app.use(router)
// 注册全局 SvgIcon
app.use(SvgIconPlugin)

app.mount('#app')
