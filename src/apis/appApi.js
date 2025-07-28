/**
 * @file App Configuration 模块的接口文件
 */
import request from '@/utils/request.js'
import { useAuthToken } from '@/composables/useAuthToken.js'

// 统一管理API接口
const AppApi = Object.freeze({
  // 获取车辆品牌列表
  GET_BRAND_MODAL_LIST: '/vehicle/brands',
})

// 获取车辆品牌列表
/**
 * @returns {Promise<ApiResponse<OBDItem[]>>}
 */
export const getBrandModalListApi = () => {
  const data = new FormData()
  // 获取 token
  const { getToken } = useAuthToken()
  data.append('token', getToken())

  return request({
    url: AppApi.GET_BRAND_MODAL_LIST,
    method: 'POST',
    data: data,
  })
}
