/**
 * @description 数据格式化工具类
 */

/**
 * @description 获取文件完整路径
 * @param {string} path 路径
 * @returns {string} 格式化后的路径字符串
 */
export const getFullFilePath = (path) => {
  if (!path) {
    return ''
  }
  return `${import.meta.env.VITE_SERVER_URL_FILE}/${path}`
}

/**
 * @description 获取数字格式化字符串, 如 10000 -> 10,000
 * @param number
 * @returns {string}
 */
export const getFormatNumber = (number) =>
  new Intl.NumberFormat().format(number)

/**
 * @description 获取字符串第一个字母, 输出其大写形式
 * @param str
 * @returns {string}
 */
export const getFirstLetter = (str) => {
  if (!str) {
    return '-'
  }
  return str.charAt(0).toUpperCase()
}

/**
 * @description 获取数字格式化字符串, 如 10 -> 10.00, 5.3 -> 5.30, 1000 -> 1,000.00
 * @param number
 * @returns {string}
 */
export const getFormatNumberString = (number) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true, // ✅ 启用千位分隔符
  }).format(number)
