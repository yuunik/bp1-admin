/**
 * @file obdApi.js
 * @description User Management 模块的接口文件
 */

import { stringify } from 'flatted'

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
  // 重置管理员密码
  RESET_ADMIN_PASSWORD: '/manager/resetmangerpassword',
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
  // 获取用户总的维修金额
  GET_USER_REPAIR_AMOUNT: '/expense/total',
  // 获取维修记录详情
  GET_REPAIR_RECORD_INFO: '/expense/info',
  // 管理员编辑Expense Item Cost Analysis
  EDIT_EXPENSE_ITEM_COST_ANALYSIS: '/manager/edit/itemairepair',
  // 编辑维修记录
  EDIT_REPAIR_RECORD: '/expense/edit',
  // 以group进行分组的形式获取所有的expense
  GET_EXPENSE_GROUP_LIST: '/expenditure/expendituresbyapp',
  // 管理员批准修理厂
  APPROVE_MERCHANT: '/manager/merchant/approve',
  // 管理员拒绝修理厂
  REJECT_MERCHANT: '/manager/merchant/reject',
  // 管理员合并修理厂
  MERGE_MERCHANT: '/manager/merchant/merge',
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
  data.append('status', params.statusKey)

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
 * @param params
 * @param params.userId 用户id
 * @param params.page 页码
 * @param params.pageSize 每页数量
 *
 *
 *
 * @returns {Promise<ApiResponse<VehicleInfoItem[]>>} Promise
 */
export const getUserVehicleListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('userId', params.userId)
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)

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

/**
 * 获取用户报修总价
 *
 * @param userId 用户id
 *
 */
export const getRepairTotalPriceApi = (userId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('userId', userId)

  return request({
    url: UserApi.GET_USER_REPAIR_AMOUNT,
    method: 'POST',
    data,
  })
}

/**
 * 获取用户报修记录详情
 * @param expenseId 报修记录id
 *
 * @returns {Promise}
 */
export const getRepairRecordDetailApi = (expenseId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('expenseId', expenseId)

  return request({
    url: UserApi.GET_REPAIR_RECORD_INFO,
    method: 'POST',
    data,
  })
}

/**
 *
 * 管理员编辑Expense Item Cost Analysis
 *
 * @param params
 * @param params.id
 * @param params.avg 市场均价
 * @param params.remark 备注
 * @param params.ratio 占比
 *
 * @returns {Promise}
 */
export const updateExpenseItemCostAnalysisApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('id', params.id)
  data.append('avg', params.avg)
  data.append('remark', params.remark)
  data.append('ratio', params.ratio)

  return request({
    url: UserApi.EDIT_EXPENSE_ITEM_COST_ANALYSIS,
    method: 'POST',
    data,
  })
}

/**
 * 编辑用户报修记录列表
 * @param params
 * @param params.expenseId 报修记录id
 * @param params.userId 用户id
 * @param params.merchantId 修理厂id
 * @param params.merchantName 修理厂名称
 * @param params.vehicleId 车辆id
 * @param params.mileage 行驶里程
 * @param params.date 报修时间
 * @param params.note 备注
 * @param params.fileIds 图片id
 * @param params.ticketIds 工单id
 * @param params.gst 税
 * @param params.discount 优惠
 * @param params.r_cur 币种
 * @param params.itemDtos 报修项目列表
 *
 * @returns {Promise}
 *
 */
export const updateRepairRecordApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('expenseId', params.id)
  data.append('userId', params.userId)
  data.append('merchantId', params.merchantDto.id)
  data.append('merchantName', params.merchantDto.name)
  data.append('vehicleId', params.vehicleId)
  data.append('mileage', params.mileage)
  data.append('date', params.date)
  data.append('note', params.note)
  data.append('fileIds', params.attachmentDtos.map((item) => item.id).join(','))
  data.append('ticketIds', params.ticketDtos.map((item) => item.id).join(','))
  data.append('gst', params.gst)
  data.append('discount', params.discount)
  // 币种符号
  // data.append('r_cur', params.r_cur)
  data.append('itemDtos', stringify(params.expenseItemDtos))

  return request({
    url: UserApi.EDIT_REPAIR_RECORD,
    method: 'POST',
    data,
  })
}

/**
 * 以group进行分组的形式获取所有的expense
 * @param params
 * @param params.userId 用户id
 * @param params.searchKey 搜索关键字
 *
 * @returns {Promise}
 */
export const getExpenseListByGroupApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('userId', params.userId)
  data.append('searchKey', params.searchKey)

  return request({
    url: UserApi.GET_EXPENSE_GROUP_LIST,
    method: 'POST',
    data,
  })
}

/**
 *
 * 管理员批准修理厂
 * @param merchantId 修理厂id
 *
 * @returns {Promise}
 */
export const approveMerchantApi = (merchantId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('merchantId', merchantId)

  return request({
    url: UserApi.APPROVE_MERCHANT,
    method: 'POST',
    data,
  })
}

/**
 * 管理员拒绝修理厂
 * @param merchantId 修理厂id
 *
 * @returns {Promise}
 */
export const rejectMerchantApi = (merchantId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('merchantId', merchantId)

  return request({
    url: UserApi.REJECT_MERCHANT,
    method: 'POST',
    data,
  })
}

/**
 * 管理员合并修理厂
 * @param params
 * @param params.currentId 当前修理厂id
 * @param params.deleteIds 删除修理厂ids
 */
export const mergeMerchantApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('currentId', params.currentId)
  data.append('deleteIds', params.deleteIds)

  return request({
    url: UserApi.MERGE_MERCHANT,
    method: 'POST',
    data,
  })
}

/**
 * 重置管理员账号的密码
 * @param userId 管理员id
 *
 */
export const resetAdminPasswordApi = (userId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('userId', userId)

  return request({
    url: UserApi.RESET_ADMIN_PASSWORD,
    method: 'POST',
    data,
  })
}
