/**
 * @file userCenterApi.js
 * @description 用户中心设置模块的接口文件
 */
import request from '@/utils/request.js'
import { useAuthToken } from '@/composables/useAuthToken.js'

// 统一管理api请求
const UserCenterApi = Object.freeze({
  // 忘记密码发送验证码
  FORGET_PASSWORD_SEND_CODE: '/manager/forgetpassword',
  // 管理员重置密码(忘记密码)
  RESET_ADMIN_PASSWORD: '/manager/resetpassword',
  // 管理员修改密码
  MODIFY_ADMIN_PASSWORD: '/manager/changepassword',
  // 删除管理员
  DELETE_ADMIN: '/manager/delete',
  // 禁用, 解禁管理员
  ADMIN_STATUS: '/manager/banned',
  // 管理员上传 logo
  UPLOAD_ADMIN_LOGO: '/manager/uploadlogo',
  // 管理员编辑个人信息
  EDIT_ADMIN_INFO: '/manager/edit',
  // 管理员详情
  ADMIN_INFO: '/manager/info',
  // 获取管理员列表
  GET_ADMIN_LIST: '/manager/managers',
})

// 获取 token
const { getToken } = useAuthToken()

/**
 * 忘记密码发送验证码
 * @param email
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const forgetPasswordSendCodeApi = (email) => {
  const data = new FormData()
  data.append('email', email)

  return request({
    url: UserCenterApi.FORGET_PASSWORD_SEND_CODE,
    method: 'POST',
    data,
  })
}

/**
 * 重置管理员密码
 * @param params
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const resetAdminPasswordApi = (params) => {
  const data = new FormData()
  data.append('code', params.code)
  data.append('password', params.newPassword)
  data.append('confirmPassword', params.confirmPassword)

  return request({
    url: UserCenterApi.RESET_ADMIN_PASSWORD,
    method: 'POST',
    data,
  })
}

/**
 * 修改管理员密码
 * @param params
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const modifyAdminPasswordApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('userId', params.userId)
  data.append('oldPassword', params.oldPassword)
  data.append('password', params.password)
  return request({
    url: UserCenterApi.MODIFY_ADMIN_PASSWORD,
    method: 'POST',
    data,
  })
}

/**
 * 删除管理员
 * @param userId
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const deleteAdminApi = (userId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('userId', userId)
  return request({
    url: UserCenterApi.DELETE_ADMIN,
    method: 'POST',
    data,
  })
}

/**
 * 禁用, 解禁管理员
 * @param userId
 * @param status
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const adminStatusApi = (userId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('userId', userId)
  return request({
    url: UserCenterApi.ADMIN_STATUS,
    method: 'POST',
    data,
  })
}

/**
 * 上传管理员logo
 * @param params
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const uploadAdminLogoApi = (file) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('file', file)
  return request({
    url: UserCenterApi.UPLOAD_ADMIN_LOGO,
    method: 'POST',
    data,
  })
}

/**
 * 修改管理员信息
 * @param params
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const editAdminInfoApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('userId', params.userId)
  data.append('name', params.name)

  return request({
    url: UserCenterApi.EDIT_ADMIN_INFO,
    method: 'POST',
    data,
  })
}

/**
 * 获取管理员信息
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const adminInfoApi = (userId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('userId', userId)
  return request({
    url: UserCenterApi.ADMIN_INFO,
    method: 'POST',
    data,
  })
}

/**
 * 获取管理员列表
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getAdminListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('searchKey', params.searchKey)
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)

  return request({
    url: UserCenterApi.GET_ADMIN_LIST,
    method: 'POST',
    data,
  })
}
