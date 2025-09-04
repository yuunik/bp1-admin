<script setup>
import { onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'

import emitter from '@/utils/emitterUtil.js'
import { EmitterEvent } from '@/utils/constantsUtil.js'

import CompanyLogo from '@/assets/images/company-logo.png'

// 路由
const route = useRoute()

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

const breadcrumbList = ref([])

const realBreadcrumbList = computed(() =>
  breadcrumbList.value.filter(
    (breadcrumb) => breadcrumb.meta?.showInBreadcrumb,
  ),
)

watch(
  () => route.matched,
  (val) => {
    breadcrumbList.value = JSON.parse(JSON.stringify(val))
  },
  {
    deep: true,
    immediate: true,
  },
)

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
  }
})

onBeforeUnmount(() => {
  emitter.off(EmitterEvent.UPDATE_BREADCRUMB_LIST)
})
</script>

<template>
  <el-breadcrumb
    separator=">"
    v-if="route.path !== '/dashboard'"
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
      v-for="route in realBreadcrumbList"
      :key="route.path"
      @click="$router.push(route.path)"
    >
      <!-- 面包屑标题 -->
      <span
        class="heading-body-body-12px-medium"
        :class="
          $route.name === route.name
            ? 'neutrals-off-black cursor-not-allowed'
            : 'neutrals-grey-3 cursor-pointer'
        "
      >
        {{ route.meta.title }}
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
