import { md5Encrypt } from '@/utils/md5Util.js'
import request from '@/utils/request.js'

// 统一管理 API
const LoginAPI = Object.freeze({
  LOGIN: '/manager/login',
})

// 登录
export const loginApi = (loginParams) => {
  // 封装 form data
  const formData = new FormData()
  formData.append('email', loginParams.email)
  // 加密密码
  const password = md5Encrypt(loginParams.password)
  formData.append('password', password)
  return request({
    url: LoginAPI.LOGIN,
    method: 'POST',
    data: formData,
  })
}
