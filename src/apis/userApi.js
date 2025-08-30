/**
 * @file obdApi.js
 * @description User Management 模块的接口文件
 */

import request from '@/utils/request.js'
import { useAuthToken } from '@/composables/useAuthToken.js'

// 统一管理api请求
const UserApi = Object.freeze({
  // 获取修理厂列表
  GET_MERCHANT_LIST: '/merchant/merchants',
  // 获取用户列表
  GET_USER_LIST: '/manager/user/users',
  // 管理员禁用、解禁用户
  ADMIN_USER_STATUS: '/manager/user/banned',
  // 重置用户密码
  RESET_USER_PASSWORD: '/manager/user/resetpassword',
})

// 获取 token
const { getToken } = useAuthToken()

/**
 * 获取修理厂列表
 * @param params { searchKey: string, page: number, pageSize: number } 搜索关键字、页码、每页数量
 * @returns {Promise<ApiResponse<ShopInfoItem[]>>} Promise
 */
export const getMerchantListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('searchKey', params.searchKey)
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)

  return request({
    url: UserApi.GET_MERCHANT_LIST,
    method: 'POST',
    data,
  })
}

/**
 * 获取用户列表
 * @param params { searchKey: string, page: number, pageSize: number } 搜索关键字、页码、每页数量
 * @returns {Promise<ApiResponse<UserInfoItem[]>>} Promise
 */
export const getUserListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('searchKey', params.searchKey)
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)

  return request({
    url: UserApi.GET_USER_LIST,
    method: 'POST',
    data,
  })
}

/**
 * 管理员禁用、解禁用户
 * @param params { id: number, status: number } 用户id、状态
 * @returns {Promise<ApiResponse>} Promise
 */
export const adminUserStatusApi = (userId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('userId', userId)

  return request({
    url: UserApi.ADMIN_USER_STATUS,
    method: 'POST',
    data,
  })
}

/**
 * 重置用户密码
 * @param params { id: number } 用户id
 * @returns {Promise<ApiResponse>} Promise
 */
export const resetUserPasswordApi = (userId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('userId', userId)

  return request({
    url: UserApi.RESET_USER_PASSWORD,
    method: 'POST',
    data,
  })
}
