import { nextTick, onMounted } from 'vue'
import { useDebounceFn, useLocalStorage } from '@vueuse/core'

import { TimingPreset } from '@/utils/constantsUtil.js'

/**
 * 排序函数
 * @param sortParams 排序参数
 * @param fn 更新函数
 * @returns {(function(*): void)|*}
 */
export const useSort = (sortParams, fn) => {
  // 获取本地存储中的排序参数
  const sortParamsLocal = useLocalStorage('sortParamsLocal', {})

  // 回显图标的表头dom
  const thCell = ref(null)

  // 初始化：如果传入 sortParams 有 sortType，就从本地存储取对应参数并赋值
  if (sortParams.sortType && sortParamsLocal.value[sortParams.sortType]) {
    const localSort = sortParamsLocal.value[sortParams.sortType]
    // 把 localSort 的值复制到传入的 sortParams
    sortParams.sort = localSort.sort
    sortParams.sortBy = localSort.sortBy
  }

  // 触发函数
  const triggerFn = useDebounceFn(() => {
    fn?.()
  }, TimingPreset.DEBOUNCE)

  // 监听函数, 监听排序参数
  watch(
    () => [sortParams.sortBy, sortParams.sort],
    () => {
      triggerFn()
      // 如果有 sortType，则把本地存储对应对象更新
      if (sortParams.sortType) {
        const key = sortParams.sortType
        // 先确保本地存储对象存在
        sortParamsLocal.value[key] = sortParamsLocal.value[key] || {}
        // 更新 sort 和 sortBy
        sortParamsLocal.value[key].sort = sortParams.sort
        sortParamsLocal.value[key].sortBy = sortParams.sortBy
      }
      // 如果有回显的图标, 立马刷新掉
      if (thCell.value) {
        thCell.value.classList.remove('ascending', 'descending')
        thCell.value = null
      }
    },
    { deep: true },
  )

  onMounted(async () => {
    // 若有 sortType 和 sortArray，则进行排序图标回显
    if (sortParams.sortType && sortParams.sortArray) {
      await nextTick(() => {})
      // 获取所有表头单元格
      const thCells = document.querySelectorAll(
        '.el-table__header th.el-table__cell',
      )

      // 获取对应的label内容
      const selectedItem = sortParams.sortArray.find(
        (item) => item.prop === sortParams.sortBy,
      )

      // 找到对应内容的 单元格, 进行排序
      // 赋值给需要回显的表头 dom 实例
      thCell.value = Array.from(thCells).find((thItem) => {
        return thItem.querySelector('.cell').textContent === selectedItem.label
      })
      // 回显排序图标颜色
      if (thCell.value)
        thCell.value.classList.toggle(
          sortParams.sort === 'asc' ? 'ascending' : 'descending',
        )
    }
  })

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
