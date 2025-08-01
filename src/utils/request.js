import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
  timeout: 10000,
})

request.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  (response) => {
    const {
      data: { code, msg },
    } = response
    // 若不是成功状态码, 则提示错误信息
    if (code !== 0) {
      // 错误提示
      ElMessage.error(msg)
    }
    return response.data
  },
  (error) => {
    // 处理网络错误的情况
    let msg = ''
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
