<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vue-router'

import emitter from '@/utils/emitterUtil.js'
import { EmitterEvent } from '@/utils/constantsUtil.js'

import CompanyLogo from '@/assets/icons/logo.svg'

const route = useRoute()
const breadcrumbList = ref(route.matched.map((item) => item))

emitter.on(EmitterEvent.UPDATE_BREADCRUMB_LIST, (val) => {
  if (route.path.includes('/app-configuration/brand-Model/manage/')) {
    // 车辆品牌管理模块详情, 修改面包屑, 显示车辆品牌名称
    breadcrumbList.value.find((item) => {
      if (item.path.includes('/app-configuration/brand-Model/manage/')) {
        console.log(val)
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
    class="p-[24px_32px_16px_32px] heading-body-body-12px-medium box-border"
  >
    <el-breadcrumb-item>
      <el-image :src="CompanyLogo" alt="CompanyLogo" />
    </el-breadcrumb-item>
    <!-- 默认显示面包屑, 若不需要显示面包屑, 则需要 meta 加 hideBreadcrumb -->
    <template v-for="route in breadcrumbList">
      <el-breadcrumb-item
        v-if="route?.meta?.isShow"
        :to="route.path"
        :key="route.path"
      >
        <!-- 面包屑标题 -->
        <span
          class="heading-body-body-12px-medium"
          :class="
            $route.path === route.path
              ? 'neutrals-off-black'
              : 'neutrals-grey-3'
          "
        >
          {{ route.meta.title }}
        </span>
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>
