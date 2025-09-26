<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

import {
  addBrandModelApi,
  deleteBrandApi,
  deleteBrandModelApi,
  getBrandModelInfoApi,
  modifyBrandModelNameApi,
  modifyBrandInfoApi,
  uploadBrandLogoApi,
} from '@/apis/appApi.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import emitter from '@/utils/emitterUtil.js'
import { EmitterEvent, RouteName } from '@/utils/constantsUtil.js'
import BaseUpload from '@/components/BaseUpload.vue'
import BaseTag from '@/components/BaseTag.vue'

// 车辆详情
const brandModelInfo = ref({})

// 获取车辆品牌详情
const getBrandModelInfo = async (id) => {
  const { data } = await getBrandModelInfoApi(id)
  // 请求成功
  brandModelInfo.value = data
  // 记录品牌的编辑状态为 false
  data.isEdit = false
  // 更新面包屑
  for (const item of brandModelInfo.value?.vehicleModelDtos) {
    // 记录型号的编辑状态为 false
    item.isEdit = false
  }
  // 更新面包屑
  emitter.emit(EmitterEvent.UPDATE_BREADCRUMB_LIST, brandModelInfo.value.brand)
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

// 获取上传的本地文件
const handleGetLocalFile = async (file) => {
  const {
    data: { logo },
  } = await uploadBrandLogoApi({
    file: file,
    brandId: brandModelInfo.value.id,
  })
  // 修改成功
  ElMessage.success('Upload Logo Success')
  brandModelInfo.value.logo = logo
}

// 编辑车辆品牌名称
const handleEditBrand = async () => {
  await modifyBrandInfoApi({
    id: brandModelInfo.value.id,
    name: brandModelInfo.value.brand,
  })
  // 修改成功
  ElMessage.success('Edit Brand Name Success')
  getBrandModelInfo(route.params.id)
}

// 解禁车辆品牌
const handleEnableBrand = async () => {
  await modifyBrandInfoApi({
    id: brandModelInfo.value.id,
    isDelete: 0,
  })
  // 修改状态成功
  ElMessage.success('Enable Brand Success')
  getBrandModelInfo(route.params.id)
}

// 管理品牌型号名称
const handleEditBrandModelName = async (row) => {
  if (row.id) {
    // 编辑
    await modifyBrandModelNameApi({
      id: row.id,
      name: row.name,
    })
    // 添加成功
    ElMessage.success('Edit Brand Model Name Success')
  } else {
    // 新增
    await addBrandModelApi({
      brandId: brandModelInfo.value.id,
      name: row.name,
    })
    // 添加成功
    ElMessage.success('Add Brand Model Success')
  }
  // 刷新页面
  getBrandModelInfo(route.params.id)
}

// 待添加车辆品牌名称
const handleAddPendingBrandModel = () => {
  brandModelInfo.value.vehicleModelDtos.push({
    name: '',
    isEdit: true,
  })
}

// 删除车辆品牌型号
const handleDeleteBrandModel = async (id) => {
  await deleteBrandModelApi(id)
  // 删除成功
  ElMessage.success('Delete Brand Model Success')
  getBrandModelInfo(route.params.id)
}

// 禁用车辆品牌
const handleDisabledBrand = async () => {
  await deleteBrandApi(brandModelInfo.value.id)
  // 删除成功
  ElMessage.success('Delete Brand Success')
  // 刷新
  getBrandModelInfo(route.params.id)
}
</script>

<template>
  <section class="h-full">
    <!-- header -->
    <div class="flex-between px-32 py-16">
      <h3 class="heading-h2-20px-medium neutrals-off-black">
        {{ brandModelInfo.brand }}
      </h3>
      <el-button v-if="!brandModelInfo.isDelete" @click="handleDisabledBrand">
        Disabled
      </el-button>
      <el-button v-else @click="handleEnableBrand">Enable</el-button>
    </div>
    <!-- divider -->
    <el-divider />
    <!-- content -->
    <div>
      <!-- 品牌信息 -->
      <div class="flex gap-24 px-32 pb-24 pt-16">
        <!-- logo -->
        <base-upload
          :key="brandModelInfo.logo"
          default-avatar-text="B"
          :img-path="getFullFilePath(brandModelInfo.logo)"
          @get-local-file="handleGetLocalFile"
        />
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
            <template v-if="brandModelInfo.isEdit">
              <el-input
                class="brand-name-input"
                v-model="brandModelInfo.brand"
              />
              <div class="flex gap-8">
                <el-button @click="brandModelInfo.isEdit = false">
                  Cancel
                </el-button>
                <el-button @click="handleEditBrand" type="primary">
                  Save
                </el-button>
              </div>
            </template>
            <template v-else>
              <el-text class="w-264 h-32">
                {{ brandModelInfo?.brand ?? '-' }}
              </el-text>
              <i
                class="i-ep:edit ml-8 h-16 w-16 cursor-pointer"
                @click="brandModelInfo.isEdit = true"
              />
            </template>
          </div>
          <!-- 状态 -->
          <div class="row-center gap-8">
            <!-- 标签 -->
            <label
              class="w-112 heading-body-body-12px-medium neutrals-grey-3 leading-32 h-32"
            >
              Status
            </label>
            <!-- 值 -->
            <div class="w-264 row-center h-32">
              <base-tag
                :color="brandModelInfo.isDelete === 0 ? 'green' : 'gray'"
                :text="brandModelInfo.isDelete === 0 ? 'Active' : 'Disabled'"
              />
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
        <div class="table-container mx-32">
          <el-table :data="brandModelInfo?.vehicleModelDtos">
            <el-table-column type="selection" />
            <el-table-column type="index" label="No." />
            <el-table-column prop="name" label="Model">
              <template #default="{ row }">
                <el-input
                  v-if="row.isEdit"
                  placeholder="Enter..."
                  class="h-32"
                  v-model="row.name"
                />
                <span v-else>{{ row.name }}</span>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column column-key="actions" min-width="7%">
              <template #default="{ row }">
                <template v-if="!row.isEdit">
                  <!-- 编辑 -->
                  <i
                    class="icon-edit-line mr-8 h-16 w-16 cursor-pointer"
                    @click="row.isEdit = true"
                  />
                  <!-- 删除 -->
                  <i
                    class="icon-delete-bin-line h-16 w-16 cursor-pointer"
                    @click="handleDeleteBrandModel(row.id)"
                  />
                </template>
                <template v-else>
                  <el-button
                    type="primary"
                    @click="handleEditBrandModelName(row)"
                  >
                    {{ row.id ? 'Edit' : 'Add' }}
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <!-- 新增按钮 -->
          <el-button
            type="primary"
            text
            class="my-8 w-fit"
            @click="handleAddPendingBrandModel"
          >
            <template #icon>
              <i class="icon-typesadd branding-colours-primary" />
            </template>
            <template #default>New Item</template>
          </el-button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.brand-name-input :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

.brand-name-input :deep(.el-input__wrapper::after) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--el-input-border-color, var(--el-border-color));
  pointer-events: none;
}

// 重置 el-input 样式
:deep(.table-container .el-input) {
  @apply rounded-12 h-32;

  .el-input__wrapper {
    @apply rounded-12 bg-[#EAEEF4];

    .el-input__inner {
      @apply placeholder:text-14 placeholder:font-normal;
    }
  }
}
</style>
