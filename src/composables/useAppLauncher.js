/**
 * @file useAppLauncher.js
 * @description app启动器
 */
import { ref, nextTick } from 'vue'

import { ShareRoutePath } from '@/utils/constantsUtil.js'

const useAppLauncher = () => {
  // 计时器
  const timer = ref(null)

  // 跳转app的a标签
  const aRef = ref(null)

  // 苹果跳转app
  const appleRef = ref(null)

  // 跳转app
  const launchApp = () => {
    // 获取设备信息
    const useAgent = navigator.userAgent.toLowerCase()
    // 是否为安卓设备
    const isAndroid = /android/i.test(useAgent)
    // 是否为ios设备
    const isIOS = /iphone|ipad|ipod/i.test(useAgent)
    // 尝试打开应用
    aRef.value.href = ShareRoutePath.APP_URL
    nextTick(() => {
      aRef.value.click()
    })

    // 未安装应用时(超时未唤起), 则跳转到应用市场
    timer.value = setTimeout(() => {
      // 如果用户没跳出页面，大概率是点击了“取消”
      if (document.hidden) {
        return
      }
      if (isIOS) {
        aRef.value.href = ShareRoutePath.APPLE_APP_STORE_URL
        nextTick(() => {
          aRef.value.click()
        })
      } else if (isAndroid) {
        aRef.value.href = ShareRoutePath.GOOGLE_PLAY_URL
        nextTick(() => {
          aRef.value.click()
        })
      }
    }, 2000)
  }

  return {
    aRef,
    launchApp,
  }
}

export default useAppLauncher
