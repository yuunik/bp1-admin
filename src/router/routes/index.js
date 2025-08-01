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
      isShow: false,
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
          isShow: true,
          icon: 'icon-dashboard',
        },
      },
    ],
    meta: {
      title: RouteName.LAYOUT,
      isShow: false,
    },
  },
  {
    path: '/order-management',
    name: RouteName.ORDER_MANAGEMENT,
    component: () => import('@/layout/index.vue'),
    meta: {
      title: RouteName.ORDER_MANAGEMENT,
      isShow: true,
      icon: 'icon-order-management',
    },
  },
  {
    path: '/obd-management',
    redirect: '/obd-management/obd-list',
    name: RouteName.OBD_MANAGEMENT,
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/obd-management/obd-list',
        name: RouteName.OBD_LIST,
        component: () => import('@/views/ObdManagement/ObdList/index.vue'),
        meta: {
          title: RouteName.OBD_LIST,
          isShow: true,
        },
      },
      {
        path: '/obd-management/inventory',
        name: RouteName.INVENTORY,
        component: () => import('@/views/ObdManagement/Inventory/index.vue'),
        meta: {
          title: RouteName.INVENTORY,
          isShow: true,
        },
      },
    ],
    meta: {
      title: RouteName.OBD_MANAGEMENT,
      isShow: true,
      icon: 'icon-obd-management',
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
        meta: {
          title: RouteName.INTERNAL,
          isShow: true,
        },
      },
      {
        path: '/user-management/extern',
        name: RouteName.EXTERN,
        component: () => import('@/views/UserManagement/Extern/index.vue'),
        meta: {
          title: RouteName.EXTERN,
          isShow: true,
        },
      },
    ],
    meta: {
      title: RouteName.USER_MANAGEMENT,
      isShow: true,
      icon: 'icon-user-management',
    },
  },
  {
    path: '/database',
    name: RouteName.DATABASE,
    component: () => import('@/layout/index.vue'),
    meta: {
      title: RouteName.DATABASE,
      isShow: true,
      icon: 'icon-database',
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
          isShow: true,
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
              isShow: false,
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
              isShow: true,
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
              isShow: true,
            },
          },
        ],
        meta: {
          title: RouteName.BRAND_MODEL,
          isShow: true,
        },
      },
      {
        path: '/app-configuration/ai-chat-management',
        name: RouteName.AI_CHAT_MANAGEMENT,
        component: () =>
          import('@/views/AppConfiguration/AiChatManagement/index.vue'),
        meta: {
          title: RouteName.AI_CHAT_MANAGEMENT,
          isShow: true,
        },
      },
      {
        path: '/app-configuration/interval-warning',
        name: RouteName.INTERVAL_WARNING,
        component: () =>
          import('@/views/AppConfiguration/IntervalWarning/index.vue'),
        meta: {
          title: RouteName.INTERVAL_WARNING,
          isShow: true,
        },
      },
    ],
    meta: {
      title: RouteName.APP_MANAGEMENT,
      isShow: true,
      icon: 'icon-app-configuration',
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
          isShow: false,
        },
      },
    ],
    meta: {
      title: RouteName.SHARE,
      isShow: false,
    },
  },
  // 任意路由
  {
    path: '/:pathMatch(.*)*',
    name: RouteName.ANY,
    redirect: '/dashboard',
  },
]

export default constantRoutes
