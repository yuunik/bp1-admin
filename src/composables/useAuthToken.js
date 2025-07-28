import { useLocalStorage } from '@vueuse/core'

export const useAuthToken = () => {
  const token = useLocalStorage('token', null)

  const setToken = (token) => (token.value = token)

  const getToken = () => token.value || ''

  const clearToken = () => (token.value = '')

  return {
    token,
    clearToken,
    getToken,
    setToken,
  }
}
