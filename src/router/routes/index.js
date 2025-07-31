const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
    meta: {
      // 显示在菜单栏的标题
      title: 'Login',
      // 控制是否显示在菜单栏
      isShow: false,
    },
  },
  {
    path: '/',
    redirect: '/dashboard',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: {
          title: 'Dashboard',
          isShow: true,
          icon: 'icon-dashboard',
        },
      },
    ],
    meta: {
      title: 'Layout',
      isShow: false,
    },
  },
  {
    path: '/order-management',
    name: 'OrderManagement',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: 'Order management',
      isShow: true,
      icon: 'icon-order-management',
    },
  },
  {
    path: '/obd-management',
    redirect: '/obd-management/obd-list',
    name: 'ObdManagement',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/obd-management/obd-list',
        name: 'ObdList',
        component: () => import('@/views/ObdManagement/ObdList/index.vue'),
        meta: {
          title: 'ObdList',
          isShow: true,
        },
      },
      {
        path: '/obd-management/inventory',
        name: 'Inventory',
        component: () => import('@/views/ObdManagement/Inventory/index.vue'),
        meta: {
          title: 'Inventory',
          isShow: true,
        },
      },
    ],
    meta: {
      title: 'OBD Management',
      isShow: true,
      icon: 'icon-obd-management',
    },
  },
  {
    path: '/user-management',
    redirect: '/user-management/internal',
    name: 'UserManagement',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/user-management/internal',
        name: 'Internal',
        component: () => import('@/views/UserManagement/Internal/index.vue'),
        meta: {
          title: 'Internal',
          isShow: true,
        },
      },
      {
        path: '/user-management/extern',
        name: 'Extern',
        component: () => import('@/views/UserManagement/Extern/index.vue'),
        meta: {
          title: 'Extern',
          isShow: true,
        },
      },
    ],
    meta: {
      title: 'User Management',
      isShow: true,
      icon: 'icon-user-management',
    },
  },
  {
    path: '/database',
    name: 'Database',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: 'Database',
      isShow: true,
      icon: 'icon-database',
    },
  },
  {
    path: '/app-configuration',
    redirect: '/app-configuration/version-control',
    name: 'AppConfiguration',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/app-configuration/version-control',
        name: 'VersionControl',
        component: () =>
          import('@/views/AppConfiguration/VersionControl/index.vue'),
        meta: {
          title: 'Version Control',
          isShow: true,
        },
      },
      {
        path: '/app-configuration/brand-Model',
        name: 'BrandAndModel',
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
              // 是否隐藏面包屑
              hideBreadcrumb: true,
              isShow: true,
            },
          },
          // 车辆管理页面
          {
            path: '/app-configuration/brand-Model/manage/:id',
            name: 'BrandAndModelManagement',
            component: () =>
              import(
                '@/views/AppConfiguration/BrandModel/BrandModelManage.vue'
              ),
            params: true,
          },
        ],
        meta: {
          title: 'Brand & Model',
          isShow: true,
        },
      },
      {
        path: '/app-configuration/ai-chat-management',
        name: 'AiChatManagement',
        component: () =>
          import('@/views/AppConfiguration/AiChatManagement/index.vue'),
        meta: {
          title: 'AI Chat Management',
          isShow: true,
        },
      },
    ],
    meta: {
      title: 'App Configuration',
      isShow: true,
      icon: 'icon-app-configuration',
    },
  },
  // 分享模块路由
  {
    path: "/share",
    name: "Share",
    component: () => import("@/share/index.vue"),
    children: [
        // 分享论坛详情页的路由
      {
        path: '/share/forum/:id',
        name: 'ForumInfo',
        component: () => import("@/share/ForumInfo.vue"),
        meta: {
          title: 'Forum Info',
          isShow: false
        }
      }
    ],
    meta: {
      title: "Share Page",
      isShow: false,
    }
  }
]

export default constantRoutes
