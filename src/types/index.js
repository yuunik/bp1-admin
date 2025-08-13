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

/* OBD 数据类型 */
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

/* 车辆型号数据类型 */
/**
 * @typedef {Object} VehicleDto
 * @property {string} id - 车辆 ID
 * @property {string} licensePlate - 车牌号
 * @property {string} vin - 车辆识别码
 * @property {number} mileage - 当前里程数
 * @property {string} brand - 品牌名称
 * @property {string} linkBrand - 品牌链接信息
 * @property {string} linkDevTop - 品牌设备链接
 * @property {string} model - 车型
 * @property {number} year - 生产年份
 * @property {string} name - 车辆名称
 * @property {number} selected - 是否选中标记
 * @property {string} cover - 封面图路径
 * @property {number} createTime - 创建时间（时间戳）
 * @property {number} maintenanceDate - 下次维护日期（时间戳）
 * @property {OBDDto} OBDDto - OBD 设备信息
 */

/**
 * @typedef {Object} OBDDto
 * @property {string} id - OBD 设备 ID
 * @property {string} sn - 序列号
 * @property {string} version - 固件版本号
 * @property {string} userId - 绑定用户 ID
 * @property {number} bindingTime - 绑定时间（时间戳）
 * @property {number} createTime - 创建时间（时间戳）
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
 * @property {string} password - 是否有密码 (0 为 没有, 1 为有)
 * @property {string} token - 登录或认证令牌，包含角色标识信息
 * @property {number} createTime - 创建时间，毫秒时间戳。0 表示未设定
 * @property {number} updateTime - 最近更新时间，毫秒时间戳
 */

/* 车辆型号数据类型 */
/**
 * @typedef {Object} VehicleModel
 * @property {string} id
 * @property {string} name
 * @property {string} brandId
 */

/* 品牌数据类型 */
/**
 * @typedef {Object} BrandInfo
 * @property {string} id
 * @property {string} brand
 * @property {string} logo
 * @property {number} isDelete
 * @property {number} sort
 * @property {VehicleModel[]} vehicleModelDtos
 */

/* 论坛贴文详情数据类型 */
/**
 * @typedef {Object} ForumPost
 * @property {string} id                   - 帖子唯一标识
 * @property {string} userId               - 发布者用户 ID
 * @property {number} type                 - 帖子类型（数字代表不同分类）
 * @property {string} title                - 帖子标题
 * @property {string} content              - 帖子正文内容
 * @property {number} sort                 - 排序权重
 * @property {number} favouriteCount       - 收藏数量
 * @property {number} commentCount         - 评论数量
 * @property {number} likeCount            - 点赞数量
 * @property {number} hasFavourite         - 当前用户是否已收藏（0/1）
 * @property {number} hasLike              - 当前用户是否已点赞（0/1）
 * @property {number} createTime           - 创建时间（Unix 毫秒戳）
 * @property {number} updateTime           - 更新时间（Unix 毫秒戳）
 * @property {AttachmentDto[]} attachmentDtos - 附件列表
 * @property {UserDto} userDto             - 发布者信息
 * @property {CommentDto} commentDto       - 评论相关信息（顶层占位）
 * @property {VehicleDto} vehicleDto       - 关联车辆信息
 */

/* 附件数据类型 */
/**
 * @typedef {Object} AttachmentDto
 * @property {string} id - 附件 ID
 * @property {string} category - 附件分类（如 "Forum"）
 * @property {string} name - 文件名
 * @property {string} type - 类型（如 "image"）
 * @property {string} path - 文件路径
 * @property {number} size - 文件大小（单位：字节）
 * @property {number} createTime - 附件创建时间（时间戳）
 */

/**
 * @typedef {Object} UserDto
 * @property {string} id - 用户 ID
 * @property {string} name - 用户名
 * @property {string} email - 用户邮箱
 * @property {string} logo - 用户头像地址
 */

/* 评论数据类型 */
/**
 * @typedef {Object} CommentDto
 * @property {string} id - 评论 ID
 * @property {string} parentId - 父级评论 ID
 * @property {string} content - 评论内容
 * @property {string} path - 评论路径层级
 * @property {number} isAdopted - 是否被采纳
 * @property {number} isAccepted - 是否接受
 * @property {number} accepted - 是否采纳标记
 * @property {number} rejected - 是否拒绝标记
 * @property {number} createTime - 评论时间
 * @property {CommentDto[] | null} commentDtos - 子评论数组（递归结构）
 * @property {UserDto} userDto - 评论人信息
 * @property {UserDto} byUserDto - 被评论人信息
 */

/* 车辆型号数据类型 */
/**
 * @typedef {Object} BrandModel
 * @property {string} id - 车辆品牌 ID
 * @property {string} name - 车辆品牌名称
 * @property {string} brandId - 品牌 ID
 */

/* 实时预警数据类型 */
/**
 * @typedef {Object} LiveWarningData
 * @description 实时预警数据项，表示某个传感器或指标的当前状态及基础属性。
 *
 * @property {string} id - 唯一标识符，用于区分不同数据项。
 * @property {string} name - 指标名称，例如“Intake Air Temp”。
 * @property {number} value - 实时数值，可用于展示或分析。
 * @property {string} groupKey - 分组标识，用于归类或逻辑分组。
 * @property {string} obdKey - OBD（车载诊断）对应的键名，便于后端字段映射。
 * @property {string} unit - 数值单位，例如摄氏度（℃）。
 */

/* ai 问答数据类型 */
/**
 * @typedef {object} AiQuestionInfo
 * @property {string} id - 数据的唯一标识符。
 * @property {string} userId - 用户的唯一标识符。
 * @property {string} questionId - 问题的唯一标识符。
 * @property {string} question - 用户提出的问题。
 * @property {string} answer - 针对用户问题的回答。
 * @property {number} createTime - 记录的创建时间戳。
 * @property {VehicleDto} vehicleDto - 车辆相关信息。
 * @property {UserDto} userDto - 用户相关信息。
 */

/* 保养数据 */
/**
 * 表示一条车辆保养记录的数据结构。
 * @typedef {Object} MaintenanceRecord
 * @property {string} id - 保养项目的唯一标识符（UUID 格式）。
 * @property {string} logo - 保养项目对应的图标或图片路径。
 * @property {string} name - 保养项目的名称（例如："更换空气滤清器"）。
 * @property {number} date - 建议的保养周期（以天为单位，例如每 180 天）。
 * @property {number} mileage - 建议的保养里程（单位：公里，例如每 10000 公里）。
 * @property {number} createTime - 创建时间，使用毫秒级时间戳（Unix 时间戳，单位：毫秒）。
 */

/* 预测数据 */
/**
 * 预测数据结构，表示某个故障预测的信息。
 * @typedef {Object} PredictionData
 * @property {string} id - 唯一标识符，例如 "fff43cfa-67b6-11f0-aeaf-027e72c170ed"。
 * @property {string} name - 故障名称，例如 "Battery Failure"。
 * @property {string} logo - 故障图标的路径，例如 "file/prediction/Battery Failure.png"。
 * @property {number} isHide - 是否隐藏该故障项，0 表示显示，1 表示隐藏。
 * @property {number} date - 故障预测发生的天数，比如距当前时间的天数。
 * @property {number} mileage - 故障预测发生时的预计里程数（单位：公里），例如 8000。
 */

/* 车辆报告数据类型 */
/**
 * @typedef {object} VehicleReport
 * @property {string} id - The unique identifier for the vehicle report.
 * @property {string} userId - The user ID associated with this report.
 * @property {string} licensePlate - The license plate number of the vehicle.
 * @property {string} vin - The Vehicle Identification Number.
 * @property {number} mileage - The mileage of the vehicle at the time of the report.
 * @property {string} brand - The brand of the vehicle.
 * @property {string} model - The model of the vehicle.
 * @property {number} year - The manufacturing year of the vehicle.
 * @property {number} faultCodeCount - The total number of fault codes found.
 * @property {number} repairCount - The number of repairs recorded.
 * @property {number} maintenanceCount - The number of maintenance records.
 * @property {number} fuelCount - The number of fuel records.
 * @property {number} seiviceCount - The number of service records.
 * @property {number} modificationCount - The number of modifications recorded.
 * @property {number} createTime - The timestamp when the report was created.
 * @property {string} grade - The vehicle's health grade.
 * @property {string} explain - A brief explanation or summary of the report.
 * @property {string} expenseTotal - The total expense amount as a string.
 * @property {number} dtcCount - The total number of Diagnostic Trouble Codes (DTCs).
 * @property {number} dtcTime - The timestamp of the last DTC scan.
 * @property {VehicleDto} vehicleDto - Detailed information about the vehicle.
 * @property {ReportDtcItemDto[]} reportDtcItemDtos - A list of fault code items grouped by system.
 * @property {ReportPredictionDto[]} reportPredictionDtos - A list of predicted vehicle failures.
 * @property {ReportExpenseDto[]} reportExpenseDtos - A list of expense records for the vehicle.
 */
