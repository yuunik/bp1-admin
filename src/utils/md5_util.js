/**
 * @description md5加密工具类
 */
import md5 from 'crypto-js/md5'

/**
 * 对字符串进行MD5加密
 * @param {string} dataStr - 需要加密的字符串
 * @returns {string} MD5加密后的字符串
 * @throws {Error} 当输入不是字符串时抛出错误
 */
export const md5Encrypt = (dataStr) => {
  if (typeof dataStr !== 'string') {
    throw new Error('Input must be a string')
  }
  return md5(dataStr).toString()
}
