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
})

// 获取 token
const { getToken } = useAuthToken()

export const getForumListApi = (params) => {
  const data = new FormData()
  data.append('token', getToken())
  data.append('page', params.page)
  data.append('pageSize', params.pageSize)
  data.append('searchKey', params.searchKey)
  data.append('type', params.type)

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
  data.append('type', params.type)

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
