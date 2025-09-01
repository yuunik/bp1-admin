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
    return '-'
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
 * 将给定时间戳加一年并格式化为 "DD MMM YYYY", 如 "03 Apr 2026"
 * @param {number} timestamp 毫秒时间戳
 * @returns {string} 格式化后的日期
 */
export const getWarrantyEndDate = (timestamp) => {
  if (timestamp === 0) {
    return '-'
  }
  const oneYearLater = dayjs(timestamp).add(1, 'year')
  return oneYearLater.format('DD MMM YYYY')
}

/**
 * 格式化贴文发布的时间, 格式为 "22 Aug 2024 10:30am"
 * @param timestamp 贴文发布的时间戳
 */
export const getCommentTime = (timestamp) => {
  if (timestamp === undefined) {
    // 若时间戳为空，则返回空字符串
    return ''
  }
  // 获取当前的时间戳
  const now = Date.now()
  // 距现在的时间戳的间隔
  const diffMs = now - timestamp
  // 时间间隔的秒数
  const diffSeconds = Math.floor(diffMs / 1000)
  // 时间间隔的分钟数
  const diffMinutes = Math.floor(diffSeconds / 60)
  // 时间间隔的小时数
  const diffHours = Math.floor(diffMinutes / 60)
  // 时间间隔的天数
  const diffDays = Math.floor(diffMinutes / 60)

  if (diffSeconds < 60) return 'just now'
  if (diffMinutes <= 60) return `${diffMinutes} minutes ago`
  if (diffHours <= 24) return `${diffHours} hours ago`
  if (diffDays === 1) return 'yesterday'
  if (diffDays <= 3) return `${diffDays} days ago`

  // 格式化日期
  const commentTime = new Date(timestamp)
  const year = commentTime.getFullYear()
  const month = String(commentTime.getMonth() + 1).padStart(2, '0')
  const day = String(commentTime.getDate()).padStart(2, '0')
  return `${day}/${month}/${year}`
}

/**
 * 获取车辆报告生成时间, 格式为 "Generated: 22 Aug 2024 10:30am"
 * @param timestamp 时间戳
 * @returns {string}
 */
export const getVehicleReportGeneratedTime = (timestamp) => {
  // 时间戳为空则返回 '-'
  if (!timestamp) {
    return '-'
  }
  // 时间戳转日期
  const date = dayjs(timestamp)
  // 格式化日期, 如 "Generated: 22 Aug 2024 10:30am"
  const formatDate = date.format('DD MMM YYYY hh:mma')
  return `Generated: ${formatDate}`
}

/**
 * 获取完整的日期, 格式为 "22 Aug 2024"
 * @param timestamp
 * @returns {string}
 */
export const getFullDate = (timestamp) => {
  if (!timestamp) {
    return '-'
  }
  const date = dayjs(timestamp)
  return date.format('DD MMM YYYY')
}

/**
 * 判断时间戳是否过期
 * @param timestamp
 * @returns {boolean}
 */
export const isDateExpired = (timestamp) => {
  return dayjs().isAfter(dayjs(timestamp))
}

/**
 * 获取完整的日期, 格式为 "29 Jul 2025 02:39 pm"
 * @param timestamp
 * @returns {string}
 */
export const getDateWithDDMMMYYYYhhmma = (timestamp) => {
  // 时间戳为空则返回 '-'
  if (!timestamp) {
    return '-'
  }
  // 时间戳转日期
  const date = dayjs(timestamp)
  // 格式化日期, 如 "Generated: 22 Aug 2024 10:30am"
  return date.format('DD MMM YYYY hh:mm a')
}
