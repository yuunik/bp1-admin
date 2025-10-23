/**
 * @file orderApi.js
 * @description This file contains the API calls for the order module.
 */
import request from '@/utils/request.js'
import { useAuthToken } from '@/composables/useAuthToken.js'

// 统一管理API接口
const OrderApi = Object.freeze({
  // 获取活动当天的订单列表
  GET_ACTIVITY_ORDER_LIST: '/manager/activityorder/activityorders',
  // 删除活动当天的订单
  DELETE_ACTIVITY_ORDER: '/manager/activityorder/delete',
})

// 获取 token
const { getToken } = useAuthToken()

/**
 * 获取活动当天的订单列表
 * @param {Object} params 查询参数
 * @param {Number} params.searchKey 搜索关键字
 * @param {Number} params.page 页码
 * @param {String} params.pageSize 每页条数
 * @param {String} params.sort 排序方式
 * @param {String} params.sortBy 排序字段
 *
 * @returns {Promise}
 */
export const getActiveOrderListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('searchKey', params.searchKey)
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)
  data.append('sort', params.sort)
  data.append('sortBy', params.sortBy)

  return request({
    url: OrderApi.GET_ACTIVITY_ORDER_LIST,
    method: 'POST',
    data,
  })
}

/**
 * 删除活动当天的订单
 * @param {Number} orderId 订单ID
 *
 * @returns {Promise}
 */
export const deleteActiveOrderApi = (orderId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('orderId', orderId)

  return request({
    url: OrderApi.DELETE_ACTIVITY_ORDER,
    method: 'POST',
    data,
  })
}
