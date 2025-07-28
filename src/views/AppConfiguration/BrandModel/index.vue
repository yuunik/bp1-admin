<script setup>
// 获取车辆品牌列表
import { getBrandModalListApi } from '@/apis/appApi.js'

// 获取车辆品牌列表
const getBrandModelList = async () => {
  const res = await getBrandModalListApi()
  console.log(res)
}

// 网络请求
getBrandModelList()
</script>

<template>
  <section class="brand-model-container">
    <!-- Brand Model Header -->
    <div class="px-32 pb-16">
      <!-- 标题栏 -->
      <div class="flex-between">
        <h3 class="heading-h2-20px-medium">Brand & Model</h3>
        <!-- 创建车辆按钮 -->
        <el-button type="primary" class="w-70 h-32">Create</el-button>
      </div>
      <!-- 搜索栏 -->
      <el-input placeholder="Search..." class="mt-16 obd-list-search">
        <template #prefix>
          <!-- 前置搜索图标 -->
          <i class="icon-typessearch w-16 h-16" />
        </template>
      </el-input>
    </div>
    <!-- 分割线 -->
    <el-divider class="diver" />
    <!-- todo: Brand Model 表格 -->
  </section>
</template>

<style scoped lang="scss">
// 搜索框
.brand-model-container {
  // 输入框样式重置
  :deep(.el-input__wrapper) {
    box-shadow: none;
    background-color: transparent;
  }
}
</style>
