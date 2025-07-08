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
        component: () => import('@/views/Homepage/index.vue'),
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
    name: 'ObdManagement',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: 'obd-list',
        name: 'ObdList',
        component: () => import('@/views/ObdManagement/ObdList/index.vue'),
        meta: {
          title: 'ObdList',
          isShow: true,
        },
      },
      {
        path: 'inventory',
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
    name: 'UserManagement',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: 'internal',
        name: 'Internal',
        component: () => import('@/views/UserManagement/Internal/index.vue'),
        meta: {
          title: 'Internal',
          isShow: true,
        },
      },
      {
        path: 'extern',
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
    redirect: '/version-control',
    name: 'AppConfiguration',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: 'version-control',
        name: 'VersionControl',
        component: () => import('@/views/AppConfiguration/VersionControl/index.vue'),
        meta: {
          title: 'Version Control',
          isShow: true,
        },
      },
      {
        path: 'brandAndModel',
        name: 'BrandAndModel',
        component: () => import('@/views/AppConfiguration/BrandModel/index.vue'),
        meta: {
          title: 'Brand & Model',
          isShow: true,
        },
      },
      {
        path: 'aiChatManagement',
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