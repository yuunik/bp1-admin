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

/* 修理厂数据类型 */
/**
 * @typedef {Object} ShopInfoItem
 * @property {string} id - 店铺唯一标识符，UUID 格式
 * @property {string} name - 店铺名称
 * @property {string} logo - 店铺 Logo 图片地址，若为空表示未上传
 * @property {string} businessHours - 营业时间信息，格式可为 "08:00 - 18:00"
 * @property {string} shopAddress - 店铺地址，全量展示用于地图定位等
 * @property {string} phoneCountry - 电话所属国家代码（例如 "+65"）
 * @property {string} phoneNumber - 联系电话
 * @property {number} isDelete - 删除状态，0 表示未删除，1 表示已删除
 * @property {number} createTime - 创建时间，毫秒时间戳
 * @property {number} updateTime - 更新时间，毫秒时间戳
 * @property {string} userId - 店主或商户用户的 ID
 * @property {number} rating - 店铺评分，例如 5 表示满分
 * @property {string} UEN - 新加坡企业统一编号（Unique Entity Number）
 * @property {Array<Object>} reviewDtos - 用户评论列表
 * @property {Object} userDto - 关联用户信息
 * @property {string} userDto.id - 用户 ID
 * @property {string} userDto.name - 用户名
 * @property {string} userDto.logo - 用户头像地址
 */

/* 用户数据类型 */
/**
 * @typedef {Object} AdminUserItem
 * @property {string} id - 管理员唯一标识符，可为字符串型 ID
 * @property {string} name - 管理员用户名
 * @property {string} email - 管理员电子邮件地址
 * @property {string} password - 用户密码（建议仅在后台使用，不在客户端暴露）
 * @property {string} token - 登录或认证令牌，包含角色标识信息
 * @property {number} createTime - 创建时间，毫秒时间戳。0 表示未设定
 * @property {number} updateTime - 最近更新时间，毫秒时间戳
 */
