<script setup>
import { reactive } from 'vue'
import { addBrandModelApi } from '@/apis/appApi.js'

// 待添加列表
const addModelList = reactive([])

// 新增待添加的车辆品牌
const addPendingBrandModel = () =>
  addModelList.push({ isChecked: false, brandModelName: '', editing: true })

// 新增车辆品牌型号
const addBrandModel = async () => {
  const { data } = await addBrandModelApi(addModelList)
  // 添加成功
}
</script>

<template>
  <section class="h-full">
    <!-- header -->
    <div class="py-16 px-32 flex-between">
      <h3 class="heading-h2-20px-medium neutrals-off-black">Create Brand</h3>
      <div class="flex gap-8">
        <el-button>Cancel</el-button>
        <el-button type="primary">Create</el-button>
      </div>
    </div>
    <!-- divider -->
    <el-divider />
    <!-- content -->
    <div>
      <!-- 品牌信息 -->
      <div class="px-32 pt-16 pb-24 flex gap-24">
        <!-- 品牌 logo -->
        <div class="flex-1 w-400 h-80 flex gap-24">
          <!-- logo -->
          <el-avatar :size="64" src="https://picsum.photos/64/64" fit="cover" />
          <!-- desc -->
          <div class="flex flex-col gap-16">
            <el-text>Upload Logo</el-text>
            <!-- 更换 logo 图片 -->
            <el-button>Upload</el-button>
          </div>
        </div>
        <!-- 品牌名称 -->
        <div class="flex-1 w-384 h-80 flex gap-8 bottom-border-only">
          <!-- 标签 -->
          <label
            class="w-112 h-32 heading-body-body-12px-medium neutrals-grey-3"
          >
            Brand
          </label>
          <!-- 值 -->
          <el-input placeholder="Enter" class="h-32" />
        </div>
      </div>
      <!-- 型号信息-->
      <div>
        <!-- 标签信息 -->
        <div class="px-32 py-7 box-border flex items-center-safe gap-8">
          <h4>Model List</h4>
          <!-- 型号数量 -->
          <!--<el-text class="flex-1">2222222</el-text>-->
        </div>
        <!-- 分割线 -->
        <el-divider class="mt-8" />
        <!-- 车辆品牌表格 -->
        <div class="px-32">
          <!-- 表头 -->
          <div class="model-list-table-title">
            <el-checkbox label="Model" class="ml-8" />
          </div>
          <!-- 型号列表 -->
          <ul
            class="grid grid-cols-3 gap-x-24 [&>li]:border-b [&>li]:border-b-solid [&>li]:border-b-[#EAEEF4] [&>li]:h-[40px] [&>li]:pl-8 [&>li]:box-border [&>li]:flex [&>li]:items-center"
          >
            <li
              v-for="vehicleModel in 9"
              :key="vehicleModel"
              class="heading-body-body-12px-regular neutrals-off-black"
            >
              <el-checkbox>
                <template #default>
                  <el-input placeholder="Enter..." class="h-32" />
                  <i class="icon icon-delete-bin-line ml-16" />
                </template>
              </el-checkbox>
            </li>
          </ul>
          <!-- 新增按钮 -->
          <el-button type="primary" text>
            <template #icon>
              <i class="icon-typesadd" />
            </template>
            <template #default>New Item</template>
          </el-button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
// el-input 输入框样式重置
.bottom-border-only :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

.bottom-border-only :deep(.el-input__wrapper::after) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--el-input-border-color, var(--el-border-color));
  pointer-events: none;
}

// 型号列表表头样式
.model-list-table-title {
  height: 32px;
  line-height: 32px;
  border-bottom: 1px solid $neutrals-grey-1;

  :deep(.el-checkbox) {
    @apply flex items-center gap-16;
    color: $neutrals-grey-3;
  }
}
</style>
