<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'

import emitter from '@/utils/emitterUtil.js'
import { EmitterEvent } from '@/utils/constantsUtil.js'

import CompanyLogo from '@/assets/icons/logo.svg'

// 路由
const route = useRoute()

// 面包屑列表
const breadcrumbList = ref(route.matched.map((item) => item))

// 更新面包屑
emitter.on(EmitterEvent.UPDATE_BREADCRUMB_LIST, (val) => {
  if (route.path.includes('/app-configuration/brand-model/manage/')) {
    // 车辆品牌管理模块详情, 修改面包屑, 显示车辆品牌名称
    breadcrumbList.value.find((item) => {
      if (item.path.includes('/app-configuration/brand-model/manage/')) {
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
    :separator-icon="ArrowRight"
    class="heading-body-body-12px-medium box-border px-32 pb-16 pt-24"
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
