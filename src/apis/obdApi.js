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
  // 获取 OBD 绑定过的账号历史信息
  GET_OBD_BIND_HISTORY: '/manager/obd/users',
  // 获取 OBD 绑过的车辆信息列表
  GET_OBD_BIND_VEHICLES: '/manager/obd/vehicles',
  // 获取 OBD 绑过的车辆信息
  GET_OBD_BIND_VEHICLE_DETAIL: '/manager/vehicle/info',
})

// 获取 token
const { getToken } = useAuthToken()

// 获取 OBD 列表
/**
 * @param {{ searchKey?: string, page?: string, pageSize?: string }} params
 * @returns {Promise<ApiResponse<OBDItem[]>>}
 */
export const getOBDListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('searchKey', params?.searchKey ?? '')
  data.append('page', params?.page ?? 1)
  data.append('pageSize', params?.pageSize ?? 10)

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
    url: ObdApi.ET_OBD_BIND_VEHICLE_DETAIL,
    method: 'POST',
    data,
  })
}
