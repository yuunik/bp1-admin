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
  // 新增修理厂
  ADD_MERCHANT: '/manager/merchant/add',
  // 获取用户详情
  GET_USER_INFO: '/user/infobyuserid',
  // 获取用户已绑定的OBD列表
  GET_USER_OBD_LIST: '/manager/obd/obdsbyuserid',
  // 获取用户已绑定的车辆列表
  GET_USER_VEHICLE_LIST: '/manager/vehicle/vehicles',
  // 新增管理员
  ADD_MANAGER: '/manager/add',
  // 获取修理厂详情
  GET_MERCHANT_INFO: '/merchant/getshopinfo',
  // 禁用修理厂
  DISABLE_MERCHANT: '/manager/merchant/disable',
  // 获取记录详情
  GET_EXPENSE_RECORD_INFO: '/expense/info',
  // 获取维修记录列表
  GET_REPAIR_RECORD_LIST: '/expense/expenses',
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
  data.append('sort', params.sort)
  data.append('sortBy', params.sortBy)

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
  data.append('sort', params.sort)
  data.append('sortBy', params.sortBy)
  data.append('status', params.statusKey)

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

/**
 * 新增修理厂
 * @param params
 * @returns {*}
 */
export const addMerchantApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('email', params.email)
  data.append('name', params.name)
  data.append('password', params.password)
  data.append('businessHours', params.operatingHours)
  data.append('address', params.address)
  data.append('postalCode', params.postalCode)
  data.append('phoneCountry', '+' + params.phoneCountry)
  data.append('phoneNumber', params.phoneNumber)
  data.append('une', params.une)
  data.append('file', params.file)

  return request({
    url: UserApi.ADD_MERCHANT,
    method: 'POST',
    data,
  })
}

/**
 * 获取用户详情
 * @param userId { id: number } 用户id
 * @returns {Promise<ApiResponse<UserInfoItem>>} Promise
 */
export const getUserInfoApi = (userId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('userId', userId)
  return request({
    url: UserApi.GET_USER_INFO,
    method: 'POST',
    data,
  })
}

/**
 * 获取用户已绑定的OBD列表
 * @param userId { id: number } 用户id
 * @returns {Promise<ApiResponse<OBDInfoItem[]>>} Promise
 */
export const getUserOBDListApi = (userId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('userId', userId)
  return request({
    url: UserApi.GET_USER_OBD_LIST,
    method: 'POST',
    data,
  })
}

/**
 * 获取用户已绑定的车辆列表
 * @param userId { id: number } 用户id
 * @returns {Promise<ApiResponse<VehicleInfoItem[]>>} Promise
 */
export const getUserVehicleListApi = (userId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('userId', userId)
  return request({
    url: UserApi.GET_USER_VEHICLE_LIST,
    method: 'POST',
    data,
  })
}

/**
 * 新增管理员
 * @param params
 * @returns {*}
 */
export const addManagerApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('email', params.email)
  data.append('name', params.name)
  data.append('password', params.password)

  return request({
    url: UserApi.ADD_MANAGER,
    method: 'POST',
    data,
  })
}

/**
 * 获取修理厂详情
 * @param workShopId { id: number } 修理厂id
 * @returns {Promise<ApiResponse<ShopInfoItem>>} Promise
 */
export const getMerchantInfoApi = (workShopId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('id', workShopId)

  return request({
    url: UserApi.GET_MERCHANT_INFO,
    method: 'POST',
    data,
  })
}

/**
 * 禁用修理厂
 * @param workShopId { id: number } 修理厂id
 * @returns {Promise<ApiResponse>} Promise
 */
export const disableMerchantApi = (workShopId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('merchantId', workShopId)

  return request({
    url: UserApi.DISABLE_MERCHANT,
    method: 'POST',
    data,
  })
}

/**
 * 获取记录详情
 * @param expenseId
 *
 * @returns {Promise<ApiResponse<any>>} Promise
 */
export const getExpenseInfoApi = (expenseId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('expenseId', expenseId)

  return request({
    url: UserApi.GET_EXPENSE_RECORD_INFO,
    method: 'POST',
    data,
  })
}

/**
 * 获取记录列表
 * @param params
 * @param params.userId 用户id
 * @param params.page 页码
 * @param params.pageSize  每页数量
 * @param params.beginTime 开始时间
 * @param params.endTime 结束时间
 * @param params.minPrice 最小金额
 * @param params.maxPrice 最大金额
 * @param params.sortBy 排序字段
 * @param params.sort 排序方式
 * @param params.vehicleId 车辆id
 * @param params.searchKey 搜索关键字
 *
 *
 * @returns {Promise<ApiResponse<any>>} Promise
 */
export const getRecordListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('page', params.page)
  data.append('userId', params.userId)
  data.append('pageSize', params.pageSize)
  data.append('beginTime', params.beginTime)
  data.append('endTime', params.endTime)
  data.append('minPrice', params.minPrice)
  data.append('maxPrice', params.maxPrice)
  data.append('sortBy', params.sortBy)
  data.append('sort', params.sort)
  data.append('vehicleId', params.vehicleId)
  data.append('searchKey', params.searchKey)

  return request({
    url: UserApi.GET_REPAIR_RECORD_LIST,
    method: 'POST',
    data,
  })
}
