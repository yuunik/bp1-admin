/**
 * @file expenseApi.js
 * @description ExpenseManagement Management 模块的接口文件
 */
import request from '@/utils/request.js'
import { useAuthToken } from '@/composables/useAuthToken.js'

const ExpenseApi = Object.freeze({
  // 管理员根据用户分页统计expense
  GET_EXPENSE_LIST_BY_USER: '/manager/expense/groupbyuser',
  // 管理员根据车辆品牌分页统计expense
  GET_EXPENSE_LIST_BY_BRAND: '/manager/expense/groupbybrand',
})

// 获取 token
const { getToken } = useAuthToken()

/**
 * 获取用户分页统计expense
 * @param params
 * @param params.page 页码
 * @param params.pageSize 每页数量
 * @param params.sort 排序字段
 * @param params.sortBy 排序方式
 * @param params.searchKey 搜索关键字
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getExpenseListByUserApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)
  data.append('searchKey', params.searchKey)
  data.append('sort', params.sort)
  data.append('sortBy', params.sortBy)

  return request({
    url: ExpenseApi.GET_EXPENSE_LIST_BY_USER,
    method: 'POST',
    data,
  })
}

/**
 * 获取车辆品牌分页统计expense
 * @param params
 * @param params.page 页码
 * @param params.pageSize 每页数量
 * @param params.sort 排序字段
 * @param params.sortBy 排序方式
 * @param params.searchKey 搜索关键字
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getExpenseListByBrandApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)
  data.append('searchKey', params.searchKey)
  data.append('sort', params.sort)
  data.append('sortBy', params.sortBy)

  return request({
    url: ExpenseApi.GET_EXPENSE_LIST_BY_BRAND,
    method: 'POST',
    data,
  })
}
