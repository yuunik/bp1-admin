/**
 * @file permission.js
 * @description Vue Router 全局路由守卫配置，主要处理用户鉴权与导航权限控制。
 *              包含前置守卫（beforeEach）用于验证登录状态与用户信息，
 *              以及后置守卫（afterEach）用于关闭进度条等页面跳转后的操作。
 *              使用 Element Plus 提示信息 + NProgress 显示跳转进度，增强用户体验。
 * @author zhou
 * @created 2025-08-01
 * @usage 在 router/index.js 中引入此文件以启用路由守卫功能。
 *        需确保 useUserStore(store) 提供 token 与用户信息状态。
 */
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import router from '@/router/index.js'
import store, { useUserStore } from '@/store/index.js'
import { RouteName } from '@/utils/constantsUtil.js'

// 取消小圆圈图标
NProgress.configure({ showSpinner: false })

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  // 开启进度条
  NProgress.start()
  // 获取用户token
  const userStore = useUserStore(store)
  const token = userStore.token
  // token 校验
  if (token) {
    // 有 token
    if (to.path === '/login') {
      // 提示: 已经登录, 无需重复登录
      ElMessage.warning('Already logged in')
      // 已登录, 则无法访问登录页, 跳转首页
      next({ name: RouteName.DASHBOARD })
    } else {
      // 已登录, 访问非登录页
      // if (hasUserInfo) {
      //   // 有用户信息, 则放行
      //   next()
      // } else {
      //   // TODO 针对用户刷新的情况, 状态管理库中存储的 userInfo 会被清空, 需要重新获取, 需要一个专门的获取用户信息接口
      //
      // }
      next()
    }
  } else {
    // 没有 token 时, 只允许访问登录页和分享模块
    if (to.path === '/login' || to.path.includes('share')) {
      // 访问登录, 则放行
      next()
    } else {
      // 提示
      ElMessage.warning('No access rights')
      // 访问非登录, 则跳转登录
      next({ name: RouteName.LOGIN })
    }
  }
})

// 全局后置路由守卫
router.afterEach((to, from, next) => {
  // 关闭进度条
  NProgress.done()
})
