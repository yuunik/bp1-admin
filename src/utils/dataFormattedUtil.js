/**
 * @description 数据格式化工具类
 */

/**
 * @description 获取文件完整路径
 * @param {string} path 路径
 * @returns {string} 格式化后的路径字符串
 */
export const getFullPath = (path) =>
  `${import.meta.env.VITE_BASE_URL_FILE}${path}`

/**
 * @description 获取数字格式化字符串
 * @param number
 * @returns {string}
 */
export const getFormatNumber = (number) =>
  new Intl.NumberFormat().format(number)
