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
        component: () => import('@/views/AppConfiguration/VersionControl/index.vue'),
        meta: {
          title: 'Version Control',
          isShow: true,
        },
      },
      {
        path: '/app-configuration/brandAndModel',
        name: 'BrandAndModel',
        component: () => import('@/views/AppConfiguration/BrandModel/index.vue'),
        meta: {
          title: 'Brand & Model',
          isShow: true,
        },
      },
      {
        path: '/app-configuration/aiChatManagement',
        name: 'AiChatManagement',
        component: () => import('@/views/AppConfiguration/AiChatManagement/index.vue'),
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
]

export default constantRoutes