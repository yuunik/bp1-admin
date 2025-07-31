/**
 * @file app 分享页面模块的接口文件
 */
import request from '@/utils/request.js'

// 统一管理 api
const ShareApi = Object.freeze({
  // 论坛分享
  GET_FORUM_INFO: '/forum/info',
})

/**
 * 获取论坛详情
 * @param id 论坛id
 * @returns {Promise<ApiResponse<ForumInfo>>}
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
