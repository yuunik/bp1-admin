import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { loginApi, logoutApi } from '@/apis/loginApi.js'
import { useLocalStorage } from '@vueuse/core'
import { adminInfoApi } from '@/apis/userCenterApi.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'

const useUserStore = defineStore('user', () => {
  // state
  const userInfo = useLocalStorage('userInfo', {}) // 用户信息
  const token = useLocalStorage('token', '') // 用户令牌
  const isLoading = ref(false) // 登录状态

  // actions
  // 获取用户信息
  const fetchGetUserInfo = async () => {
    const { code, data, msg } = await adminInfoApi({
      userId: '',
    })
    if (code === 0) {
      // 重新获取用户信息
      userInfo.value = data
      return 'get userInfo successfully'
    } else {
      // 抛出异常
      return new Error(msg)
    }
  }

  // 用户登录
  const login = async (loginParams) => {
    try {
      isLoading.value = true
      const { code, data, msg } = await loginApi({
        email: loginParams.email,
        password: loginParams.password,
      })
      if (code === 0) {
        // 登录成功, 获取用户信息
        userInfo.value = data
        // 获取 token 信息
        token.value = data.token
        return 'login success'
      } else {
        // 抛出异常
        return new Error(msg)
      }
    } finally {
      isLoading.value = false
    }
  }

  // 用户登出
  const logout = async () => {
    const { code, msg } = await logoutApi()
    if (code === 0) {
      // 清除 token 信息
      token.value = ''
      // 清除用户信息
      userInfo.value = {}
      return 'logout success'
    } else {
      return Promise.reject(new Error(msg))
    }
  }

  // 清除用户信息
  const clearInfo = async () => {
    token.value = ''
    userInfo.value = {}
  }

  // getters
  const userId = computed(() => userInfo.value?.id || '')
  const username = computed(() => userInfo.value?.name || '') // 用户名字
  const userRole = computed(() => userInfo.value?.role || '') // 用户角色户令牌
  const usernameAbbr = computed(() => userInfo.value?.name?.slice(0, 1) || '') // 用户名字缩写
  const userAvatar = computed(() => getFullFilePath(userInfo.value?.avatar))
  const hasUserInfo = computed(() => Boolean(userInfo.value?.id)) // 是否有用户信息

  return {
    // state
    userInfo,
    token,
    isLoading,
    // actions
    login,
    logout,
    clearInfo,
    fetchGetUserInfo,
    // getters
    userId,
    username,
    userRole,
    usernameAbbr,
    userAvatar,
    hasUserInfo,
  }
})

export default useUserStore
