/**
 * @file User Management 模块的接口文件
 */

import request from '@/utils/request.js'
import { useAuthToken } from '@/composables/useAuthToken.js'

// 统一管理api请求
const UserApi = Object.freeze({
  // 获取修理厂列表
  GET_MERCHANT_LIST: '/merchant/merchants',
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
