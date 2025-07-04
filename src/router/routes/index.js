const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {}
  },
  {
    path: "/",
    redirect: "/homepage",
    name: "Layout",
    component: () => import("@/layout/index.vue"),
    children: [
      {
        path: "/homepage",
        name: "HomePage",
        component: () => import("@/views/homepage/index.vue"),
      }
    ]
  }
]

export default routes