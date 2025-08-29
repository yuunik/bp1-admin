<script setup>
import { useRoute, useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

import {
  addBrandModelApi,
  deleteBrandModelApi,
  getBrandModelInfoApi,
  modifyBrandInfoApi,
  modifyBrandModelApi,
} from '@/apis/appApi.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import emitter from '@/utils/emitterUtil.js'
import { EmitterEvent, RouteName } from '@/utils/constantsUtil.js'

// 车辆详情
const brandModelInfo = reactive({})

// 编辑模式
const isEdit = ref(false)

// 获取车辆品牌详情
const getBrandModelInfo = async (id) => {
  const { data } = await getBrandModelInfoApi(id)
  // 请求成功
  Object.assign(brandModelInfo, data)
  // 记录品牌的编辑状态为 false
  data.isEdit = false
  // 更新面包屑
  for (const item of brandModelInfo?.vehicleModelDtos) {
    // 记录型号的编辑状态为 false
    item.isEdit = false
  }
  // 更新面包屑
  emitter.emit(EmitterEvent.UPDATE_BREADCRUMB_LIST, brandModelInfo.brand)
}

// 获取路由
const route = useRoute()
// 获取路由器
const router = useRouter()
// id 字段校验
if (route.params.id) {
  // 有 id , 则说明查看详情
  getBrandModelInfo(route.params.id)
} else {
  // 无 id , 则跳转至首页
  router.push({ name: RouteName.DASHBOARD })
}

// 新增车辆品牌型号
const handleAddBrandModel = async () => {
  // 添加车辆品牌及型号
  await addBrandModelApi({
    name: pendingBrand,
    models: pendingBrandModelList.map((item) => item.brandModelName).join(''),
    logo: logoFile,
  })
  // 添加成功
  ElMessage.success('Add Brand Model Success')
  // 跳转列表页
  router.back()
}

// 删除车辆品牌型号
const handleDeleteBrandModel = async (id) => {
  await deleteBrandModelApi(id)
  // 删除成功
  ElMessage.success('Delete Brand Model Success')
  // 删除车辆品牌型号（从列表中删除）
  brandModelList.splice(
    brandModelList.findIndex((item) => item.id === id),
    1,
  )
}

// 编辑车辆品牌型号
const handleEditBrandInfo = async () => {
  await modifyBrandInfoApi({
    brandId: brandModelInfo.id,
    name: brandModelInfo.brand,
    models:
      brandModelInfo.vehicleModelDtos &&
      brandModelInfo.vehicleModelDtos?.length > 0
        ? brandModelInfo.vehicleModelDtos.map((item) => item.name)
        : '',
  })
  // 添加成功
  ElMessage.success('Edit Brand Model Success')
  // 跳转列表页
  router.back()
}

// 修改编辑模式
const handleBrandStatusChange = () => {
  // 修改编辑状态
  isEdit.value = !isEdit.value
  // 编辑状态关闭, 则修改品牌
  if (!isEdit.value) {
    // 修改品牌
    handleEditBrandInfo()
  }
}
</script>

<template>
  <section class="h-full">
    <!-- header -->
    <div class="flex-between px-32 py-16">
      <h3 class="heading-h2-20px-medium neutrals-off-black">
        {{ brandModelInfo.brand }}
      </h3>
      <div class="flex gap-8">
        <el-button>Disable</el-button>
        <el-button>Sort</el-button>
        <el-button type="primary" @click="handleBrandStatusChange">
          {{ isEdit ? 'Save' : 'Edit' }}
        </el-button>
      </div>
    </div>
    <!-- divider -->
    <el-divider />
    <!-- content -->
    <div>
      <!-- 品牌信息 -->
      <div class="flex gap-24 px-32 pb-24 pt-16">
        <!-- 品牌 logo -->
        <div class="w-400 flex h-80 flex-1 gap-24">
          <!-- logo -->
          <el-image
            v-if="brandModelInfo"
            :src="getFullFilePath(brandModelInfo?.logo)"
            fit="cover"
            class="h-64 w-64"
            loading="lazy"
          />
          <!-- desc -->
          <div class="flex flex-col gap-16">
            <el-text class="w-full!">Logo</el-text>
            <!-- 更换 logo 图片 -->
            <el-button>Change</el-button>
          </div>
        </div>
        <!-- 品牌名称 -->
        <div class="w-384 flex h-80 flex-1 flex-col gap-4">
          <!-- 名称 -->
          <div class="flex gap-8">
            <!-- 标签 -->
            <label
              class="w-112 heading-body-body-12px-medium neutrals-grey-3 h-32"
            >
              Brand
            </label>
            <!-- 值 -->
            <template v-if="isEdit">
              <el-input v-model="brandModelInfo.brand" />
            </template>
            <template v-else>
              <el-text class="w-264 h-32">
                {{ brandModelInfo?.brand ?? '-' }}
              </el-text>
            </template>
          </div>
          <!-- 状态 -->
          <div class="flex gap-8">
            <!-- 标签 -->
            <label
              class="w-112 heading-body-body-12px-medium neutrals-grey-3 leading-32 h-32"
            >
              Status
            </label>
            <!-- 值 -->
            <div class="w-264 h-32">
              <el-tag
                :type="brandModelInfo.isDelete === 0 ? 'success' : 'info'"
              >
                {{ brandModelInfo.isDelete === 0 ? 'Active' : 'Disabled' }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      <!-- 型号信息-->
      <div>
        <!-- 标签信息 -->
        <div class="items-center-safe box-border flex gap-8 px-32 py-7">
          <h4>Model List</h4>
          <!-- 型号数量 -->
          <el-text class="flex-1">
            {{ brandModelInfo?.vehicleModelDtos?.length ?? 0 }}
          </el-text>
        </div>
        <!-- 分割线 -->
        <el-divider class="mt-8" />
        <!-- 型号列表 -->
        <ul
          class="[&>li]:border-b-solid grid grid-cols-3 gap-x-24 px-32 [&>li]:box-border [&>li]:flex [&>li]:h-[40px] [&>li]:items-center [&>li]:border-b [&>li]:border-b-[#EAEEF4] [&>li]:pl-8"
        >
          <li
            v-for="vehicleModel in brandModelInfo?.vehicleModelDtos"
            :key="vehicleModel.id"
            class="heading-body-body-12px-regular neutrals-off-black"
          >
            <el-checkbox v-if="isEdit">
              <template #default>
                <el-input
                  placeholder="Enter..."
                  class="h-32"
                  v-model="vehicleModel.name"
                />
                <!-- 删除待添加项 -->
                <i class="icon icon-delete-bin-line ml-16" />
              </template>
            </el-checkbox>
            <el-text v-else>{{ vehicleModel.name }}</el-text>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
// 重置 el-input 样式
:deep(.el-input) {
  @apply rounded-12 h-32;

  .el-input__wrapper {
    @apply rounded-12 bg-[#EAEEF4];

    .el-input__inner {
      @apply placeholder:text-14 placeholder:text-red placeholder:font-normal;
    }
  }
}
</style>
