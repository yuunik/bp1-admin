/**
 * @file appApp.js
 * @description App Configuration 模块的接口文件
 */
import request from '@/utils/request.js'
import { useAuthToken } from '@/composables/useAuthToken.js'

// 统一管理API接口
const AppApi = Object.freeze({
  // 获取车辆品牌列表
  GET_BRAND_MODEL_LIST: '/vehicle/brands',
  // 获取 AI 问题列表
  GET_AI_QUESTION_LIST: '/manager/aichat/question',
  // 添加 AI 问题
  ADD_AI_QUESTION: '/manager/aichat/add',
  // 删除 AI 问题
  DELETE_AI_QUESTION: '/manager/aichat/delete',
  // 修改 AI 问题
  MODIFY_AI_QUESTION: '/manager/aichat/edit',
  // 获取车辆品牌详情
  GET_BRAND_MODEL_INFO: '/manager/vehicle/brandinfo',
  // 新增车辆品牌型号
  ADD_BRAND_MODEL: '/manager/model/add',
  // 获取实时数据预警列表
  GET_LIVE_DATA_WARNING_LIST: 'manager/vehiclewarn/list',
})

// 获取 token
const { getToken } = useAuthToken()

/**
 * 获取车辆品牌列表
 * @returns {Promise<ApiResponse<BrandInfo[]>>}
 */
export const getBrandModalListApi = () => {
  const data = new FormData()
  data.append('token', getToken())

  return request({
    url: AppApi.GET_BRAND_MODEL_LIST,
    method: 'POST',
    data,
  })
}

/**
 * 获取 AI 管理问题
 * @returns {Promise<ApiResponse<AiQuestionItem[]>>}
 */
export const getAiQuestionListApi = () => {
  const data = new FormData()
  data.append('token', getToken())

  return request({
    url: AppApi.GET_AI_QUESTION_LIST,
    method: 'POST',
    data,
  })
}

/**
 * 添加 AI 管理问题
 * @param {string} question 问题
 * @returns {Promise<ApiResponse<any>>}
 */
export const addAiQuestionApi = (question) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('question', question)

  return request({
    url: AppApi.ADD_AI_QUESTION,
    method: 'POST',
    data,
  })
}

/**
 * 删除 AI 管理问题
 * @param {number} id 问题ID
 * @returns {Promise<ApiResponse<any>>}
 */
export const deleteAiQuestionApi = (id) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('id', id)

  return request({
    url: AppApi.DELETE_AI_QUESTION,
    method: 'POST',
    data,
  })
}

/**
 * 修改 AI 管理问题
 * @param {number} id 问题ID
 * @param {string} question 问题
 * @param {string} status 问题状态
 * @returns {Promise<ApiResponse<any>>}
 */
export const modifyAiQuestionApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('id', params.id)
  data.append('question', params.question)
  data.append('status', params.status)

  return request({
    url: AppApi.MODIFY_AI_QUESTION,
    method: 'POST',
    data,
  })
}

/**
 * 获取车辆品牌详情
 * @param id 车辆品牌id
 * @returns {Promise<ApiResponse<BrandInfo>>}
 */
export const getBrandModelInfoApi = (id) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('id', id)
  return request({
    url: AppApi.GET_BRAND_MODEL_INFO,
    method: 'POST',
    data,
  })
}

/**
 * 新增车辆品牌型号
 * @param params 新增车辆品牌型号参数
 * @param params.brandId 车辆品牌id
 * @param params.modelName 车辆品牌型号名称
 * @returns {Promise<ApiResponse<BrandModel>>}
 */
export const addBrandModelApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('brandId', params.brandId)
  data.append('name', params.modelName)
  return request({
    url: AppApi.ADD_BRAND_MODEL,
    method: 'POST',
    data,
  })
}

/**
 * 获取实时数据预警列表
 * @returns {*}
 */
export const getLiveWarningDataListApi = () => {
  const data = new FormData()
  data.append('token', getToken())

  return request({
    url: AppApi.GET_LIVE_DATA_WARNING_LIST,
    method: 'POST',
    data,
  })
}
