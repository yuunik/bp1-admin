<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

import { addBrandApi, addBrandModelApi } from '@/apis/appApi.js'
import useFileUpload from '@/composables/useFileUpload.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import BaseUpload from '@/components/BaseUpload.vue'

const router = useRouter()

// 待添加的车辆品牌
const pendingBrand = reactive({
  name: '',
  editing: true,
  // logo 用于图片的回显
  logo: '',
  // file 用于logo的上传
  file: null,
})

// 待添加的车辆品牌型号列表, 初始默认添加三个
const pendingBrandModelList = reactive([
  { isChecked: false, brandModelName: '', editing: true },
  { isChecked: false, brandModelName: '', editing: true },
  { isChecked: false, brandModelName: '', editing: true },
])

// 新增待添加的车辆品牌
const handleAddPendingBrandModel = () =>
  pendingBrandModelList.push({
    isChecked: false,
    brandModelName: '',
    editing: true,
  })

// 删除待添加车辆品牌型号
const handleDeletePendingBrandModelItem = (index) =>
  pendingBrandModelList.splice(index, 1)

// 获取上传的本地文件
const handleGetLocalFile = (file) => {
  // 显示图片
  pendingBrand.logo = URL.createObjectURL(file)
  // 获取文件
  pendingBrand.file = file
}

// 新增车辆品牌及型号
const handleAddBrand = async () => {
  // 品牌名非空校验
  if (pendingBrand.name.trim() === '') {
    // 提示
    return ElMessage.error("Brand Name Can't Be Empty")
  }

  // 型号名非空校验
  if (pendingBrandModelList.some((item) => item.brandModelName.trim() === '')) {
    // 提示
    return ElMessage.error('Please Fill In All Model Names')
  }

  // 添加车辆品牌及型号
  await addBrandApi({
    name: pendingBrand.name,
    models: pendingBrandModelList
      .filter((item) => item.brandModelName.trim() !== '')
      .map((item) => item.brandModelName.trim())
      .join(','),
    logo: pendingBrand.file || '',
  })
  // 添加成功
  ElMessage.success('Add Brand Model Success')
  // 跳转列表页
  router.back()
}

// 处理输入品牌型号名的失焦事件
const handleBrandModelInputBlur = (blurIndex) => {
  // 非空校验
  if (pendingBrandModelList[blurIndex].brandModelName.trim() === '') {
    // 提示
    return ElMessage.error("Brand Model Name Can't Be Empty")
  }
  // 去空
  pendingBrandModelList[blurIndex].brandModelName =
    pendingBrandModelList[blurIndex].brandModelName.trim()
  // 修改编辑模式
  pendingBrandModelList[blurIndex].editing = false
}

// 处理输入品牌名的失焦事件
const handleBrandInputBlur = () => {
  // 非空校验
  if (pendingBrand.name.trim() === '') {
    // 提示
    return ElMessage.error("Brand Name Can't Be Empty")
  }
  // 去空
  pendingBrand.name = pendingBrand.name.trim()
  // 修改编辑模式
  pendingBrand.editing = false
}
</script>

<template>
  <section class="flex h-full flex-col">
    <!-- header -->
    <div class="flex-between px-32 py-16">
      <h3 class="heading-h2-20px-medium neutrals-off-black">Create Brand</h3>
      <div class="flex gap-8">
        <el-button @click="$router.go(-1)">Cancel</el-button>
        <el-button type="primary" @click="handleAddBrand">Create</el-button>
      </div>
    </div>
    <!-- divider -->
    <el-divider />
    <!-- content -->
    <!-- 品牌信息 -->
    <div class="flex gap-24 px-32 pb-24 pt-16">
      <!-- logo -->
      <base-upload
        default-avatar-text="B"
        :img-path="pendingBrand.logo"
        @get-local-file="handleGetLocalFile"
      />
      <!-- 品牌名称 -->
      <div
        class="w-384 bottom-border-only flex h-80 flex-1 justify-start gap-8"
      >
        <!-- 标签 -->
        <label
          class="w-112 heading-body-body-12px-medium neutrals-grey-3 leading-32 h-32"
        >
          Brand
        </label>
        <!-- 编辑状态 -->
        <el-input
          placeholder="Enter"
          class="h-32"
          v-model="pendingBrand.name"
          v-if="pendingBrand.editing"
          @keyup.enter="handleBrandInputBlur"
        />
        <!-- 值 -->
        <el-text v-else class="h-full">{{ pendingBrand.name }}</el-text>
      </div>
    </div>
    <!-- 型号信息-->
    <div>
      <!-- 标签信息 -->
      <div class="items-center-safe box-border flex gap-8 px-32 py-7">
        <h4>Model List</h4>
        <!-- 型号数量 -->
        <el-text class="neutrals-grey-3 flex-1">
          {{ pendingBrandModelList.length }}
        </el-text>
      </div>
      <!-- 分割线 -->
      <el-divider class="mt-8" />
      <!-- 车辆品牌型号表格 -->
      <div class="px-32" v-if="pendingBrandModelList.length > 0">
        <!-- 表头 -->
        <div class="model-list-table-title flex gap-8">
          <el-checkbox label="Model" class="ml-8" />
        </div>
        <!-- 型号列表 -->
        <ul
          class="[&>li]:border-b-solid grid grid-cols-3 gap-x-24 [&>li]:box-border [&>li]:flex [&>li]:h-[40px] [&>li]:items-center [&>li]:border-b [&>li]:border-b-[#EAEEF4] [&>li]:pl-8"
        >
          <li
            v-for="(brandModel, index) in pendingBrandModelList"
            :key="brandModel"
            class="heading-body-body-12px-regular neutrals-off-black"
          >
            <el-checkbox v-if="brandModel.editing">
              <template #default>
                <el-input
                  placeholder="Enter..."
                  class="h-32"
                  @keyup.enter="handleBrandModelInputBlur(index)"
                  v-model="brandModel.brandModelName"
                />
                <!-- 删除待添加项 -->
                <i
                  class="icon icon-delete-bin-line ml-16"
                  @click.stop.prevent="handleDeletePendingBrandModelItem(index)"
                />
              </template>
            </el-checkbox>
            <!-- 品牌名称 -->
            <el-text v-else>{{ brandModel.brandModelName }}</el-text>
          </li>
        </ul>
      </div>
      <!-- 新增按钮 -->
      <el-button
        type="primary"
        text
        @click="handleAddPendingBrandModel"
        class="ml-32"
      >
        <template #icon>
          <i class="icon-typesadd" />
        </template>
        <template #default>New Item</template>
      </el-button>
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

// 添加图标的样式
.icon-typesadd {
  color: $branding-colours-primary;
}

// 重置 el-input 样式
:deep(.el-input) {
  @apply rounded-12 h-32;

  .el-input__wrapper {
    @apply rounded-12 bg-[#EAEEF4] shadow-none;

    .el-input__inner {
      @apply placeholder:text-14 placeholder:font-normal placeholder:text-[#99A0AE];
    }
  }
}
</style>
