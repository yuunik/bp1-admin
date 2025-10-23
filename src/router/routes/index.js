import { RouteName } from '@/utils/constantsUtil.js'

const constantRoutes = [
  {
    path: '/login',
    name: RouteName.LOGIN,
    component: () => import('@/views/Login/index.vue'),
    meta: {
      // 显示在菜单栏的标题
      title: RouteName.LOGIN,
      // 控制是否显示在菜单栏
      showInMenu: false,
      // 控制是否显示在面包屑中
      showInBreadcrumb: false,
      // 是否为一级路由
      isTopLevelRoute: true,
    },
  },
  {
    path: '/',
    redirect: '/dashboard',
    name: RouteName.LAYOUT,
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/dashboard',
        name: RouteName.DASHBOARD,
        component: () => import('@/views/Dashboard/index.vue'),
        meta: {
          title: RouteName.DASHBOARD,
          showInMenu: true,
          showInBreadcrumb: true,
          icon: 'icon-Component-5',
          selectedIcon: 'icon-typedashboard',
        },
      },
    ],
    meta: {
      title: RouteName.LAYOUT,
      showInMenu: false,
      showInBreadcrumb: false,
      // 是否为一级路由
      isTopLevelRoute: true,
    },
  },
  // 订单模块
  {
    path: '/order-management',
    redirect: '/order-management/rt-order-list',
    name: RouteName.ORDER_MANAGEMENT,
    component: () => import('@/layout/index.vue'),
    children: [
      /**
       * 实时订单模块
       */
      {
        path: '/order-management/rt-order-list',
        name: RouteName.REAL_TIME_ORDER,
        component: () =>
          import('@/views/OrderManagement/RealTimeOrder/index.vue'),
        meta: {
          title: RouteName.REAL_TIME_ORDER,
          showInMenu: true,
          showInBreadcrumb: true,
        },
      },
      /**
       * 活动订单模块
       */
      {
        path: '/order-management/activity-order-list',
        name: RouteName.ACTIVITY_ORDER,
        component: () =>
          import('@/views/OrderManagement/ActivityOrder/index.vue'),
        meta: {
          title: RouteName.ACTIVITY_ORDER,
          showInMenu: true,
          showInBreadcrumb: true,
        },
      },
    ],
    meta: {
      title: RouteName.ORDER_MANAGEMENT,
      showInMenu: true,
      showInBreadcrumb: true,
      // 是否为一级路由
      isTopLevelRoute: true,
      icon: 'icon-typesOrderManagement',
      selectedIcon: 'icon-typelist',
    },
  },
  {
    path: '/obd-management',
    redirect: '/obd-management/obd-list',
    name: RouteName.OBD_MANAGEMENT,
    component: () => import('@/layout/index.vue'),
    children: [
      /**
       * OBD 列表模块
       */
      // OBD 列表
      {
        path: '/obd-management/obd-list',
        name: RouteName.OBD_LIST,
        component: () => import('@/views/ObdManagement/ObdList/index.vue'),
        meta: {
          title: RouteName.OBD_LIST,
          showInMenu: true,
          showInBreadcrumb: true,
        },
      },
      // OBD 详情
      {
        path: '/obd-management/obd-details/:id',
        name: RouteName.OBD_DETAILS,
        component: () => import('@/views/ObdManagement/ObdDetails/index.vue'),
        meta: {
          title: RouteName.OBD_DETAILS,
          showInMenu: false,
          showInBreadcrumb: true,
        },
      },
      // 车辆详情页
      {
        path: '/obd-management/obd-list/obd-details/vehicle-details/:id',
        name: RouteName.VIEW_VEHICLE,
        component: () =>
          import('@/views/ObdManagement/VehicleDetails/index.vue'),
        meta: {
          title: RouteName.VIEW_VEHICLE,
          showInMenu: false,
          showInBreadcrumb: true,
        },
      },
      /**
       * DTC 模块
       */
      // DTC 列表页
      {
        path: '/obd-management/dtc-list',
        name: RouteName.DTC_LIST,
        component: () => import('@/views/ObdManagement/DTC/index.vue'),
        meta: {
          title: RouteName.DTC_LIST,
          showInMenu: true,
          showInBreadcrumb: true,
        },
      },
      // DTC 详情页
      {
        path: '/obd-management/dtc-list/dtc-details/:id',
        name: RouteName.DTC_DETAILS,
        component: () => import('@/views/ObdManagement/DTC/DTCDetails.vue'),
        meta: {
          title: RouteName.DTC_DETAILS,
          showInMenu: false,
          showInBreadcrumb: true,
        },
      },
      // 错误码详情页
      {
        path: '/obd-management/dtc-list/dtc-details/error-code-details/:id',
        name: RouteName.ERROR_CODE_DETAILS,
        component: () =>
          import('@/views/ObdManagement/DTC/ErrorCodeDetails.vue'),
        meta: {
          title: RouteName.ERROR_CODE_DETAILS,
          showInMenu: false,
          showInBreadcrumb: true,
        },
      },
      /**
       * 库存管理模块
       */
      // 库存管理页
      {
        path: '/obd-management/inventory',
        name: RouteName.INVENTORY,
        component: () => import('@/views/ObdManagement/Inventory/index.vue'),
        children: [],
        meta: {
          title: RouteName.INVENTORY,
          showInMenu: true,
          showInBreadcrumb: true,
        },
      },
      // create stock order
      {
        path: '/obd-management/inventory/create-stock-order',
        name: 'Inventory Create Stocker Order',
        component: () =>
          import('@/views/ObdManagement/Inventory/CreateStockOrder.vue'),
        meta: {
          title: 'Create Stock Order',
          showInMenu: false,
          showInBreadcrumb: true,
        },
      },
      // 库存 detail
      {
        path: '/obd-management/inventory/:id',
        name: 'Inventory Details',
        component: () =>
          import('@/views/ObdManagement/Inventory/InventoryDetails.vue'),
        meta: {
          title: 'Inventory Details',
          showInMenu: false,
          showInBreadcrumb: true,
        },
      },
    ],
    meta: {
      title: RouteName.OBD_MANAGEMENT,
      showInMenu: true,
      showInBreadcrumb: true,
      icon: 'icon-Component-5-2',
      selectedIcon: 'icon-typeOBD',
      // 是否为一级路由
      isTopLevelRoute: true,
    },
  },
  {
    path: '/user-management',
    redirect: '/user-management/internal',
    name: RouteName.USER_MANAGEMENT,
    component: () => import('@/layout/index.vue'),
    children: [
      /**
       * 内部用户管理模块
       */
      {
        path: '/user-management/internal',
        name: RouteName.INTERNAL,
        component: () => import('@/views/UserManagement/Internal/index.vue'),
        children: [
          {
            path: '/user-management/internal/manage/:id',
            name: 'Internal Manage',
            component: () =>
              import('@/views/UserManagement/Internal/InternalDetails.vue'),
            meta: {
              title: 'Internal Manage',
              showInMenu: false,
              showInBreadcrumb: true,
            },
          },
          {
            path: '/user-management/internal/create',
            name: 'Create Internal User',
            component: () =>
              import('@/views/UserManagement/Internal/InternalUserCreate.vue'),
            meta: {
              title: 'Create Internal User',
              showInMenu: false,
              showInBreadcrumb: true,
            },
          },
        ],
        meta: {
          title: RouteName.INTERNAL,
          showInMenu: true,
          showInBreadcrumb: true,
        },
      },
      /**
       * 外部用户管理模块
       */
      {
        path: '/user-management/extern',
        name: RouteName.EXTERN,
        component: () => import('@/views/UserManagement/Extern/index.vue'),
        meta: {
          title: RouteName.EXTERN,
          showInMenu: true,
          showInBreadcrumb: true,
        },
      },
      {
        path: '/user-management/extern/person/:id',
        name: 'Person Manage',
        component: () =>
          import('@/views/UserManagement/Extern/PersonManagement.vue'),
        meta: {
          title: 'Person Manage',
          showInMenu: false,
          showInBreadcrumb: true,
        },
      },
      // expense 记录详情
      {
        path: '/user-management/expense/:id',
        name: RouteName.EXPENSE_RECORD_DETAILS,
        component: () =>
          import('@/views/UserManagement/ExpenseRecordDetails/index.vue'),
        meta: {
          title: RouteName.EXPENSE_RECORD_DETAILS,
          showInMenu: false,
          showInBreadcrumb: true,
        },
      },
      // 创建商家
      {
        path: '/user-management/extern/workshop/create',
        name: 'Create Workshop',
        component: () =>
          import('@/views/UserManagement/Extern/CreateWorkshop.vue'),
        meta: {
          title: 'Create Workshop',
          showInMenu: false,
          showInBreadcrumb: true,
        },
      },
      // 商家详情
      {
        path: '/user-management/extern/workshop/:id',
        name: 'Workshop Manage',
        component: () =>
          import('@/views/UserManagement/Extern/WorkshopManagement.vue'),
        meta: {
          title: 'Workshop Manage',
          showInMenu: false,
          showInBreadcrumb: true,
        },
      },
    ],
    meta: {
      title: RouteName.USER_MANAGEMENT,
      showInMenu: true,
      showInBreadcrumb: true,
      icon: 'icon-typeuser-3-fill1',
      selectedIcon: 'icon-typeuser-3-fill',
      // 是否为一级路由
      isTopLevelRoute: true,
    },
  },
  // 数据库模块
  {
    path: '/database-module',
    redirect: '/database',
    name: 'Database Module',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/database',
        name: RouteName.DATABASE,
        component: () => import('@/views/Database/index.vue'),
        meta: {
          title: RouteName.DATABASE,
          showInMenu: true,
          showInBreadcrumb: true,
          icon: 'icon-Component-5-4',
          selectedIcon: 'icon-typedatabase-2-fill',
        },
      },
    ],
    meta: {
      title: 'Database Module',
      showInMenu: false,
      showInBreadcrumb: false,
      icon: 'icon-Component-5-4',
      selectedIcon: 'icon-typedatabase-2-fill',
      // 是否为一级路由
      isTopLevelRoute: true,
    },
  },
  {
    path: '/forum-management',
    redirect: '/forum-management/forum-list',
    name: RouteName.FORUM_MANAGEMENT,
    component: () => import('@/layout/index.vue'),
    children: [
      // 帖子列表
      {
        path: '/forum-management/forum-list',
        name: RouteName.FORUM,
        component: () => import('@/views/ForumManagement/Forum/index.vue'),
        children: [
          // 贴文详情页
          {
            path: '/forum-management/post-details/:id',
            name: RouteName.POST_DETAILS,
            component: () =>
              import('@/views/ForumManagement/Forum/PostDetails.vue'),
            meta: {
              title: RouteName.POST_DETAILS,
              showInMenu: false,
              showInBreadcrumb: true,
            },
          },
          // 评论详情页
          {
            path: '/forum-management/comment-details/:id',
            name: RouteName.COMMENT_DETAILS,
            component: () =>
              import('@/views/ForumManagement/Forum/CommentDetails.vue'),
            meta: {
              title: RouteName.COMMENT_DETAILS,
              showInMenu: false,
              showInBreadcrumb: true,
            },
          },
        ],
        meta: {
          title: RouteName.FORUM,
          showInMenu: true,
          showInBreadcrumb: true,
        },
      },
      // 俱乐部列表页
      {
        path: '/forum-management/group-list',
        name: RouteName.GROUPS,
        component: () => import('@/views/ForumManagement/Groups/index.vue'),
        meta: {
          title: RouteName.GROUPS,
          showInMenu: true,
          showInBreadcrumb: true,
        },
      },
      // 俱乐部详情
      {
        path: '/forum-management/group-details/:id',
        name: RouteName.GROUP_DETAILS,
        component: () =>
          import('@/views/ForumManagement/Groups/GroupDetails.vue'),
        meta: {
          title: RouteName.GROUP_DETAILS,
          showInMenu: false,
          showInBreadcrumb: true,
        },
      },
    ],
    meta: {
      title: RouteName.FORUM_MANAGEMENT,
      showInMenu: true,
      showInBreadcrumb: true,
      icon: 'icon-typeForum',
      selectedIcon: 'icon-typeForum',
      // 是否为一级路由
      isTopLevelRoute: true,
    },
  },
  {
    path: '/app-configuration',
    redirect: '/app-configuration/version-control',
    name: RouteName.APP_MANAGEMENT,
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/app-configuration/version-control',
        name: RouteName.VERSION_CONTROL,
        component: () =>
          import('@/views/AppConfiguration/VersionControl/index.vue'),
        meta: {
          title: RouteName.VERSION_CONTROL,
          showInMenu: true,
          showInBreadcrumb: true,
        },
      },
      // 版本管理
      {
        path: '/app-configuration/version-control/manage/:id',
        name: RouteName.MANAGE_VERSION,
        component: () =>
          import(
            '@/views/AppConfiguration/VersionControl/VersionControlManage.vue'
          ),
        meta: {
          title: RouteName.MANAGE_VERSION,
          showInMenu: false,
          showInBreadcrumb: true,
        },
      },
      // 版本创建
      {
        path: '/app-configuration/version-control/create',
        name: RouteName.VERSION_CONTROL_CREATE,
        component: () =>
          import(
            '@/views/AppConfiguration/VersionControl/VersionControlCreate.vue'
          ),
        meta: {
          title: RouteName.VERSION_CONTROL_CREATE,
          showInMenu: false,
          showInBreadcrumb: true,
        },
      },
      {
        path: '/app-configuration/brand-model',
        redirect: '/app-configuration/brand-model/list',
        name: RouteName.BRAND_MODEL,
        component: () =>
          import('@/views/AppConfiguration/BrandModel/index.vue'),
        children: [
          // 车辆列表页
          {
            path: '/app-configuration/brand-model/list',
            name: 'BrandAndModelTable',
            component: () =>
              import('@/views/AppConfiguration/BrandModel/BrandModelTable.vue'),
            meta: {
              showInMenu: false,
              showInBreadcrumb: true,
            },
          },
          // 车辆管理页面
          {
            path: '/app-configuration/brand-model/manage/:id',
            name: 'BrandAndModelManagement',
            component: () =>
              import(
                '@/views/AppConfiguration/BrandModel/BrandModelManage.vue'
              ),
            params: true,
            meta: {
              showInMenu: true,
              showInBreadcrumb: true,
            },
          },
          // 车辆品牌新增页面
          {
            path: '/app-configuration/brand-model/create',
            name: 'BrandAndModelCreate',
            component: () =>
              import(
                '@/views/AppConfiguration/BrandModel/BrandModelCreate.vue'
              ),
            meta: {
              title: 'Create Brand',
              showInMenu: true,
              showInBreadcrumb: true,
            },
          },
        ],
        meta: {
          title: RouteName.BRAND_MODEL,
          showInMenu: true,
          showInBreadcrumb: true,
        },
      },
      {
        path: '/app-configuration/ai-chat-management',
        name: RouteName.AI_CHAT_MANAGEMENT,
        component: () =>
          import('@/views/AppConfiguration/AiChatManagement/index.vue'),
        meta: {
          title: RouteName.AI_CHAT_MANAGEMENT,
          showInMenu: true,
          showInBreadcrumb: true,
        },
      },
      {
        path: '/app-configuration/interval-warning',
        name: RouteName.INTERVAL_WARNING,
        component: () =>
          import('@/views/AppConfiguration/IntervalWarning/index.vue'),
        meta: {
          title: RouteName.INTERVAL_WARNING,
          showInMenu: true,
          showInBreadcrumb: true,
        },
      },
      {
        path: '/app-configuration/expense-items',
        name: 'Expense Items',
        component: () =>
          import('@/views/AppConfiguration/ExpenseItems/index.vue'),
        meta: {
          title: 'Expense Items',
          showInMenu: true,
          showInBreadcrumb: true,
        },
      },
      // push notifications
      {
        path: '/app-configuration/push-notifications',
        name: RouteName.PUSH_NOTIFICATIONS,
        component: () =>
          import('@/views/AppConfiguration/PushNotifications/index.vue'),
        meta: {
          title: RouteName.PUSH_NOTIFICATIONS,
          showInMenu: true,
          showInBreadcrumb: true,
        },
      },
    ],
    meta: {
      title: RouteName.APP_MANAGEMENT,
      showInMenu: true,
      showInBreadcrumb: true,
      icon: 'icon-typesOrderManagement',
      selectedIcon: 'icon-typelist',
      // 是否为一级路由
      isTopLevelRoute: true,
    },
  },
  // 系统设置
  {
    path: '/setting',
    redirect: '/settings',
    name: 'Setting',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/Settings/index.vue'),
        meta: {
          title: 'Settings',
          showInMenu: false,
          showInBreadcrumb: true,
          icon: 'icon-settings',
        },
      },
    ],
    meta: {
      title: 'Setting',
      showInMenu: false,
      showInBreadcrumb: false,
      icon: 'icon-settings',
      // 是否为一级路由
      isTopLevelRoute: true,
    },
  },
  // 通知设置
  {
    path: '/notification',
    redirect: '/notifications',
    name: 'Notification',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/notifications',
        name: 'Notifications',
        component: () => import('@/views/Notifications/index.vue'),
        meta: {
          title: 'Notifications',
          showInMenu: false,
          showInBreadcrumb: true,
          icon: 'icon-settings',
        },
      },
    ],
    meta: {
      title: 'Setting',
      showInMenu: false,
      showInBreadcrumb: false,
      icon: 'icon-settings',
      // 是否为一级路由
      isTopLevelRoute: true,
    },
  },
  // 分享模块路由
  {
    path: '/share',
    name: RouteName.SHARE,
    component: () => import('@/share/index.vue'),
    children: [
      // 分享论坛详情页的路由
      {
        path: '/share/forum/:id',
        name: 'ForumInfo',
        component: () => import('@/share/ForumInfo.vue'),
        meta: {
          title: 'Forum Info',
          showInMenu: false,
          showInBreadcrumb: false,
        },
      },
      // ai 聊天的分享页
      {
        path: '/share/ai-chat/:id',
        name: 'AI Chat Info',
        component: () => import('@/share/AiChatInfo.vue'),
        meta: {
          title: 'AI Chat Info',
          showInMenu: false,
          showInBreadcrumb: false,
        },
      },
      // 车辆详情报告页
      {
        path: '/share/vehicle-report/:id',
        name: 'Vehicle Report',
        component: () => import('@/share/VehicleReportInfo.vue'),
        meta: {
          title: 'Vehicle Report',
          showInMenu: false,
          showInBreadcrumb: false,
        },
      },
      // 车辆 DTCs 报告页
      {
        path: '/share/vehicle-dtcs-report/:id',
        name: 'Vehicle DTCs Report',
        component: () => import('@/share/VehicleDTCsReportInfo.vue'),
        meta: {
          title: 'Vehicle DTCs Report',
          showInMenu: false,
          showInBreadcrumb: false,
        },
      },
      // 车辆错误码详情页
      {
        path: '/share/fault-details/:id',
        name: 'Fault Details',
        component: () => import('@/share/VehicleFaultDetails.vue'),
        meta: {
          title: 'Fault Details',
          showInMenu: false,
          showInBreadcrumb: false,
        },
      },
      // 邮箱验证码页
      {
        path: '/share/codes',
        name: 'Code Details',
        component: () => import('@/share/CodeInfo.vue'),
        meta: {
          title: 'Code Details',
          showInMenu: false,
          showInBreadcrumb: false,
        },
      },
      // 车辆Profile页
      {
        path: '/share/vehicle-profile/:id',
        name: 'Vehicle Profile',
        component: () => import('@/share/VehicleProfileInfo.vue'),
        meta: {
          title: 'Vehicle Profile',
          showInMenu: false,
          showInBreadcrumb: false,
        },
      },
      // 活动订单填写页
      {
        path: '/share/activity-order',
        name: 'Activity Order Management',
        component: () => import('@/share/ActivityOrderManagement.vue'),
        meta: {
          title: 'Activity Order Management',
          showInMenu: false,
          showInBreadcrumb: false,
        },
      },
    ],
    meta: {
      title: RouteName.SHARE,
      showInMenu: false,
      showInBreadcrumb: false,
      // 是否为一级路由
      isTopLevelRoute: true,
    },
  },
  // 任意路由
  {
    path: '/:pathMatch(.*)*',
    name: RouteName.ANY,
    redirect: '/dashboard',
    meta: {
      title: RouteName.ANY,
      showInMenu: false,
      showInBreadcrumb: false,
      // 是否为一级路由
      isTopLevelRoute: true,
    },
  },
]

export default constantRoutes
