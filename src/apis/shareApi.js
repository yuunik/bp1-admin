/**
 * @file shareApp.js
 * @description app 分享页面模块的接口文件
 */
import request from '@/utils/request.js'

// 统一管理 api
const ShareApi = Object.freeze({
  // 论坛分享
  GET_FORUM_INFO: '/forum/infobyguest',
  // ai 问答详情分享
  GET_AI_QUESTION_INFO: '/aichat/info',
  // 获取车辆报告详情
  GET_VEHICLE_REPORT_INFO: '/report/getreportinfo',
  // 获取车辆 DTCs 报告详情
  GET_VEHICLE_DTC_REPORT_INFO: '/dtc/getdtcreportinfo',
})

/**
 * 获取论坛详情
 * @param id 论坛id
 * @returns {Promise<ApiResponse<ForumPost>>}
 */
export const getForumInfoApi = (id) => {
  const data = new FormData()
  data.append('forumId', id)
  return request({
    url: ShareApi.GET_FORUM_INFO,
    method: 'POST',
    data,
  })
}

/**
 * 获取ai问答详情
 * @param id ai问答id
 * @returns {Promise<ApiResponse<AiQuestionInfo>>}
 */
export const getAiQuestionInfoApi = (id) => {
  const data = new FormData()
  data.append('aiChatId', id)
  return request({
    url: ShareApi.GET_AI_QUESTION_INFO,
    method: 'POST',
    data,
  })
}

/**
 * 获取车辆报告详情
 * @param id 车辆报告id
 * @returns {Promise<ApiResponse<VehicleReport>>}
 */
export const getVehicleReportInfoApi = (id) => {
  const data = new FormData()
  data.append('reportId', id)
  return request({
    url: ShareApi.GET_VEHICLE_REPORT_INFO,
    method: 'POST',
    data,
  })
}

/**
 * 获取车辆 DTCs 报告详情
 * @param id 车辆 DTCs 报告id
 * @returns {Promise<ApiResponse<VehicleDtcReport>>}
 */
export const getVehicleDtcReportInfoApi = (id) => {
  const data = new FormData()
  data.append('reportId', id)
  return request({
    url: ShareApi.GET_VEHICLE_DTC_REPORT_INFO,
    method: 'POST',
    data,
  })
}

/**
 * 获取图片的 base64 格式
 * @param url 图片的 url
 * @returns {Promise<string>}
 */
export const getImgUrlToBase64 = async (url) => {
  // 图片地址为空
  if (!url) {
    return ''
  }
  const response = await fetch(url)
  const blob = await response.blob()
  const reader = new FileReader()
  reader.onloadend = () => reader.result
  reader.onerror = () => ''
  reader.readAsDataURL(blob)
}
