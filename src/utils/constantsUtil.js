// AI Chat Management 模块的常量定义
import dayjs from 'dayjs'

export const AIChatManagementTab = Object.freeze({
  PRESET_QUESTIONS: 'Preset Questions',
  USER_QUESTION_RECORDS: 'User Question Records',
  TOKEN_SETTINGS: 'Token Settings',
  AI_PROMPT: 'AI Prompt',
})

// Interval & Warning 模块的常量定义
export const IntervalWarningTab = Object.freeze({
  MAINTENANCE: 'Maintenance',
  PREDICTION: 'Prediction',
  LIVE_DATA_WARNING: 'Live Data Warning',
})

// User Management 模块的常量定义
export const UserManagementTab = Object.freeze({
  PERSON: 'Person',
  Workshop: 'Workshop',
})

// emitter 通信事件常量定义
export const EmitterEvent = Object.freeze({
  UPDATE_BREADCRUMB_LIST: 'updateBreadcrumbList',
  UPDATE_BREADCRUMB_TITLE: 'updateBreadcrumbTitle',
  CLEAR_BREADCRUMB_LIST: 'clearBreadcrumbList',
  // dtc 详情页获取初始数据
  GET_ERROR_CODE_INITIAL_DATA: 'getErrorCodeInitialData',
})

// 路由模块名称的常量定义
export const RouteName = Object.freeze({
  LOGIN: 'Login',
  LAYOUT: 'Layout',
  DASHBOARD: 'Dashboard',
  ORDER_MANAGEMENT: 'Order Management',
  OBD_MANAGEMENT: 'OBD Management',
  OBD_LIST: 'OBD List',
  OBD_DETAILS: 'OBD Details',
  CREATE_STOCK_ORDER: 'Create Stock Order',
  VIEW_VEHICLE: 'View Vehicle',
  INVENTORY: 'Inventory',
  USER_MANAGEMENT: 'User Management',
  INTERNAL: 'Internal',
  EXTERN: 'Extern',
  DATABASE: 'Database',
  FORUM_MANAGEMENT: 'Forum Management',
  FORUM: 'Forum',
  APP_MANAGEMENT: 'App Management',
  AI_CHAT_MANAGEMENT: 'AI Chat Management',
  VERSION_CONTROL: 'Version Control',
  MANAGE_VERSION: 'Manage Version',
  VERSION_CONTROL_CREATE: 'New Config',
  BRAND_MODEL: 'Brand & Model',
  CREATE_BRAND: 'Create Brand',
  SHARE: 'Share',
  FORUM_INFO: 'Forum Info',
  ANY: 'Any',
  INTERVAL_WARNING: 'Interval & Warning',
  POST_DETAILS: 'Post Details',
  COMMENT_DETAILS: 'Comment Details',
  CLUB_MANAGEMENT_INDEX: 'Club Management Index',
  GROUPS: 'Groups',
  GROUP_DETAILS: 'Group Details',
  PUSH_NOTIFICATIONS: 'Push notifications',
  DTC_LIST: 'DTC',
  DTC_DETAILS: 'DTC Details',
  ERROR_CODE_DETAILS: 'Error Code Details',
  PERSON_MANAGE: 'Person Manage',
  EXPENSE_RECORD_DETAILS: 'Expense Record Details',
  ACTIVITY_ORDER: 'Activity Order',
  // 实时订单
  REAL_TIME_ORDER: 'Real Time Order',
  EMAIL_VERIFICATION: 'Email Verification',
  // 费用
  EXPENSE_MANAGEMENT: 'Expense Management',
  // 费用列表页
  EXPENSE: 'Expense',
  // 汽车品牌费用详情页
  CAR_COST_DETAILS: 'Car Cost Details',
  // 用户皮肤详情页
  USER_SKIN_DETAILS: 'User Skin Details',
})

// 分享模块跳转路径
export const ShareRoutePath = Object.freeze({
  GOOGLE_PLAY_URL:
    'https://play.google.com/store/apps/details?id=com.proteus.diagnostics',
  APPLE_APP_STORE_URL: 'https://apps.apple.com/app/id6748522066',
  // APPLE_APP_STORE_URL: 'itms-apps://apps.apple.com/app/id6748522066',
  APP_URL: 'pd-1://',
})

// 汽车电控系统分类的定义
export const VehicleEcuCategory = Object.freeze({
  // 引擎
  ENGINE: 'Engine',
  // 变速箱
  TRANSMISSION: 'Transmission',
  // 制动
  BRAKES: 'Brakes',
  // 电气
  ELECTRICAL: 'Electrical',
  // 底盘
  CHASSIS: 'Chassis',
  // 车身
  BODY_AND_TRIM: 'Body and Trim',
  // 其他
  OTHERS: 'Others',
})

// OBD Details 的 tab 分页常量
export const ObdDetailsTabs = Object.freeze({
  // OBD 详情
  OBD_DETAILS: 'OBD Details',
  // 行为统计
  BEHAVIOR_STATISTICS: 'Behavior Statistics',
})

// Vehicle Detail 的 tab 分页常量
export const VehicleDetailTabs = Object.freeze({
  // 车辆详情
  VEHICLE_DETAILS: 'Vehicle Details',
  // 扫描记录
  SCANNED_HISTORY: 'Scanned History',
})

// 菜单栏常量定义
export const Menu = Object.freeze({
  WIDTH: '210px',
})

// 节流和防抖的常量定义
export const TimingPreset = Object.freeze({
  DEBOUNCE: 300,
  THROTTLE: 60000,
})

// 当前时间
const currentDay = dayjs().endOf('day')
// 行为统计图标的日期选择的常量定义
export const BehaviorStatisticsDate = Object.freeze({
  // 7 天前的时间戳
  SEVEN_DAYS: currentDay.subtract(7, 'day').valueOf(),
  // 30 天前的时间戳
  THIRTY_DAYS: currentDay.subtract(30, 'day').valueOf(),
  // 90 天前的时间戳
  NINETY_DAYS: currentDay.subtract(90, 'day').valueOf(),
})

// 论坛模块的 tab 分页常量
export const ForumManagementTab = Object.freeze({
  POSTS: 'Posts',
  COMMENTS: 'Comments',
})

// ai 预估成本等级
export const AI_COST_LEVEL = Object.freeze({
  LOW: 'Low',
  FAIR: 'Fair',
  HIGH: 'High',
})

// 图表图例颜色
// 图表图例颜色
export const ChartColor = Object.freeze({
  Purple: '#A9AEFF',
  Yellow: '#F6D78B',
  Pink: '#FFACA7',
  Green: '#C6D0BC',
  Blue: '#9FC7FB',
  Orange: '#F1B18E',
  Gray: '#DBDDE1',
})

// module 颜色匹配表
export const ModuleColorMap = Object.freeze({
  Engine: ChartColor.Purple,
  Transmission: ChartColor.Yellow,
  Brakes: ChartColor.Pink,
  Electrical: ChartColor.Green,
  Chassis: ChartColor.Blue,
  'Body and Trim': ChartColor.Orange,
  Others: ChartColor.Gray,
})

// category 颜色匹配表
export const CategoryColorMap = Object.freeze({
  Services: ChartColor.Yellow,
  Repair: ChartColor.Pink,
  Fuel: ChartColor.Green,
  Maintenance: ChartColor.Blue,
  Modification: ChartColor.Orange,
  Others: ChartColor.Gray,
})

// module 图标匹配表
export const ModuleIconMap = Object.freeze({
  Engine: 'engine-load',
  Transmission: 'tranmission',
  Brakes: 'brakes',
  Electrical: 'electronic-central-electric',
  Chassis: 'chassis',
  'Body and Trim': 'services-icon',
  Others: 'others-icon',
})

// category 图标匹配表
export const CategoryIconMap = Object.freeze({
  Services: 'services-icon',
  Repair: 'repair shop',
  Fuel: 'fuel-level',
  Maintenance: 'fi_file-minus',
  Modification: 'modification',
  Others: 'others-icon',
})
