/**
 * @description 数据类型定义
 */

// 统一返回数据格式类型
/**
 * @template T
 * @typedef {Object} ApiResponse<T>
 * @property {string} code
 * @property {string} msg
 * @property {number} count
 * @property {T} data
 */

/* start OBD 数据类型 */
/**
 * @typedef {Object} OBDItem
 * @property {string} id - OBD 唯一标识符
 * @property {string} sn - 序列号（如设备编号）
 * @property {string} version - 固件或设备版本
 * @property {string} userId - 当前绑定用户的 ID
 * @property {number} bindingTime - 绑定时间戳（毫秒）
 * @property {number} createTime - 创建时间戳（毫秒）
 * @property {VehicleDto} vehicleDto - 关联车辆信息
 * @property {SimpleUserDto} simpleUserDto - 简化的用户信息
 */

/**
 * @typedef {Object} VehicleDto
 * @property {string} id
 * @property {string} licensePlate
 * @property {string} vin
 * @property {number} mileage
 * @property {string} brand
 * @property {string} linkBrand
 * @property {string} linkDevTop
 * @property {string} model
 * @property {number} year
 * @property {string} name
 * @property {number} selected
 * @property {string} cover
 * @property {number} createTime
 * @property {number} maintenanceDate
 * @property {OBDSubDto} OBDDto - 嵌套的 OBD 信息
 */

/**
 * @typedef {Object} OBDSubDto
 * @property {string} id
 * @property {string} sn
 * @property {string} version
 * @property {string} userId
 * @property {number} bindingTime
 * @property {number} createTime
 */

/**
 * @typedef {Object} SimpleUserDto
 * @property {string} id
 * @property {string} name
 * @property {string} logo
 */
/* end */

/* ai 问题数据类型 */
/**
 * @typedef {Object} AiQuestionItem
 * @property {string} id - 唯一标识符，UUID 格式
 * @property {string} question - 提问内容，可能是用户的语音或查询语句
 * @property {number} sort - 排序字段，越小越靠前
 * @property {number} status - 状态值，例如 1 表示启用，0 表示禁用
 * @property {number} useCount - 被调用的次数
 * @property {number} createTime - 创建时间，毫秒时间戳
 * @property {number} updateTime - 更新时间，毫秒时间戳
 */
