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
    },
  },
  {
    path: '/orderManagement',
    redirect: '/order-management',
    name: 'OrderManagement',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/order-management',
        name: RouteName.ORDER_MANAGEMENT,
        component: () => import('@/views/OrderManagement/index.vue'),
        meta: {
          title: RouteName.ORDER_MANAGEMENT,
          showInMenu: true,
          showInBreadcrumb: true,
          icon: 'icon-typesOrderManagement',
          selectedIcon: 'icon-typelist',
        },
      },
    ],
    meta: {
      title: 'OrderManagement',
      showInMenu: true,
      showInBreadcrumb: true,
    },
  },
  {
    path: '/obd-management',
    redirect: '/obd-management/obd-list',
    name: RouteName.OBD_MANAGEMENT,
    component: () => import('@/layout/index.vue'),
    children: [
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
        children: [
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
        ],
        meta: {
          title: RouteName.OBD_DETAILS,
          showInMenu: false,
          showInBreadcrumb: true,
        },
      },
      {
        path: '/obd-management/inventory',
        name: RouteName.INVENTORY,
        component: () => import('@/views/ObdManagement/Inventory/index.vue'),
        children: [
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
          // detail
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
          title: RouteName.INVENTORY,
          showInMenu: true,
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
    },
  },
  {
    path: '/user-management',
    redirect: '/user-management/internal',
    name: RouteName.USER_MANAGEMENT,
    component: () => import('@/layout/index.vue'),
    children: [
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
      {
        path: '/user-management/extern',
        name: RouteName.EXTERN,
        component: () => import('@/views/UserManagement/Extern/index.vue'),
        children: [
          {
            path: '/user-management/extern/manage/:id',
            name: 'External Manage',
            component: () =>
              import('@/views/UserManagement/Extern/ExternManagement.vue'),
            meta: {
              title: 'External Manage',
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
        ],
        meta: {
          title: RouteName.EXTERN,
          showInMenu: true,
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
    },
  },
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
      showInBreadcrumb: true,
      icon: 'icon-Component-5-4',
      selectedIcon: 'icon-typedatabase-2-fill',
    },
  },
  {
    path: '/forum-management',
    redirect: '/forum-management/list',
    name: 'Forum Management',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/forum-management/list',
        name: 'Forum Management List',
        component: () => import('@/views/ForumManagement/index.vue'),
        children: [
          // 贴文详情页
          {
            path: '/forum-management/post-details/:id',
            name: RouteName.POST_DETAILS,
            component: () => import('@/views/ForumManagement/PostDetails.vue'),
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
              import('@/views/ForumManagement/CommentDetails.vue'),
            meta: {
              title: RouteName.COMMENT_DETAILS,
              showInMenu: false,
              showInBreadcrumb: true,
            },
          },
        ],
        meta: {
          title: 'Forum Management',
          showInMenu: true,
          showInBreadcrumb: true,
          icon: 'icon-typeForum',
          selectedIcon: 'icon-typeForum',
        },
      },
    ],
    meta: {
      title: 'Forum Management',
      showInMenu: true,
      showInBreadcrumb: false,
      icon: 'icon-typeForum',
      selectedIcon: 'icon-typeForum',
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
        name: RouteName.BRAND_MODEL,
        component: () =>
          import('@/views/AppConfiguration/BrandModel/index.vue'),
        children: [
          // 车辆表格页面
          {
            path: '',
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
    ],
    meta: {
      title: RouteName.APP_MANAGEMENT,
      showInMenu: true,
      showInBreadcrumb: true,
      icon: 'icon-typesOrderManagement',
      selectedIcon: 'icon-typelist',
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
    ],
    meta: {
      title: RouteName.SHARE,
      showInMenu: false,
      showInBreadcrumb: false,
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
    },
  },
]

export default constantRoutes
