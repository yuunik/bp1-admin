/**
 * @description OBD Manager 模块的接口文件
 */

// 统一接口管理
import { useAuthToken } from '@/composables/useAuthToken.js'
import request from '@/utils/request.js'

const ObdApi = Object.freeze({
  // 获取 OBD 列表
  GET_OBD_LIST: '/manager/obds/get',
})

// 获取 OBD 列表
/**
 * @param {{ searchKey?: string, page?: string, pageSize?: string }} params
 * @returns {Promise<ApiResponse<OBDItem[]>>}
 */
export const getOBDListApi = (params) => {
  const data = new FormData()
  // 获取 token
  const { getToken } = useAuthToken()
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
