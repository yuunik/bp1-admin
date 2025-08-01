import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { loginApi } from '@/apis/loginApi.js'
import { useLocalStorage } from '@vueuse/core'

const useUserStore = defineStore('user', () => {
  // state
  const userInfo = ref({}) // 用户信息
  const token = useLocalStorage('token', '') // 用户令牌
  const isLoading = ref(false) // 登录状态

  // actions
  const login = async (email, password) => {
    isLoading.value = true
    const { code, data, msg } = await loginApi(email, password)
    try {
      if (code === 0) {
        // 登录成功
        userInfo.value = data
        // token 本地持久化
        token.value = data.token
        return 'login success'
      } else {
        // 抛处异常
        return Promise.reject(new Error(msg))
      }
    } finally {
      isLoading.value = false
    }
  }

  // getters
  const username = computed(() => userInfo.value?.name || '') // 用户名字
  const userRole = computed(() => userInfo.value?.role || 'Admin') // 用户角色户令牌
  const usernameAbbr = computed(() => userInfo.value?.name?.slice(0, 1) || '') // 用户名字缩写
  const hasUserInfo = computed(() => Boolean(userInfo.value?.id)) // 是否有用户信息

  return {
    // state
    userInfo,
    token,
    isLoading,
    // actions
    login,
    // getters
    username,
    userRole,
    usernameAbbr,
    hasUserInfo,
  }
})

export default useUserStore
