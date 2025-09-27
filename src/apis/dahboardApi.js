/**
 * @file appApp.js
 * @description App Configuration 模块的接口文件
 */
import request from '@/utils/request.js'
import { useAuthToken } from '@/composables/useAuthToken.js'

// 统一管理API接口
const AppApi = Object.freeze({
  // 获取dashboard面板数据
  GET_DASHBOARD_DATA: '/manager/dashboard/dashboards',
})

// 获取 token
const { getToken } = useAuthToken()

/**
 * 获取dashboard面板数据
 * @returns {Promise}
 */
export const getDashboardDataApi = () => {
  const data = new FormData()
  data.append('token', getToken())

  return request({
    url: AppApi.GET_DASHBOARD_DATA,
    method: 'POST',
    data,
  })
}
