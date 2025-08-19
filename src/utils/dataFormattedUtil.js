/**
 * @description 数据格式化工具类
 */

let fileApi
const { MODE, VITE_BASE_URL_FILE, VITE_SERVER_URL_FILE } = import.meta.env
if (MODE === '.env.local') {
  fileApi = VITE_BASE_URL_FILE
} else {
  fileApi = VITE_SERVER_URL_FILE
}

/**
 * @description 获取文件完整路径
 * @param {string} path 路径
 * @returns {string} 格式化后的路径字符串
 */
export const getFullFilePath = (path) =>
  `${import.meta.env.VITE_SERVER_URL_FILE}/${path}`

/**
 * @description 获取数字格式化字符串, 如 10000 -> 10,000
 * @param number
 * @returns {string}
 */
export const getFormatNumber = (number) =>
  new Intl.NumberFormat().format(number)
