/**
 * @file obdApi.js
 * @description OBD Management 模块的接口文件
 */

// 统一接口管理
import { useAuthToken } from '@/composables/useAuthToken.js'
import request from '@/utils/request.js'

const ObdApi = Object.freeze({
  // 获取 OBD 列表
  GET_OBD_LIST: '/manager/obds/get',
  // 解绑 OBD
  UNBIND_OBD: '/manager/obd/unbind',
  // 关闭 OBD
  CLOSE_OBD: '/manager/obd/close',
  // 获取 OBD 详情
  GET_OBD_DETAIL: '/manager/obd/info',
  // 修改 OBD
  EDIT_OBD: '/manager/obd/edit',
  // 获取 OBD 绑定过的账号历史信息
  GET_OBD_BIND_HISTORY: '/manager/obd/users',
  // 获取 OBD 绑过的车辆信息列表
  GET_OBD_BIND_VEHICLES: '/manager/obd/vehicles',
  // 获取 OBD 绑过的车辆信息
  GET_OBD_BIND_VEHICLE_DETAIL: '/manager/vehicle/info',
  // 获取obd操作记录
  GET_OBD_OPERATION_RECORDS: '/manager/obd/logs',
  // 获取车辆 dtc 历史列表
  GET_VEHICLE_SCAN_RECORDS: '/manager/dtc/dtcs',
  // 获取车辆 dtc 详情
  GET_VEHICLE_SCAN_RECORD_DETAIL: '/manager/dtc/info',
  // 编辑车辆信息
  EDIT_VEHICLE: '/manager/vehicle/edit',
  // 获取 OBD 版本号列表
  GET_OBD_VERSION_LIST: '/manager/obd/versions',
  // 删除 DTC 记录
  DELETE_DTC_RECORD: '/manager/dtc/delete',
  // 获取DTC描述
  GET_DTC_DESC: '/dtc/getfaultcodeinfo',
  // 修改AI故障信息
  EDIT_AI_FAULT_INFO: '/manager/dtc/editfaultcode',
})

// 获取 token
const { getToken } = useAuthToken()

// 获取 OBD 列表
/**
 * @param {{ searchKey?: string, page?: string, pageSize?: string, userKey?: number, sortKey?: string, sort?: string }} params
 * @returns {Promise<ApiResponse<OBDItem[]>>}
 */
export const getOBDListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('searchKey', params.searchKey)
  data.append('userKey', params.userKey)
  data.append('statusKey', params.statusKey)
  data.append('sortKey', params.sortKey)
  data.append('sort', params.sort)
  data.append('page', params.page)
  data.append('pageSize', params?.pageSize)

  return request({
    url: ObdApi.GET_OBD_LIST,
    method: 'POST',
    data,
  })
}

/**
 * 解绑 OBD
 * @param odbIds
 * @returns {Promise<ApiResponse<any>>}
 */
export const unbindOBDApi = (odbIds) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('obdIds', odbIds)

  return request({
    url: ObdApi.UNBIND_OBD,
    method: 'POST',
    data,
  })
}

/**
 * 关闭 OBD
 * @param odbIds
 * @returns {Promise<ApiResponse<any>>}
 */
export const closeOBDApi = (odbIds) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('obdIds', odbIds)

  return request({
    url: ObdApi.CLOSE_OBD,
    method: 'POST',
    data,
  })
}

/**
 * 获取 OBD 信息
 * @param obdId obd id
 * @returns {*}
 */
export const getOBDInfoApi = (obdId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('obdId', obdId)

  return request({
    url: ObdApi.GET_OBD_DETAIL,
    method: 'POST',
    data,
  })
}

/**
 * 获取 OBD 绑定历史
 * @param obdId
 * @returns {*}
 */
export const getOBDBindHistoryApi = (obdId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('obdId', obdId)

  return request({
    url: ObdApi.GET_OBD_BIND_HISTORY,
    method: 'POST',
    data,
  })
}

/**
 * 获取 OBD 绑定车辆
 * @param obdId
 * @returns {*}
 */
export const getOBDBindVehiclesApi = (obdId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('obdId', obdId)

  return request({
    url: ObdApi.GET_OBD_BIND_VEHICLES,
    method: 'POST',
    data,
  })
}

/**
 * 获取车辆信息
 * @param vehicleId 车辆 id
 * @returns {*}
 */
export const getVehicleInfoApi = (vehicleId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('vehicleId', vehicleId)
  return request({
    url: ObdApi.GET_OBD_BIND_VEHICLE_DETAIL,
    method: 'POST',
    data,
  })
}

/**
 * 获取 OBD 操作记录
 * @param params
 * @param params.obdId obd id
 * @param params.page 页码
 * @param params.pageSize 每页数量
 * @returns {*}
 */
export const getOBDOperationRecordsApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('obdId', params.obdId)
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)

  return request({
    url: ObdApi.GET_OBD_OPERATION_RECORDS,
    method: 'POST',
    data,
  })
}

/**
 * 获取车辆 dtc 历史列表
 * @param params
 * @param params.vehicleId 车辆 id
 * @param params.searchKey 搜索关键字
 * @param params.sortKey 排序字段
 * @param params.sort 排序方式
 * @param params.page 页码
 * @param params.pageSize 每页数量
 * @returns {*}
 */
export const getVehicleScanRecordsApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  params.vehicleId && data.append('vehicleId', params.vehicleId)
  params.searchKey && data.append('searchKey', params.searchKey)
  data.append('sortKey', params.sortKey)
  data.append('sort', params.sort)
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)

  return request({
    url: ObdApi.GET_VEHICLE_SCAN_RECORDS,
    method: 'POST',
    data,
  })
}

/**
 * 关闭 OBD
 * @param params
 * @param params.obdId obd id
 * @param params.remark 秒速
 * @returns {*}
 */
export const editOBDApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('obdId', params.obdId)
  data.append('remark', params.remark)

  return request({
    url: ObdApi.EDIT_OBD,
    method: 'POST',
    data,
  })
}

/**
 * 获取车辆 dtc 详情
 * @param dtcId
 * @returns {*}
 */
export const getVehicleScanRecordDetailApi = (dtcId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('dtcId', dtcId)

  return request({
    url: ObdApi.GET_VEHICLE_SCAN_RECORD_DETAIL,
    method: 'POST',
    data,
  })
}

/**
 * 编辑车辆信息
 * @param params
 * @param params.vehicleId 车辆 id
 * @param params.licensePlate 车牌号
 * @param params.vin VIN
 * @param params.brand 品牌
 * @param params.model 型号
 * @param params.year 年份
 * @param params.name 名称
 * @param params.coverPath 封面图片路径
 * @param params.selected 是否选中
 * @param params.mileage 行驶里程
 * @param params.linkBrand 联动品牌
 * @param params.linkDevTop 联动设备
 * @param params.obdId OBD id
 * @returns {*}
 */
export const editVehicleApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())

  // 遍历需要的字段，存在才 append
  const fields = [
    'vehicleId',
    'licensePlate',
    'vin',
    'brand',
    'model',
    'year',
    'name',
    'coverPath',
    'selected',
    'mileage',
    'linkBrand',
    'linkDevTop',
    'obdId',
  ]

  fields.forEach((key) => {
    const value = params[key]
    if (value !== undefined && value !== null && value !== '') {
      data.append(key, value)
    }
  })

  return request({
    url: ObdApi.EDIT_VEHICLE,
    method: 'POST',
    data,
  })
}

/**
 * 获取obd版本号列表
 */
export const getOBDVersionListApi = () => {
  const data = new FormData()
  data.append('token', getToken())

  return request({
    url: ObdApi.GET_OBD_VERSION_LIST,
    method: 'POST',
    data,
  })
}

/**
 * 删除 DTC 记录
 * @param dtcIds DTC ids
 * @returns {Promise<ApiResponse<any>>}
 */
export const deleteDtcRecordApi = (dtcIds) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('dtcIds', dtcIds)

  return request({
    url: ObdApi.DELETE_DTC_RECORD,
    method: 'POST',
    data,
  })
}

/**
 * 获取DTC描述
 * @param param
 * @param param.vehicleId 车辆 id
 * @param param.code DTC错误码
 * @param param.title DTC错误码名称
 * @param param.dtcName ECU名称
 *
 *
 * @returns {Promise<ApiResponse<any>>}
 */
export const getFaultCodeInfoApi = (param) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('vehicleId', param.vehicleId)
  data.append('code', param.code)
  data.append('title', param.title)
  data.append('dtcName', param.dtcName)

  return request({
    url: ObdApi.GET_DTC_DESC,
    method: 'POST',
    data,
  })
}

/**
 * 管理员修改AI故障信息
 * @param param
 * @param param.faultCodeId 故障码 id
 * @param param.code 错误码
 * @param param.title 错误码名称
 * @param param.dtcName ECU名称
 * @param param.description 描述
 * @param param.symptoms 症状
 * @param param.levelDescription 级别描述
 * @param param.part 部件预计花费成本区间
 * @param param.labour 工时预计花费成本区间
 * @param param.total 总价预计花费成本区间
 * @param param.brand  品牌
 * @param param.model 型号
 * @param param.level 维修评估
 * @param param.year 年份
 *
 * @returns {Promise<ApiResponse<any>>}
 */

export const editFaultCodeInfoApi = (param) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('faultCodeId', param.faultCodeId)
  data.append('code', param.code)
  data.append('title', param.title)
  data.append('dtcName', param.dtcName)
  data.append('description', param.description)
  data.append('symptoms', param.symptoms)
  data.append('levelDescription', param.levelDescription)
  data.append('part', param.part)
  data.append('labour', param.labour)
  data.append('total', param.total)
  param.brand && data.append('brand', param.brand)
  param.model && data.append('model', param.model)
  data.append('level', param.level)
  param.year && data.append('year', param.year)

  return request({
    url: ObdApi.EDIT_AI_FAULT_INFO,
    method: 'POST',
    data,
  })
}
