import { createApp } from 'vue'
import App from './App.vue'
import store from '@/store/index.js'
import router from '@/router/index.js'

import 'normalize.css'
import '@/styles/index.scss'
// uno.css
import 'virtual:uno.css'

const app = createApp(App)

app.use(store)
app.use(router)

app.mount('#app')
