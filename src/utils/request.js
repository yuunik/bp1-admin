import axios from 'axios'
import { ElMessage } from 'element-plus'

import { useUserStore } from '@/store/index.js'
import router from '@/router'

let request
const { MODE, VITE_BASE_URL_API, VITE_SERVER_URL_API } = import.meta.env
if (MODE === '.env.local') {
  request = axios.create({
    baseURL: VITE_BASE_URL_API,
    timeout: 10000,
  })
} else {
  request = axios.create({
    baseURL: VITE_SERVER_URL_API,
    timeout: 10000,
  })
}

request.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  async (response) => {
    const {
      data: { code, msg },
    } = response
    // 处理请求接口失败的情况
    if (code === 401) {
      const { clearInfo } = useUserStore()
      // 清除用户信息
      await clearInfo()
      // token 失效提示
      ElMessage.error('Token expired')
      // 路由跳转至登录页
      await router.replace('/login')
      return Promise.reject('Unauthorized')
    } else if (code !== 0) {
      // 错误提示
      ElMessage.error(msg)
      return Promise.reject(msg)
    }
    return response.data
  },
  (error) => {
    // 处理网络错误的情况
    let msg
    const status = error.response?.status
    switch (status) {
      case 401:
        msg = 'No access rights'
        break
      case 403:
        msg = 'No access rights'
        break
      case 404:
        msg = 'Request address error'
        break
      case 500:
        msg = 'Server internal error'
        break
      default:
        msg = 'No network connection'
    }
    // 错误提示
    ElMessage.error(msg)
    return Promise.reject(error)
  },
)

export default request
