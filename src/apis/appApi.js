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
  MODIFY_BRAND_INFO: '/manager/brand/edit',
  // 获取车辆品牌详情
  GET_BRAND_MODEL_INFO: '/manager/vehicle/brandinfo',
  // 新增车辆品牌
  ADD_BRAND: '/manager/brand/add',
  // 新增车辆品牌型号
  ADD_BRAND_MODEL: '/manager/model/add',
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
  MODIFY_PREDICT_DATA: '/manager/prediction/editprediction',
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
  // 获取分组列表数据
  GET_EXPENSE_LIST: '/expenditure/expenditures',
  // 获取Expense的分组列表
  GET_EXPENSE_GROUP_LIST: '/expenditure/categories',
  // 新增 Expense Item
  ADD_EXPENSE_ITEM: '/expenditure/add',
  // 删除 Expense Item
  DELETE_EXPENSE_ITEM: '/manager/expenditure/delete',
  // 编辑 Expense Item
  MODIFY_EXPENSE_ITEM: '/manager/expenditure/edit',
  // 管理员获取用户信息，筛选使用
  GET_USER_LIST: '/manager/expenditure/users',
  // 上传品牌logo
  UPLOAD_BRAND_LOGO: '/manager/brand/logo',
  // 删除品牌
  DELETE_BRAND: '/manager/brand/delete',
  // 创建推送任务
  CREATE_PUSH_TASK: '/manager/pushtask/add',
  // 删除推送任务
  DELETE_PUSH_TASK: '/manager/pushtask/delete',
  // 编辑推送任务
  MODIFY_PUSH_TASK: '/manager/pushtask/edit',
  // 获取推送任务列表
  GET_PUSH_TASK_LIST: '/manager/pushtask/pushtasks',
  // 获取推送任务所推送的用户列表
  GET_PUSH_TASK_USER_LIST: '/manager/pushtask/users',
  // 修改 ai 的回答文本
  MODIFY_AI_ANSWER_TEXT: '/manager/aichatrecord/edit',
  // 获取ai使用次数
  GET_USER_AI_USE_COUNT: '/manager/user/aicount',
  // 编辑ai使用次数
  MODIFY_USER_AI_USE_COUNT: '/manager/user/addaicount',
  // 获取预测列表
  GET_PREDICT_LIST: '/manager/prediction/getpredictions',
  // 获取预测子项名称列表
  GET_PREDICT_NAME_LIST: '/manager/prediction/getbasepredictions',
  // 新增预测数据
  ADD_PREDICT_DATA: '/manager/prediction/addprediction',
  // 删除预测数据
  DELETE_PREDICT_DATA: '/manager/prediction/deleteprediction',
  // 新增预测数据的OEM信息
  ADD_PREDICT_OEM_INFO: '/manager/prediction/addpredictionoem',
  // 获取品牌的OEM实时信息
  GET_BRAND_OEM_REALTIME_List: '/manager/prediction/getoemlivedate',
  // 编辑预测数据的OEM信息
  MODIFY_PREDICT_OEM_INFO: '/manager/prediction/updatepredictionoem',
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
  params?.page != null && data.append('page', params.page)
  params?.pageSize && data.append('pageSize', params.pageSize)
  params?.sort && data.append('sort', params.sort)
  params?.sortBy && data.append('sortBy', params.sortBy)
  params?.searchKey && data.append('searchKey', params.searchKey)
  params?.status && data.append('status', params.status)

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
export const getAiQuestionListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('sort', params.sort)
  data.append('sortBy', params.sortBy)

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
  data.append('searchKey', params.searchKey || '')
  data.append('sortKey', params.sortBy || '')
  data.append('sort', params.sort || '')
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
 * @param params.date 预测数据时间
 * @param params.mileage 预测数据里程
 *
 * @returns {Promise<ApiResponse<any>>}
 */
export const modifyPredictionDataApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('predictionId', params.id)
  data.append('day', params.date)
  data.append('mileage', params.mileage)

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

export const modifyBrandInfoApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('brandId', params.id)
  params.name && data.append('name', params.name)
  params.isDelete === 0 && data.append('isdelete', params.isDelete)

  return request({
    url: AppApi.MODIFY_BRAND_INFO,
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
 * @param {string} params.searchKey 搜索关键字
 * @returns {Promise<ApiResponse<any>>}
 */
export const getAppVersionListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('types', params.types)
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)
  data.append('searchKey', params.searchKey)

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

export const addBrandApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('models', params.models)
  data.append('name', params.name)
  data.append('file', params.logo)

  return request({
    url: AppApi.ADD_BRAND,
    method: 'POST',
    data,
  })
}

export const addBrandModelApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('brandId', params.brandId)
  data.append('name', params.name)

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

export const getExpenseListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('groups', params.groups)
  data.append('categorys', params.categorys)
  data.append('modules', params.modules)
  data.append('userIds', params.userIds)
  data.append('searchKey', params.searchKey)
  data.append('sort', params.sort)
  data.append('sortBy', params.sortBy)
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)
  return request({
    url: AppApi.GET_EXPENSE_LIST,
    method: 'POST',
    data,
  })
}

export const getExpenseGroupListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())

  return request({
    url: AppApi.GET_EXPENSE_GROUP_LIST,
    method: 'POST',
    data,
  })
}

export const addExpenseItemApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('group', params.group)
  data.append('category', params.category)
  data.append('module', params.module)
  data.append('name', params.name)
  data.append('maintenanceName', params.maintenanceName)

  // userId为空, 是管理员创建
  params?.userId && data.append('userId', params.userId || '')

  return request({
    url: AppApi.ADD_EXPENSE_ITEM,
    method: 'POST',
    data,
  })
}

export const deleteExpenseItemApi = (expenditureIds) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('expenditureIds', expenditureIds)

  return request({
    url: AppApi.DELETE_EXPENSE_ITEM,
    method: 'POST',
    data,
  })
}

export const modifyExpenseItemApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('expenditureId', params.id)
  data.append('group', params.group)
  data.append('category', params.category)
  data.append('module', params.module)
  data.append('name', params.name)
  data.append('maintenanceName', params.maintenanceName)

  return request({
    url: AppApi.MODIFY_EXPENSE_ITEM,
    method: 'POST',
    data,
  })
}

export const getExpenditureUserListApi = () => {
  const data = new FormData()
  data.append('token', getToken())

  return request({
    url: AppApi.GET_USER_LIST,
    method: 'POST',
    data,
  })
}

/**
 * 上传品牌logo
 */
export const uploadBrandLogoApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('file', params.file)
  data.append('brandId', params.brandId)

  return request({
    url: AppApi.UPLOAD_BRAND_LOGO,
    method: 'POST',
    data,
  })
}

/**
 * 删除品牌
 */
export const deleteBrandApi = (brandId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('brandId', brandId)

  return request({
    url: AppApi.DELETE_BRAND,
    method: 'POST',
    data,
  })
}

/**
 * 创建推送任务
 * @param params
 * @param params.title 标题
 * @param params.content 内容
 * @param params.type 类型
 * @param params.obdVersions obd版本
 * @param params.appType app类型
 * @param params.pushUserIds 推送用户id
 * @param params.sentTime 发送时间
 *
 * @returns {Promise<ApiResponse<any>>}
 */
export const createPushTaskApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('title', params.title)
  data.append('content', params.content)
  data.append('type', params.type)
  params.obdVersions && data.append('obdVersions', params.obdVersions)
  params.appType && params.appType && data.append('appType', params.appType)
  params.pushUserIds && data.append('pushUserIds', params.pushUserIds)
  data.append('sentTime', params.sentTime)

  return request({
    url: AppApi.CREATE_PUSH_TASK,
    method: 'POST',
    data,
  })
}

/**
 * 删除推送任务
 * @param pushTaskIds
 *
 * @returns {Promise<ApiResponse<any>>}
 */
export const deletePushTaskApi = (pushTaskIds) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('pushTaskIds', pushTaskIds)

  return request({
    url: AppApi.DELETE_PUSH_TASK,
    method: 'POST',
    data,
  })
}

/**
 * 编辑推送任务
 * @param params
 * @param params.pushTaskId 推送任务id
 * @param params.title 标题
 * @param params.content 内容
 * @param params.type 类型
 * @param params.obdVersions obd版本
 * @param params.appType app类型
 * @param params.pushUserIds 推送用户id
 * @param params.sentTime 推送时间
 *
 * @returns {Promise<ApiResponse<any>>}
 */
export const editPushTaskApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('pushTaskId', params.pushTaskId)
  data.append('title', params.title)
  data.append('content', params.content)
  data.append('type', params.type)
  params.obdVersions && data.append('obdVersions', params.obdVersions)
  params.appType && data.append('appType', params.appType)
  params.pushUserIds && data.append('pushUserIds', params.pushUserIds)
  data.append('sentTime', params.sentTime)

  return request({
    url: AppApi.MODIFY_PUSH_TASK,
    method: 'POST',
    data,
  })
}

/**
 * 获取推送任务列表
 * @param params
 * @param params.searchKey 搜索关键字
 * @param params.types 类型
 * @param params.obdVersions obd版本
 * @param params.appTypes app类型
 * @param params.sort 排序字段
 * @param params.sortBy 排序方式
 * @param params.userKey 用户ids
 * @param params.sentStart 发送开始时间
 * @param params.sentEnd 推送结束
 * @param params.page 页码
 * @param params.pageSize 每页数量
 *
 * @returns {Promise<ApiResponse<any>>}
 */
export const getPushTaskListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('searchKey', params.searchKey)
  data.append('types', params.types)
  data.append('obdVersions', params.obdVersions)
  data.append('appTypes', params.appTypes)
  data.append('sort', params.sort)
  data.append('sortBy', params.sortBy)
  data.append('userIds', params.userKey)
  data.append('sentStart', params.sentStart)
  data.append('sentEnd', params.sentEnd)
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)

  return request({
    url: AppApi.GET_PUSH_TASK_LIST,
    method: 'POST',
    data,
  })
}

/**
 * 获取推送任务所推送的用户列表
 * @param pushTaskId
 */
export const getPushTaskUserListApi = (pushTaskId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('pushTaskId', pushTaskId)

  return request({
    url: AppApi.GET_PUSH_TASK_USER_LIST,
    method: 'POST',
    data,
  })
}

/**
 * 修改 ai 的回答文本
 *
 * @param params
 * @param params.recordId 记录的id
 * @param params.answer 回复内容
 */
export const modifyAiAnswerApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('recordId', params.id)
  data.append('answer', params.answer)

  return request({
    url: AppApi.MODIFY_AI_ANSWER_TEXT,
    method: 'POST',
    data,
  })
}

/**
 *  管理员获取用户ai使用次数
 *  @param userId (不传则默认获取所有用户的默认次数)
 *
 *  @returns {Promise<ApiResponse<any>>}
 */
export const getUserAiUseCountApi = (userId) => {
  const data = new FormData()
  data.append('token', getToken())
  userId && data.append('userId', userId)

  return request({
    url: AppApi.GET_USER_AI_USE_COUNT,
    method: 'POST',
    data,
  })
}

/**
 *  管理员修改用户ai使用次数
 *  @param params
 *  @param params.userId 用户id
 *  @param params.count 使用次数
 *
 *  @returns {Promise<ApiResponse<any>>}
 */
export const modifyUserAiUseCountApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  params.userId && data.append('userId', params.userId)
  data.append('count', params.count)

  return request({
    url: AppApi.MODIFY_USER_AI_USE_COUNT,
    method: 'POST',
    data,
  })
}

/**
 * 获取车辆品牌的预测列表
 *
 * @param brand 车辆品牌
 *
 * @returns {Promise<ApiResponse<any>>}
 */
export const getPredictBrandListApi = (brand) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('brand', brand)

  return request({
    url: AppApi.GET_PREDICT_LIST,
    method: 'POST',
    data,
  })
}

/**
 * 获取预测子项名称列表
 *
 * @returns {Promise<ApiResponse<any>>}
 */
export const getPredictSubItemNameListApi = () => {
  const data = new FormData()
  data.append('token', getToken())

  return request({
    url: AppApi.GET_PREDICT_NAME_LIST,
    method: 'POST',
    data,
  })
}

/**
 * 新增预测数据
 *
 * @param params
 * @param params.name 名称
 * @param params.brand  品牌
 * @param params.mileage 里程
 * @param params.day 天数
 *
 * @returns {Promise<ApiResponse<any>>}
 */
export const createPredictItemApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('name', params.name)
  data.append('brand', params.brand)
  data.append('mileage', params.mileage)
  data.append('day', params.day)

  return request({
    url: AppApi.ADD_PREDICT_DATA,
    method: 'POST',
    data,
  })
}

/**
 * 删除预测数据
 *
 * @param id
 *
 * @returns {Promise<ApiResponse<any>>}
 */
export const deletePredictItemApi = (id) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('id', id)
  return request({
    url: AppApi.DELETE_PREDICT_DATA,
    method: 'POST',
    data,
  })
}

/**
 * 新增预测数据的OEM信息
 * @param params
 * @param params.predictionId 预测id
 * @param params.dataName 数据名称
 * @param params.ecuName ECU名称
 * @param params.remark 备注
 *
 * @returns {Promise<ApiResponse<any>>}
 */
export const createPredictOemDataApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('predictionId', params.predictionId)
  data.append('dataName', params.dataName)
  data.append('ecuName', params.ecuName)
  data.append('remark', params.remark)

  return request({
    url: AppApi.ADD_PREDICT_OEM_INFO,
    method: 'POST',
    data,
  })
}

/**
 * 获取品牌的OEM实时信息
 * @param params
 * @param params.brand  品牌
 * @param params.searchKey 搜索关键字
 *
 * @returns {Promise<ApiResponse<any>>}
 */
export const getBrandOemRealTimeInfoApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('brand', params.brand)
  data.append('searchKey', params.searchKey)

  return request({
    url: AppApi.GET_BRAND_OEM_REALTIME_List,
    method: 'POST',
    data,
  })
}

/**
 * 编辑预测的OEM实时信息
 * @param params
 * @param params.id 预测id
 * @param params.dataName 数据名称
 * @param params.ecuName ECU名称
 * @param params.remark 备注
 *
 * @returns {Promise<ApiResponse<any>>}
 */
export const modifyPredictOemDataApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('id', params.id)
  data.append('dataName', params.dataName)
  data.append('ecuName', params.ecuName)
  data.append('remark', params.remark)

  return request({
    url: AppApi.MODIFY_PREDICT_OEM_INFO,
    method: 'POST',
    data,
  })
}
