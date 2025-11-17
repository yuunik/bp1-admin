/**
 * @file forumApi.js
 * @description Forum Management 模块的接口文件
 */
import request from '@/utils/request.js'
import { useAuthToken } from '@/composables/useAuthToken.js'

const ForumApi = Object.freeze({
  // 获取论坛接口
  GET_FORUM_LIST: '/forum/forums',
  // 获取评论接口
  GET_COMMENT_LIST: '/manager/comment/comments',
  // 删除论坛接口
  DELETE_FORUM: '/manager/forum/delete',
  // 删除评论接口
  DELETE_COMMENT: '/manager/comment/delete',
  // 获取论坛详情接口
  GET_FORUM_INFO: '/forum/info',
  // 获取评论详情接口
  GET_COMMENT_INFO: '/comment/info',
  // 获取举报列表
  GET_REPORT_LIST: '/manager/tipoff/tipoffs',
  // 获取贴文所属的评论列表
  GET_COMMENT_LIST_BY_FORUM: '/comment/get',
})

// 获取 token
const { getToken } = useAuthToken()

/**
 * 获取论坛列表
 * @param params
 * @param params.page
 * @param params.pageSize
 * @param params.sort
 * @param params.sortBy
 * @param params.searchKey
 * @param params.type
 * @param params.clubIds
 *
 * @returns {*}
 */
export const getForumListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)
  data.append('sort', params.sort)
  data.append('sortBy', params.sortBy)
  params.searchKey && data.append('searchKey', params.searchKey)
  params.type && data.append('type', params.type)
  params.clubIds && data.append('clubIds', params.clubIds)

  return request({
    url: ForumApi.GET_FORUM_LIST,
    method: 'POST',
    data,
  })
}

export const getCommentListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)
  data.append('searchKey', params.searchKey)
  data.append('sortBy', params.sortBy)
  data.append('sort', params.sort)
  params.type && data.append('type', params.type)

  return request({
    url: ForumApi.GET_COMMENT_LIST,
    method: 'POST',
    data,
  })
}

export const deleteForumApi = (forumId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('forumId', forumId)

  return request({
    url: ForumApi.DELETE_FORUM,
    method: 'POST',
    data,
  })
}

export const deleteCommentApi = (commentId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('commentId', commentId)
  return request({
    url: ForumApi.DELETE_COMMENT,
    method: 'POST',
    data,
  })
}

export const getForumInfoApi = (forumId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('forumId', forumId)

  return request({
    url: ForumApi.GET_FORUM_INFO,
    method: 'POST',
    data,
  })
}

export const getCommentInfoApi = (commentId) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('commentId', commentId)

  return request({
    url: ForumApi.GET_COMMENT_INFO,
    method: 'POST',
    data,
  })
}

// 获取贴文或评论的举报数据列表
export const getReportListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('parentIds', params.parentIds)
  data.append('types', params.types)
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)

  return request({
    url: ForumApi.GET_REPORT_LIST,
    method: 'POST',
    data,
  })
}

// 获取贴文所属的评论列表
export const getCommentListByForumApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('parentId', params.postId)
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)

  return request({
    url: ForumApi.GET_COMMENT_LIST_BY_FORUM,
    method: 'POST',
    data,
  })
}
