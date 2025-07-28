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
