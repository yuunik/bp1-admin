import request from '@/utils/request.js'
import { useAuthToken } from '@/composables/useAuthToken.js'

const ClubApi = Object.freeze({
  // 获取俱乐部接口
  GET_CLUB_LIST: '/club/list',
  // 新增俱乐部接口
  ADD_CLUB: '/manager/club/add',
  // 编辑俱乐部接口
  EDIT_CLUB: '/manager/club/edit',
  // 删除俱乐部接口
  DELETE_CLUB: '/manager/club/delete',
  // 获取俱乐部成员
  GET_CLUB_MEMBER: '/club/getuser',
  // 获取俱乐部详情
  GET_CLUB_INFO: '/club/getinfo',
  // 管理员批准俱乐部
  APPROVE_CLUB: '/manager/club/approve',
  // 管理员拒绝俱乐部
  REJECT_CLUB: '/manager/club/reject',
  // 俱乐部管理员禁用/启用俱乐部
  MANAGE_CLUB: '/manager/club/disable',
})

// 获取 token
const { getToken } = useAuthToken()

export const getClubListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)
  data.append('searchKey', params.searchKey)
  data.append('sortBy', params.sortBy)
  data.append('sort', params.sort)
  data.append('status', params.status)

  return request({
    url: ClubApi.GET_CLUB_LIST,
    method: 'POST',
    data,
  })
}

export const addClubApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('name', params.name)
  data.append('description', params.description)
  data.append('file', params.logo)

  return request({
    url: ClubApi.ADD_CLUB,
    method: 'POST',
    data,
  })
}

export const editClubApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('clubId', params.id)
  data.append('name', params.name)
  data.append('description', params.description)
  typeof params.logo !== 'string' && data.append('file', params.logo)

  return request({
    url: ClubApi.EDIT_CLUB,
    method: 'POST',
    data,
  })
}

export const deleteClubApi = (clubIds) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('clubIds', clubIds)

  return request({
    url: ClubApi.DELETE_CLUB,
    method: 'POST',
    data,
  })
}

export const getClubMemberApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('clubId', params.clubId)
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)

  return request({
    url: ClubApi.GET_CLUB_MEMBER,
    method: 'POST',
    data,
  })
}

export const getClubInfoApi = (clubId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('id', clubId)

  return request({
    url: ClubApi.GET_CLUB_INFO,
    method: 'POST',
    data,
  })
}

/**
 * 俱乐部管理员批准俱乐部
 * @param clubId 俱乐部ID
 */
export const approveClubApi = (clubId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('clubId', clubId)

  return request({
    url: ClubApi.APPROVE_CLUB,
    method: 'POST',
    data,
  })
}

/**
 * 俱乐部管理员拒绝俱乐部
 * @param params
 * @param params.clubId 俱乐部ID
 * @param params.reason 拒绝理由
 *
 * @returns
 */
export const rejectClubApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('clubId', params.clubId)
  data.append('reason', params.reason)

  return request({
    url: ClubApi.REJECT_CLUB,
    method: 'POST',
    data,
  })
}

/**
 * 俱乐部管理员禁用/启用俱乐部
 * @param clubId 俱乐部ID
 *
 * @returns
 */
export const manageClubApi = (clubId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('clubId', clubId)

  return request({
    url: ClubApi.MANAGE_CLUB,
    method: 'POST',
    data,
  })
}
