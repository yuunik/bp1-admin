import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { loginApi } from '@/apis/login.js'
import { useLocalStorage } from '@vueuse/core'

const useUserStore = defineStore('user', () => {
  // state
  const userInfo = ref({}) // 用户信息
  const token = useLocalStorage('token', '') // 用

  // actions
  const login = async (email, password) => {
    const { code, data, msg } = await loginApi(email, password)
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
  }

  // getters
  const username = computed(() => userInfo.value?.name || '') // 用户名字
  const userRole = computed(() => userInfo.value?.role || 'Admin') // 用户角色户令牌
  const usernameAbbr = computed(() => userInfo.value?.name?.slice(0, 1) || '') // 用户名字缩写

  return {
    // state
    userInfo,
    // actions
    login,
    // getters
    username,
    userRole,
    usernameAbbr,
    token,
  }
})

export default useUserStore
