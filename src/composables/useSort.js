import { useDebounceFn } from '@vueuse/core'
import { TimingPreset } from '@/utils/constantsUtil.js'

/**
 * 排序函数
 * @param sortParams 排序参数
 * @param fn 更新函数
 * @returns {(function(*): void)|*}
 */

export const useSort = (sortParams, fn) => {
  // 触发函数
  const triggerFn = useDebounceFn(() => {
    fn?.()
  }, TimingPreset.DEBOUNCE)

  // 监听函数, 监听排序参数
  watch(
    () => [sortParams.sortKey, sortParams.sort],
    () => triggerFn(),
    { deep: true },
  )

  // 排序功能
  return (data) => {
    const { prop, order } = data
    if (order) {
      sortParams.sortBy = prop
      sortParams.sort = order === 'ascending' ? 'asc' : 'desc'
    } else {
      sortParams.sortBy = ''
      sortParams.sort = ''
    }
  }
}
