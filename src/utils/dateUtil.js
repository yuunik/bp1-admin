/**
 * @description 格式化日期工具类
 */

import dayjs from 'dayjs'

/**
 * 将时间戳格式化为 "03 Apr 2026 (10 days ago)"
 * @param {number} timestamp 毫秒单位时间戳
 * @returns {string}
 */
export const getLastUsedDate = (timestamp) => {
  if (timestamp === 0) {
    // 未使用过
    return 'Never Used'
  }
  // 时间戳转日期
  const date = dayjs(timestamp)
  // 格式化日期, 如 "03 Apr 2026"
  const formatDate = date.format('DD MMM YYYY')
  // 相对时间, 计算距今天的天数差的绝对值
  const diffDays = Math.abs(dayjs().diff(date, 'day'))

  return `${formatDate} (${diffDays === 0 ? 'Today' : `${diffDays} days ago`})`
}

/**
 * 将给定时间戳加一年并格式化为 "DD MMM YYYY"
 * @param {number} timestamp 毫秒时间戳
 * @returns {string} 格式化后的日期
 */
export const getWarrantyEndDate = (timestamp) => {
  if (timestamp === 0) {
    return 'Never Used'
  }
  const oneYearLater = dayjs(timestamp).add(1, 'year')
  return oneYearLater.format('DD MMM YYYY')
}
