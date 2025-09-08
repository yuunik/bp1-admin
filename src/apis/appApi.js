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
  // 编辑车辆品牌名字
  MODIFY_BRAND_NAME: '/manager/brand/edit',
  // 获取车辆品牌详情
  GET_BRAND_MODEL_INFO: '/manager/vehicle/brandinfo',
  // 新增车辆品牌
  ADD_BRAND: '/manager/brand/add',
  // 新增车辆品牌型号
  ADD_BRAND_MODEL: '/manager/brand/add',
  // 修改车辆品牌型号
  MODIFY_BRAND_MODEL: '/manager/model/edit',
  // 获取实时数据预警列表
  GET_LIVE_DATA_WARNING_LIST: '/manager/vehiclewarn/list',
  // 获取汽车保养数据列表
  GET_MAINTENANCE_LIST: '/manager/maintenance/list',
  // 编辑汽车保养数据
  MODIFY_MAINTENANCE_DATA: '/manager/editmaintenance',
  // 获取预测数据列表
  GET_PREDICT_DATA_LIST: '/manager/prediction/list',
  // 编辑预测数据
  MODIFY_PREDICT_DATA: '/manager/editprediction',
  // 编辑实时预警数据
  MODIFY_LIVE_DATA_WARNING_DATA: '/manager/vehiclewarn/edit',
  // 新增实时预警数据
  ADD_LIVE_DATA_WARNING_DATA: '/manager/vehiclewarn/add',
  // 编辑车辆品牌信息你
  MODIFY_BRAND_MODEL_INFO: '/manager/brandmodel/edit',
  // 新增版本数据
  ADD_VERSION_DATA: '/manager/version/addappversion',
  // 编辑版本数据
  MODIFY_VERSION_DATA: '/manager/version/editappversion',
  // 获取版本数据详情
  GET_VERSION_INFO: '/manager/version/info',
  // 获取版本数据列表
  GET_VERSION_LIST: '/manager/version/getappversions',
  // 获取 OBD 链接量统计
  GET_OBD_LINK_STATISTICS: '/manager/obd/getobdconnectedcount',
  // 获取车辆故障码数据列表
  GET_FAULT_CODE_LIST: '/manager/dtc/getfaultcodes',
  // 删除车辆品牌型号
  DELETE_BRAND_MODEL: '/manager/model/delete',
  // 开启 OBD
  OPEN_OBD_LINK: '/manager/obd/open',
  // 获取ai提问记录
  GET_AI_QUESTION_RECORD: '/manager/aichat/records',
  // 删除版本控制信息
  DELETE_VERSION_CONTROL_INFO: '/manager/version/deleteappversion',
})

// 获取 token
const { getToken } = useAuthToken()

/**
 * 获取车辆品牌列表
 * @returns {Promise<ApiResponse<BrandInfo[]>>}
 */
export const getBrandModalListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)
  data.append('sort', params.sort)
  data.append('sortBy', params.sortBy)
  data.append('searchKey', params.searchKey)
  data.append('status', params.status)

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

/**
 * 修改车辆品牌型号
 * @param params 修改车辆品牌型号参数
 * @param params.id 车辆品牌型号ID
 * @param params.name 车辆品牌名称
 * @param params.models 车辆品牌型号名称列表
 * @param params.logo 车辆品牌logo
 * @returns {Promise<ApiResponse<any>>}
 */
export const modifyBrandModelNameApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('modelId', params.id)
  data.append('name', params.name)

  return request({
    url: AppApi.MODIFY_BRAND_MODEL,
    method: 'POST',
    data,
  })
}

/**
 * 获取汽车保养数据列表
 * @returns {Promise<ApiResponse<MaintenanceRecord[]>>}
 */
export const getMaintenanceListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('searchKey', params.searchKey)
  data.append('sortKey', params.sortBy)
  data.append('sort', params.sort)
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)

  return request({
    url: AppApi.GET_MAINTENANCE_LIST,
    method: 'POST',
    data,
  })
}

/**
 * 修改汽车保养数据
 * @param params 修改汽车保养数据参数
 * @param params.id 保养数据ID
 * @param params.title 保养数据标题
 * @param params.content 保养数据内容
 * @param params.status 保养数据状态
 * @returns {Promise<ApiResponse<any>>}
 */
export const modifyMaintenanceDataApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('id', params.id)
  data.append('name', params.name)
  data.append('date', params.date)
  data.append('file', params.file)
  return request({
    url: AppApi.MODIFY_MAINTENANCE_DATA,
    method: 'POST',
    data,
  })
}

/**
 * 获取预测数据列表
 * @returns {Promise<ApiResponse<PredictionData[]>>}
 */
export const getPredictionListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('searchKey', params.searchKey)
  data.append('sortKey', params.sortBy)
  data.append('sort', params.sort)
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)

  return request({
    url: AppApi.GET_PREDICT_DATA_LIST,
    method: 'POST',
    data,
  })
}

/**
 * 修改预测数据
 * @param params 修改预测数据参数
 * @param params.id 预测数据ID
 * @param params.name 预测数据名称
 * @param params.date 预测数据时间
 * @param params.file 预测数据文件
 * @returns {Promise<ApiResponse<any>>}
 */
export const modifyPredictionDataApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('id', params.id)
  data.append('name', params.name)
  data.append('date', params.date)
  data.append('file', params.file)
  return request({
    url: AppApi.MODIFY_PREDICT_DATA,
    method: 'POST',
    data,
  })
}

/**
 * 修改实时数据预警
 * @param params
 * @param params.id 预警ID
 * @param params.minValue 最小预警值
 * @param params.maxValue 最大预警值
 * @param params.name 预警名称
 * @param params.groupKey 预警分组
 * @param params.obdKey 预警OBD参数
 * @param params.unit 预警单位
 * @returns {Promise<ApiResponse<any>>}
 */
export const modifyLivingDataWarningDataApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('vehicleWarnId', params.id)
  data.append('minValue', params.minValue)
  data.append('maxValue', params.maxValue)
  data.append('name', params.name)
  data.append('groupKey', params.groupKey)
  data.append('obdKey', params.obdKey)
  data.append('unit', params.unit)
  return request({
    url: AppApi.MODIFY_LIVE_DATA_WARNING_DATA,
    method: 'POST',
    data,
  })
}

/**
 * 新增实时数据预警
 * @param params
 * @param params.id 预警ID
 * @param params.minValue 最小预警值
 * @param params.maxValue 最大预警值
 * @param params.name 预警名称
 * @param params.groupKey 预警分组
 * @param params.obdKey 预警OBD参数
 * @param params.unit 预警单位
 * @returns {Promise<ApiResponse<any>>}
 */
export const addLivingDataWarningDataApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('vehicleWarnId', params.id)
  data.append('minValue', params.minValue)
  data.append('maxValue', params.maxValue)
  data.append('name', params.name)
  data.append('groupKey', params.groupKey)
  data.append('obdKey', params.obdKey)
  data.append('unit', params.unit)

  return request({
    url: AppApi.ADD_LIVE_DATA_WARNING_DATA,
    method: 'POST',
    data,
  })
}

/**
 * 修改车辆品牌信息
 * @param params 修改车辆品牌信息参数
 * @param params.id 车辆品牌ID
 * @param params.name 车辆品牌名称
 * @param params.models 车辆品牌型号名称列表
 * @param params.file 车辆品牌logo
 * @param params.isdelete 删除车辆品牌
 * @returns {Promise<ApiResponse<any>>}
 */
export const modifyBrandInfoApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('brandId', params.id)
  data.append('name', params.name)
  data.append('models', params.models)
  data.append('file', params.file)
  data.append('isdelete', params.isdelete)
  return request({
    url: AppApi.MODIFY_BRAND_INFO,
    method: 'POST',
    data,
  })
}

export const modifyBrandNameApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('brandId', params.id)
  data.append('name', params.name)

  return request({
    url: AppApi.MODIFY_BRAND_NAME,
    method: 'POST',
    data,
  })
}

/**
 * 添加APP版本信息
 * @param {object} params 添加APP版本信息参数
 * @param {string} params.type 版本类型 (IOS,Android)
 * @param {string} params.version 版本号
 * @param {string} params.content 描述
 * @param {number} params.state 状态 (0不提示、1提示更新、2强制更新、3审核中)
 * @param {string} params.url 更新路径
 * @returns {Promise<ApiResponse<any>>}
 */
export const addAppVersionApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('type', params.type)
  data.append('version', params.version)
  data.append('content', params.content)
  data.append('state', params.state)
  data.append('url', params.url)

  return request({
    url: AppApi.ADD_VERSION_DATA,
    method: 'POST',
    data,
  })
}

/**
 * 修改APP版本信息
 * @param {object} params 添加APP版本信息参数
 * @param {number} params.id 版本ID
 * @param {string} params.type 版本类型 (IOS,Android)
 * @param {string} params.version 版本号
 * @param {string} params.content 版本内容
 * @param {number} params.state 状态 (0不提示、1提示更新、2强制更新、3审核中)
 * @param {string} params.url 更新路径
 * @returns {Promise<ApiResponse<any>>}
 */
export const modifyAppVersionApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('id', params.id)
  data.append('type', params.type)
  data.append('version', params.version)
  data.append('content', params.content)
  data.append('state', params.state)
  data.append('url', params.url)

  return request({
    url: AppApi.MODIFY_VERSION_DATA,
    method: 'POST',
    data,
  })
}

/**
 * 获取APP版本信息
 * @param id 版本ID
 * @returns {Promise<ApiResponse<any>>}
 */
export const getAppVersionInfoApi = (id) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('id', id)
  return request({
    url: AppApi.GET_VERSION_INFO,
    method: 'POST',
    data,
  })
}

/**
 * 获取APP版本列表
 * @param {object} params
 * @param {string} params.types 版本类型 (IOS,Android)
 * @param {string} params.page 不填默认0
 * @param {string} params.pageSize 不填默认20
 * @returns {Promise<ApiResponse<any>>}
 */
export const getAppVersionListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('types', params.types)
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)

  return request({
    url: AppApi.GET_VERSION_LIST,
    method: 'POST',
    data,
  })
}

/**
 * 获取OBD连接统计
 * @param params
 * @param params.obdId OBD id
 * @param params.beginTime 统计的起始日期
 * @param params.endTime 统计的结束日期
 * @returns {Promise<ApiResponse<any>>}
 */
export const getOBDConnectedCountListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('obdId', params.obdId)
  data.append('beginTime', params.beginTime)
  data.append('endTime', params.endTime)

  return request({
    url: AppApi.GET_OBD_LINK_STATISTICS,
    method: 'POST',
    data,
  })
}

/**
 * 获取车辆故障码列表
 * @param vehicleId 车辆 id
 * @returns {Promise<ApiResponse<any>>}
 */
export const getFaultCodeListApi = (vehicleId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('vehicleId', vehicleId)

  return request({
    url: AppApi.GET_FAULT_CODE_LIST,
    method: 'POST',
    data,
  })
}

export const addBrandModelApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('models', params.models)
  data.append('name', params.name)
  data.append('file', params.logo)

  return request({
    url: AppApi.ADD_BRAND_MODEL,
    method: 'POST',
    data,
  })
}

export const deleteBrandModelApi = (modelId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('modelId', modelId)

  return request({
    url: AppApi.DELETE_BRAND_MODEL,
    method: 'POST',
    data,
  })
}

export const openOBDApi = (obdIds) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('obdIds', obdIds)

  return request({
    url: AppApi.OPEN_OBD_LINK,
    method: 'POST',
    data,
  })
}

export const getAiChatRecordList = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)
  data.append('searchKey', params.searchKey)

  return request({
    url: AppApi.GET_AI_QUESTION_RECORD,
    method: 'POST',
    data,
  })
}

export const deleteAppVersionApi = (appVersionId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('id', appVersionId)

  return request({
    url: AppApi.DELETE_VERSION_CONTROL_INFO,
    method: 'POST',
    data,
  })
}
