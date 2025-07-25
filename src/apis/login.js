import { request } from 'axios'
import { md5Encrypt } from '@/utils/md5_util.js'

// 统一管理 API
const LoginAPI = Object.freeze({
  LOGIN: '/manager/login',
})

// 登录
export const loginApi = (email, password) => {
  // 封装 form data
  const formData = new FormData()
  formData.append('email', email)
  // 加密密码
  password = md5Encrypt(password)
  formData.append('password', password)
  return request({
    url: LoginAPI.LOGIN,
    method: 'POST',
    data: formData,
  })
}
