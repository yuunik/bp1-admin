import { createApp } from 'vue'

import App from './App.vue'
import store from '@/store/index.js'
import router from '@/router/index.js'
import debounce from '@/directives/debounce/index.js'

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

const app = createApp(App)

// 自定义指令
app.directive('debounce', debounce)

app.use(store)
app.use(router)

app.mount('#app')
