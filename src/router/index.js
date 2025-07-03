import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/router/routes/index.js'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
})

export default router