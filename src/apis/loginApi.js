/**
 * @file 用户登录模块的接口文件
 */

import { md5Encrypt } from '@/utils/md5Util.js'
import request from '@/utils/request.js'

// 统一管理 API
const LoginAPI = Object.freeze({
  LOGIN: '/manager/login',
})

/**
 * 登录 API
 * @param loginParams 登录参数
 * @returns {Promise<ApiResponse<AdminUserItem>>}
 */
export const loginApi = (loginParams) => {
  // 封装 form data
  const data = new FormData()
  data.append('email', loginParams.email)
  // 加密密码
  const password = md5Encrypt(loginParams.password)
  data.append('password', password)
  return request({
    url: LoginAPI.LOGIN,
    method: 'POST',
    data
  })
}
