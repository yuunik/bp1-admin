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
  // 新增俱乐部成员
  ADD_CLUB_MEMBER: '/manager/club/adduser',
  // 管理员批准用户
  APPROVE_USER: '/manager/club/approveuser',
  // 管理员拒绝用户
  REJECT_USER: '/manager/club/rejectuser',
  // 管理员设置或移除admin
  MANAGE_CLUB_ADMIN: '/manager/club/admin',
  // 管理员删除用户
  DELETE_CLUB_MEMBER: '/manager/club/deleteuser',
  // 获取俱乐部日志列表
  GET_CLUB_LOG: '/manager/clublog/clublogs',
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
  data.append('isOwner', params.role)
  data.append('searchKey', params.searchKey)
  data.append('sort', params.sort)
  data.append('sortBy', params.sortBy)

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

/**
 * 新增俱乐部成员
 * @param params
 * @param params.clubId 俱乐部ID
 * @param params.userId 用户ID
 * @returns
 */
export const addClubMemberApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('clubId', params.clubId)
  data.append('userId', params.userId)

  return request({
    url: ClubApi.ADD_CLUB_MEMBER,
    method: 'POST',
    data,
  })
}

/**
 * 管理员批准用户
 * @param userId
 * @returns
 */
export const approveUserApi = (userId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('userId', userId)

  return request({
    url: ClubApi.APPROVE_USER,
    method: 'POST',
    data,
  })
}

/**
 * 管理员拒绝用户
 * @param params
 * @param params.userId 用户ID
 * @param params.reason 拒绝理由
 * @returns
 */
export const rejectUserApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('userId', params.userId)
  data.append('reason', params.reason)

  return request({
    url: ClubApi.REJECT_USER,
    method: 'POST',
    data,
  })
}

/**
 * 管理员设置或移除管理员
 * @param userId
 * @returns
 */
export const manageClubAdminApi = (userId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('userId', userId)

  return request({
    url: ClubApi.MANAGE_CLUB_ADMIN,
    method: 'POST',
    data,
  })
}

/**
 * 管理员删除用户
 * @param userId
 * @returns
 */
export const deleteClubMemberApi = (userId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('userId', userId)

  return request({
    url: ClubApi.DELETE_CLUB_MEMBER,
    method: 'POST',
    data,
  })
}

/**
 * 获取俱乐部日志列表
 * @param params
 * @param params.clubId 俱乐部ID
 * @param params.page 页码
 * @param params.pageSize 页大小
 *
 * @returns
 */
export const getClubLogApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('clubId', params.clubId)
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)

  return request({
    url: ClubApi.GET_CLUB_LOG,
    method: 'POST',
    data,
  })
}
