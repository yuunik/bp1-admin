<script setup>
import { onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useCloned } from '@vueuse/core'

import emitter from '@/utils/emitterUtil.js'
import { EmitterEvent } from '@/utils/constantsUtil.js'
import { useUserStore } from '@/store/index.js'
import CompanyLogo from '@/assets/images/company-logo.png'

// 路由
const route = useRoute()

// 路由器
const router = useRouter()

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 若路由有清除面包屑的 meta, 则清空面包屑
  if (to.meta.isClearBreadcrumb && !isClickBreadcrumb.value) {
    // 清空面包屑
    breadcrumb.value = []
    breadcrumbList.value = []
    isGetTopLevelRoute.value = false
  }

  // 继续导航
  next()
})

// 面包屑列表
// const breadcrumbList = computed(() => {
//   // route.matched.map((item , index ) => {
//   //   if (item.name === 'View Vehicle') {
//   //     console.log(route, '???????????')
//   //   }
//   //   console.log(item, '@@@@@@@@@@@@@@@@@@@@@@')
//   //   return item
//   // })
//   let tempList = JSON.parse(JSON.stringify(route.matched))
//   tempList.map((x) => {
//     if (x.name === 'View Vehicle' && route.query?.obdId) {
//       tempList.find((y) => y.name.includes(':id')).path =
//         `/obd-management/obd-details/${route.query.obdId}`
//     }
//     return x
//   })
//   console.log(tempList)
//   return tempList
// })

const userStore = useUserStore()

const { breadcrumb } = storeToRefs(userStore)

// 面包屑列表
const breadcrumbList = ref([])

// 是否获取一级路由
const isGetTopLevelRoute = ref(false)

// 是否点击面包屑
const isClickBreadcrumb = ref(false)

// 当前点击面包屑的索引值
const clickIndex = ref(-1)

// 实际渲染的面包屑列表
const realBreadcrumbList = computed(() =>
  breadcrumbList.value
    .filter((b) => b.meta?.showInBreadcrumb)
    .map((b) => ({
      ...b,
      clickable: b.meta?.isTopLevelRoute,
    })),
)

// 监听路由的变化
watch(
  () => route.matched,
  () => {
    // 点击面包屑时, 不执行更新面包屑操作, 需要删除多余的面包屑
    if (isClickBreadcrumb.value) {
      // 删除点击项的面包屑
      breadcrumbList.value = breadcrumbList.value.slice(0, clickIndex.value + 1)
      // 重置持久化的面包屑数据
      breadcrumb.value = breadcrumb.value.slice(0, clickIndex.value + 1)
      isClickBreadcrumb.value = false
      clickIndex.value = -1
      return
    }

    // 获取一级路由
    const topLevelRoute = route.matched.find(
      (item) => item.meta?.isTopLevelRoute,
    )
    // 若没有获取过一级路由, 则添加一级路由
    if (!isGetTopLevelRoute.value && topLevelRoute) {
      isGetTopLevelRoute.value = true
      breadcrumbList.value.push({
        name: topLevelRoute.name,
        path: topLevelRoute.path,
        meta: { ...topLevelRoute.meta },
      })
    }
    // 深拷贝, 以免影响原数据
    // 添加当前路由
    breadcrumbList.value.push({
      name: route.name,
      path: route.path,
      meta: { ...route.meta },
    })
    // 与仓库中的记录的面包屑进行比较, 若长度小于仓库中的记录, 则说明说为刷新情况, 则将仓库中的记录的面包屑进行覆盖
    if (breadcrumbList.value.length < breadcrumb.value.length) {
      breadcrumbList.value = breadcrumb.value
    } else {
      // 否则, 则将当前路由添加到仓库中
      breadcrumb.value = breadcrumbList.value.map((x) => ({
        path: x.path,
        name: x.name,
        meta: x.meta,
      }))
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

// 面包屑的点击事件
const handleBreadcrumbClick = (route, routeIndex) => {
  // 若不是点击一级路由, 则进行路由跳转
  if (routeIndex !== 0 || routeIndex === realBreadcrumbList.value.length - 1) {
    router.push(route.path)
    isClickBreadcrumb.value = true
    clickIndex.value = routeIndex
  }
}

// 更新面包屑
emitter.on(EmitterEvent.UPDATE_BREADCRUMB_LIST, (val) => {
  if (route.path.includes('/app-configuration/brand-model/manage/')) {
    // 车辆品牌管理模块详情, 修改面包屑, 显示车辆品牌名称
    breadcrumbList.value.find((item) => {
      if (item.path.includes('/app-configuration/brand-model/manage/')) {
        item.meta.title = val
      }
    })
  } else if (
    route.path.includes('/obd-management/obd-list/obd-details/vehicle-details')
  ) {
    breadcrumbList.value.find((item) => {
      if (item.path === '/obd-management/obd-details/:id') {
        // 修改 OBD Details 的 path 和 title
        item.path = `/obd-management/obd-details/${val.id}`
        item.meta.title = val.sn
      }
    })
  } else if (route.path.includes('/obd-management/obd-details/')) {
    breadcrumbList.value.find((item) => {
      if (item.path.includes('/obd-management/obd-details/')) {
        item.meta.title = val
      }
    })
  } else if (route.path.includes('/forum-management/list')) {
    breadcrumbList.value.find((item) => {
      if (item.path.includes('/forum-management/list')) {
        item.meta.title = 'Forum List'
      }
    })
  }
})

// 清空面包屑
emitter.on(EmitterEvent.CLEAR_BREADCRUMB_LIST, () => {
  breadcrumb.value = []
  breadcrumbList.value = []
  isGetTopLevelRoute.value = false
})

// 销毁监听
onBeforeUnmount(() => {
  emitter.off(EmitterEvent.UPDATE_BREADCRUMB_LIST)
  emitter.off(EmitterEvent.CLEAR_BREADCRUMB_LIST)
})
</script>

<template>
  <el-breadcrumb
    v-if="route.path !== '/dashboard'"
    separator=">"
    :separator-icon="ArrowRight"
    class="heading-body-body-12px-medium box-border px-32 pb-16 pt-24"
  >
    <el-breadcrumb-item>
      <el-image
        :src="CompanyLogo"
        class="h-16 w-16"
        fit="cover"
        alt="CompanyLogo"
      />
    </el-breadcrumb-item>
    <!-- 默认显示面包屑, 若不需要显示面包屑, 则需要 meta 加 hideBreadcrumb -->
    <el-breadcrumb-item
      v-for="(route, index) in realBreadcrumbList"
      :key="route.path"
      @click="handleBreadcrumbClick(route, index)"
    >
      <!-- 面包屑标题 -->
      <span
        :class="[
          'heading-body-body-12px-medium',
          $route.name === route.name
            ? 'text-neutrals-off-black cursor-default!'
            : 'text-neutrals-grey-3 cursor-pointer',
          route.meta.isTopLevelRoute ? 'cursor-default!' : '',
          {
            'cursor-pointer!':
              index !== realBreadcrumbList.length - 1 || index === 0,
          },
        ]"
      >
        {{ route.meta.title }}
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
