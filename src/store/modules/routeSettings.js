import { ref } from 'vue'
import { defineStore } from 'pinia'

const useRouteSettingsStore = defineStore('routeSettings', () => {
  // state
  const keepAliveRouteList = ref([])

  // 清除指定缓存路由
  const clearKeepAliveRoute = (routeName) =>
    (keepAliveRouteList.value = keepAliveRouteList.value.filter(
      (item) => item !== routeName,
    ))

  // 清空所有缓存路由
  const clearAllKeepAliveRoute = () => (keepAliveRouteList.value = [])

  // 新增缓存路由
  const addKeepAliveRoute = (routeName) => {
    // 缓存路由列表中已存在该路由则不添加
    if (keepAliveRouteList.value.includes(routeName)) return
    // 添加缓存路由
    keepAliveRouteList.value = [...keepAliveRouteList.value, routeName]
  }

  return {
    // state
    keepAliveRouteList,
    // actions
    clearKeepAliveRoute,
    clearAllKeepAliveRoute,
    addKeepAliveRoute,
  }
})

export default useRouteSettingsStore
