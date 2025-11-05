<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'

import {
  addBrandModelApi,
  createPredictItemApi,
  deleteBrandApi,
  deleteBrandModelApi,
  deletePredictItemApi,
  getBrandModelInfoApi,
  getPredictBrandListApi,
  getPredictSubItemNameListApi,
  modifyBrandInfoApi,
  modifyBrandModelNameApi,
  modifyPredictionDataApi,
  uploadBrandLogoApi,
} from '@/apis/appApi.js'
import { getFormatNumber, getFullFilePath } from '@/utils/dataFormattedUtil.js'
import emitter from '@/utils/emitterUtil.js'
import { EmitterEvent } from '@/utils/constantsUtil.js'
import BaseUpload from '@/components/BaseUpload.vue'
import BaseTag from '@/components/BaseTag.vue'

import useFileUpload from '@/composables/useFileUpload.js'
import PredictionOemListDrawer from '@/views/AppConfiguration/BrandModel/components/PredictionOemListDrawer.vue'
import { useCloned } from '@vueuse/core'

// 车辆详情
const brandModelInfo = ref({})

// 预测列表数据
const predictBrandList = ref([])

// 获取路由
const route = useRoute()

// 获取路由器
const router = useRouter()

// 当前的品牌 id
const brandId = ref('')

// 当前的tab
const activeTab = ref('Details')

// 预测数据名称列表
const predictBrandChildNameList = ref([])

// 文件上传逻辑
const fileUpload = useFileUpload()

// 预测数据抽屉可见
const drawerPredictionOemVisible = ref(false)

// 所选择的预测数据
const selectedPredictionItem = ref({})

// 需要修改的品牌名称
const editBrandInfoName = ref('')

const detailsRef = ref(null)

const modelListRef = ref(null)

const predictionItemRef = ref(null)

// 已有的预测数据的名字数据
const predictBrandNameList = computed(() =>
  predictBrandList.value.length > 0
    ? predictBrandList.value.map((item) => item.name).filter((item) => item)
    : [],
)

// 编辑车辆型号表单
const editModelInfoForm = ref({})

// 获取车辆品牌详情
const getBrandModelInfo = async () => {
  const { data } = await getBrandModelInfoApi(brandId.value)
  // 请求成功
  brandModelInfo.value = data
  // 记录品牌的编辑状态为 false
  data.isEdit = false
  // 更新面包屑
  for (const item of brandModelInfo.value?.vehicleModelDtos) {
    // 记录型号的编辑状态为 false
    item.isEdit = false
  }
  // 获取预测列表
  getPredictBrandList()
  // 更新面包屑
  emitter.emit(EmitterEvent.UPDATE_BREADCRUMB_LIST, brandModelInfo.value.brand)
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

// 切换编辑品牌名称模式
const handeSwitchToEditName = () => {
  const { cloned } = useCloned(brandModelInfo.value.brand)
  editBrandInfoName.value = cloned.value
  brandModelInfo.value.isEdit = true
}

// 编辑车辆品牌名称
const handleEditBrand = async () => {
  await modifyBrandInfoApi({
    id: brandModelInfo.value.id,
    name: editBrandInfoName.value,
  })
  // 修改成功
  ElMessage.success('Edit Brand Name Success')
  getBrandModelInfo()
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
      name: editModelInfoForm.value.name,
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
  getBrandModelInfo()
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
  getBrandModelInfo()
}

// 禁用车辆品牌
const handleDisabledBrand = async () => {
  await deleteBrandApi(brandModelInfo.value.id)
  // 删除成功
  ElMessage.success('Delete Brand Success')
  // 刷新
  getBrandModelInfo()
}

// 获取车辆的预测列表
const getPredictBrandList = async () => {
  const { data } = await getPredictBrandListApi(brandModelInfo.value.brand)
  // 遍历预测列表, 新增编辑状态
  for (const item of data) {
    item.isEdit = false
  }
  predictBrandList.value = data
}

// 新增预测数据
const handleAddPredictBrand = () => {
  // 预测子项名称列表为空时, 获取数据
  if (predictBrandChildNameList.value.length === 0) {
    getPredictBrandChildNameList()
  }
  predictBrandList.value.push({
    name: '',
    // 是否新增
    isNew: true,
    predictionOemDtos: [],
  })
}

// 获取预测子项名称列表
const getPredictBrandChildNameList = async () => {
  const { data } = await getPredictSubItemNameListApi()
  predictBrandChildNameList.value = data.filter(
    (item) => !predictBrandNameList.value.includes(item.name),
  )
}

// 切换至预测数据编辑模式
const handleSwitchToEditMode = (predictionItem) => {
  // 预测子项名称列表为空时, 获取数据
  if (predictBrandChildNameList.value.length === 0) {
    getPredictBrandChildNameList()
  }
  // 切换至编辑模式
  predictionItem.isEdit = true
}

// 预测数据名称改变
const handlePredictionItemNameChange = (val, row) => {
  const predictionItem = predictBrandChildNameList.value.find(
    (item) => item.name === val,
  )
  row.mileage = predictionItem.mileage
  row.day = predictionItem.day
  row.logo = predictionItem.logo
}

// 编辑预测数据
const handleEditPredictBrand = async (row) => {
  if (row.localLogo) {
    row.logo = row.localLogo
  }

  await modifyPredictionDataApi({
    id: row.id,
    date: row.day,
    mileage: row.mileage,

    name: row.name,
    file: row.logo,
  })
  // 修改成功
  ElMessage.success('Edit Prediction Data Success')
  getBrandModelInfo()
}

// logo加载失败的回退行为
const onErrorImage = () => true

// 图标上传
const handlePredictionIconChange = async (file, row) => {
  await fileUpload.handleValidateImageUpload(file)
  row.localLogo = fileUpload.localFilePath.value
}

// 管理预测数据
const handlePredictionItemManage = async (row) => {
  if (row.id) {
    // 编辑
    handleEditPredictBrand(row)
  } else {
    // 新增
    handleAddPredictBrandItem(row)
  }
  // 获取预测子项名称列表
  getPredictBrandChildNameList()
}

// 新增预测数据
const handleAddPredictBrandItem = async (row) => {
  await createPredictItemApi({
    brand: brandModelInfo.value.brand,
    day: row.day,
    mileage: row.mileage,
    name: row.name,
  })
  // 添加成功
  ElMessage.success('Add Prediction Data Success')
  getBrandModelInfo()
}

// 查看预测数据的OEM信息列表
const handleViewPredictionOemList = async (row, column) => {
  // 新增状态, 不可查看
  if (row.isNew) return
  const { no } = column
  // 用户在操作栏操作, 立即返回
  if (no === 5) return

  selectedPredictionItem.value = row
  drawerPredictionOemVisible.value = true
}

// 删除预测数据
const handleDeletePredictionItem = async (id) => {
  await deletePredictItemApi(id)
  // 删除成功
  ElMessage.success('Delete Prediction Data Success')
  getBrandModelInfo()
}

// 品牌型号切换为编辑模式
const handleSwitchEditModel = (row) => {
  for (const item of brandModelInfo.value.vehicleModelDtos) {
    item.isEdit = false
  }
  row.isEdit = true
  const { cloned } = useCloned(row)
  editModelInfoForm.value = cloned.value
}

// 监听 tab 切换
watch(activeTab, (val) => {
  if (val === 'Details') {
    detailsRef.value.scrollIntoView({ behavior: 'smooth' })
  } else if (val === 'Model List') {
    modelListRef.value.scrollIntoView({ behavior: 'smooth' })
  } else if (val === 'Prediction Items') {
    predictionItemRef.value.scrollIntoView({ behavior: 'smooth' })
  }
})

onMounted(async () => {
  // id 字段校验
  if (route.params.id) {
    brandId.value = route.params.id
    // 有 id , 则说明查看详情
    getBrandModelInfo()
  }
})
</script>

<template>
  <section class="flex h-full flex-col overflow-auto pb-32">
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
    <!-- tabs -->
    <el-tabs v-model="activeTab" class="has-top">
      <el-tab-pane label="Details" name="Details" />
      <el-tab-pane label="Model List" name="Model List" />
      <el-tab-pane label="Prediction Items" name="Prediction Items" />
    </el-tabs>
    <!-- content -->
    <el-scrollbar>
      <!-- 品牌信息 -->
      <div class="flex gap-24 px-32 pb-24 pt-16" ref="detailsRef">
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
              <el-input class="brand-name-input" v-model="editBrandInfoName" />
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
                @click="handeSwitchToEditName"
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
      <!-- 车辆品牌型号信息表格 -->
      <div ref="modelListRef">
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
            <el-table-column type="selection" min-width="5%" />
            <el-table-column type="index" label="No." min-width="8%" />
            <el-table-column prop="name" label="Model" min-width="74%">
              <template #default="{ row }">
                <el-input
                  v-if="row.isEdit"
                  placeholder="Enter..."
                  class="h-32"
                  v-model="editModelInfoForm.name"
                />
                <span v-else>{{ row.name }}</span>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column column-key="actions" min-width="15%">
              <template #default="{ row }">
                <template v-if="!row.isEdit">
                  <!-- 编辑 -->
                  <i
                    class="icon-edit-line mr-8 h-16 w-16 cursor-pointer"
                    @click="handleSwitchEditModel(row)"
                  />
                  <el-popconfirm
                    :title="`Are you sure you want to delete '${row.name}' ?`"
                    placement="left"
                    width="200"
                    @confirm="handleDeleteBrandModel(row.id)"
                  >
                    <template #reference>
                      <!-- 删除 -->
                      <i
                        class="icon-delete-bin-line h-16 w-16 cursor-pointer"
                      />
                    </template>
                  </el-popconfirm>
                </template>
                <template v-else>
                  <el-button size="small" @click="row.isEdit = false">
                    Cancel
                  </el-button>
                  <el-button
                    type="primary"
                    @click="handleEditBrandModelName(row)"
                    size="small"
                  >
                    {{ row.id ? 'Save' : 'Add' }}
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
      <!-- 车辆品牌预测信息表格 -->
      <div class="mt-24" ref="predictionItemRef">
        <!-- 标签信息 -->
        <div class="items-center-safe box-border flex gap-8 px-32 py-7">
          <h4>Prediction Items</h4>
          <!-- 预测信息数量 -->
          <el-text class="flex-1">
            {{ predictBrandList.length ?? 0 }}
          </el-text>
        </div>
        <!-- 分割线 -->
        <el-divider class="mt-8" />
        <!-- 预测数据列表 -->
        <div class="table-container mx-32">
          <el-table
            :data="predictBrandList"
            @row-click="handleViewPredictionOemList"
            row-class-name="clickable-row"
          >
            <!-- 预测数据的图标 -->
            <el-table-column prop="logo" label="Icon" min-width="19%">
              <template #default="{ row }">
                <el-avatar
                  :src="
                    row?.localLogo ? row.localLogo : getFullFilePath(row.logo)
                  "
                  :size="20"
                  class="prediction logo"
                  fit="cover"
                  @error="onErrorImage"
                >
                  I
                </el-avatar>
                <!-- 编辑模式下, 可更换 logo -->
                <!--<el-upload-->
                <!--  class="row-center"-->
                <!--  :on-change="-->
                <!--    (uploadFile, _) =>-->
                <!--      handlePredictionIconChange(uploadFile, row)-->
                <!--  "-->
                <!--  :auto-upload="false"-->
                <!--  :show-file-list="false"-->
                <!--  v-show="row.isEdit"-->
                <!--&gt;-->
                <!--  <el-button type="primary" text>-->
                <!--    <template #icon>-->
                <!--      <i class="icon-upload-2-line branding-colours-primary" />-->
                <!--    </template>-->
                <!--    <template #default>Upload</template>-->
                <!--  </el-button>-->
                <!--</el-upload>-->
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column prop="name" label="Item Name" min-width="27%">
              <template #default="{ row }">
                <el-select
                  v-if="row.isNew"
                  v-model="row.name"
                  class="select--bg-neutrals-grey-1"
                  @change="(val) => handlePredictionItemNameChange(val, row)"
                >
                  <el-option
                    v-for="predictionItem in predictBrandChildNameList"
                    :label="predictionItem.name"
                    :value="predictionItem.name"
                  />
                </el-select>
                <span v-else>{{ row.name }}</span>
              </template>
            </el-table-column>
            <!-- Range -->
            <el-table-column prop="mileage" label="Range" min-width="18%">
              <template #default="{ row }">
                <el-input
                  v-if="row.isEdit || row.isNew"
                  v-model.number="row.mileage"
                  placeholder="Type Here"
                  class="input--bg-neutrals-grey-1"
                >
                  <template #suffix>km</template>
                </el-input>
                <span v-else>{{ getFormatNumber(row.mileage) }} km</span>
              </template>
            </el-table-column>
            <!-- Time -->
            <el-table-column prop="day" label="Time" min-width="18%">
              <template #default="{ row }">
                <el-input
                  v-if="row.isEdit || row.isNew"
                  v-model.number="row.day"
                  placeholder="Type Here"
                  class="input--bg-neutrals-grey-1"
                >
                  <template #suffix>day</template>
                </el-input>
                <span v-else>
                  {{ getFormatNumber(row.day) }} day{{ row.day > 1 ? 's' : '' }}
                </span>
              </template>
            </el-table-column>
            <!-- Strings -->
            <el-table-column label="Strings" min-width="14%">
              <template #default="{ row }">
                {{ row.predictionOemDtos.length || '-' }}
              </template>
            </el-table-column>
            <!-- Actions -->
            <el-table-column min-width="4%">
              <template #default="{ row }">
                <template v-if="!row.isEdit && !row.isNew">
                  <!-- 编辑 -->
                  <i
                    class="icon-edit-line mr-8 cursor-pointer"
                    @click="handleSwitchToEditMode(row)"
                  />
                  <!-- 删除 -->
                  <i
                    class="icon-delete-bin-line cursor-pointer"
                    @click="handleDeletePredictionItem(row.id)"
                  />
                </template>
                <template v-else>
                  <el-button
                    type="primary"
                    size="small"
                    @click="handlePredictionItemManage(row)"
                  >
                    {{ row.id ? 'Save' : 'Add' }}
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
            @click="handleAddPredictBrand"
          >
            <template #icon>
              <i class="icon-typesadd branding-colours-primary" />
            </template>
            <template #default>New Item</template>
          </el-button>
        </div>
      </div>
    </el-scrollbar>
  </section>
  <prediction-oem-list-drawer
    ref="predictionOemListDrawerRef"
    v-model="drawerPredictionOemVisible"
    v-if="drawerPredictionOemVisible"
    :prediction-Item="selectedPredictionItem"
    @refresh="getPredictBrandList"
  />
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
