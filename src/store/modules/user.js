import { defineStore } from 'pinia'
import { loginApi } from '@/apis/login.js'

const useUserStore = defineStore('user', () => {
  // state
  const userInfo = ref({}) // 用户信息

  // actions
  const login = async (email, password) => {
    const { code, data, msg } = await loginApi(email, password)
    if (code === 0) {
      // 登录成功
      userInfo.value = data
      return 'login success'
    } else {
      // 抛处异常
      return new Promise.reject(new Error(msg))
    }
  }

  // getters
  const username = computed(() => userInfo.value?.name || '') // 用户名字
  const userRole = computed(() => userInfo.value?.role || 'Admin') // 用户角色
  const token = computed(() => userInfo.value?.token || '') // 用户令牌
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
