import useRouteSettingsStore from '@/store/modules/routeSettings.js'

/**
 * 缓存函数
 *
 * @returns {(function(*): void)|*}
 */
const useCacheView = () => {
  // 路由数据的状态管理库
  const { addKeepAliveRoute } = useRouteSettingsStore()

  return (routeName) => addKeepAliveRoute(routeName)
}

export default useCacheView
