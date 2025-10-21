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
  // 获取所有用户的expense总额
  GET_ALL_USER_EXPENSE_SUM: '/manager/getusertotal',
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

/**
 * 获取所有用户的expense总额
 *
 * @param params
 * @param {string} params.sortBy 排序字段
 * @param {string} params.sort 排序方式
 *
 * @returns {Promise}
 */
export const getAllUserExpenseSumApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('sortBy', params.sortBy)
  data.append('sort', params.sort)

  return request({
    url: AppApi.GET_ALL_USER_EXPENSE_SUM,
    method: 'POST',
    data,
  })
}
