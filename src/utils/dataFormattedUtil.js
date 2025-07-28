/**
 * @description 数据格式化工具类
 */

/**
 * @description 获取文件完整路径
 * @param {string} path 路径
 * @returns {string} 格式化后的路径字符串
 */
export const getFullPath = (path) =>
  `${import.meta.env.VITE_BASE_URL_API}${path}`
