/**
 * @file useAppLauncher.js
 * @description app启动器
 */
import { ref } from 'vue'

import { ShareRoutePath } from '@/utils/constantsUtil.js'

const useAppLauncher = () => {
  // 计时器
  const timer = ref(null)

  // 跳转app
  const launchApp = () => {
    // 获取设备信息
    const useAgent = navigator.userAgent.toLowerCase()
    // 是否为安卓设备
    const isAndroid = /android/i.test(useAgent)
    // 是否为ios设备
    const isIOS = /iphone|ipad|ipod/i.test(useAgent)
    // 尝试打开应用
    window.location.href = ShareRoutePath.APP_URL

    // 未安装应用时(超时未唤起), 则跳转到应用市场
    timer.value = setTimeout(() => {
      // 如果用户没跳出页面，大概率是点击了“取消”
      if (!document.hidden) {
        return
      }
      if (isIOS) {
        window.location.href = ShareRoutePath.APPLE_APP_STORE_URL
      } else if (isAndroid) {
        window.location.href = ShareRoutePath.GOOGLE_PLAY_URL
      }
    }, 2000)
  }

  return {
    launchApp,
  }
}

export default useAppLauncher
