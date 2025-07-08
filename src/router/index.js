import { createRouter, createWebHistory } from 'vue-router'

import constantRoutes from '@/router/routes/index.js'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
})

export default router