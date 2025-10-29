<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { useDebounceFn } from '@vueuse/core'

import {
  EmitterEvent,
  RouteName,
  TimingPreset,
  VehicleDetailTabs,
} from '@/utils/constantsUtil.js'
import {
  editVehicleApi,
  getVehicleInfoApi,
  getVehicleScanRecordsApi,
} from '@/apis/obdApi.js'
import {
  getDateWithDDMMMYYYY,
  getDateWithDDMMMYYYYhhmma,
} from '@/utils/dateUtil.js'
import emitter from '@/utils/emitterUtil.js'
import { useSort } from '@/composables/useSort.js'
import { getBrandModalListApi } from '@/apis/appApi.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import { ElMessage } from 'element-plus'

const activeTabName = ref(VehicleDetailTabs.VEHICLE_DETAILS)

const route = useRoute()

// 车辆详情
const vehicleDetails = reactive({})

// 车辆详情 dom
const vehicleDetailRef = ref(null)

// 故障码 dom
const faultCodesRef = ref([])

// 扫描历史 dom
const scannedHistoryRef = ref([])

// 当前车辆 id
const currentVehicleId = ref('')

// 编辑模式
const isEditMode = ref(false)

// 车辆品牌列表
const vehicleBrandList = ref([])

// 车辆品牌名称
const vehicleBrandName = ref('')

// 车辆品牌型号名称
const vehicleModelName = ref('')

// 车辆品牌型号列表
const vehicleModelList = ref([])

// 当前年份
const currentYear = dayjs().year()

// 当前选择的年份
const selectedYear = ref(-1)

// 年份选项列表
const yearOption = computed(() => {
  const optionList = []

  for (let i = 2008; i <= currentYear; i++) {
    optionList.push({
      label: i,
      value: i,
    })
  }

  return optionList
})

// 车辆名称
const vehicleName = computed(
  () => vehicleDetails.brand + ' ' + vehicleDetails.model,
)

// 获取车辆详情
const getVehicleDetails = async () => {
  const { data } = await getVehicleInfoApi(currentVehicleId.value)
  Object.assign(vehicleDetails, data)
  // 获取车辆品牌名称
  vehicleBrandName.value = data.brand
  // 获取车辆型号名称
  vehicleModelName.value = data.model
  // 获取车辆年份
  selectedYear.value = data.year
  // 更新面包屑
  emitter.emit(EmitterEvent.UPDATE_BREADCRUMB_LIST, data.OBDDto)
}

const pagination = reactive({
  currentPage: 0,
  pageSize: 10,
  total: 100,
})

// 扫描历史列表
const scannedHistoryList = ref([])

// 车辆dtc列表排序参数
const scannedHistoryPaginationParams = reactive({
  sortBy: '',
  sort: '',
})

// 监听currentPage, 刷新列表
watch(
  () => pagination.currentPage,
  () => {},
)

// 监听 tab change
watch(activeTabName, (val) => {
  if (val === VehicleDetailTabs.VEHICLE_DETAILS) {
    vehicleDetailRef.value.setScrollTop(0)
  } else if (val === VehicleDetailTabs.FAULT_CODES) {
    faultCodesRef.value.scrollIntoView({ behavior: 'smooth' })
  } else if (val === VehicleDetailTabs.SCANNED_HISTORY) {
    scannedHistoryRef.value.scrollIntoView({ behavior: 'smooth' })
  }
})

// 获取车辆dtc历史列表
const getScannedHistoryList = async () => {
  const { data } = await getVehicleScanRecordsApi({
    vehicleId: currentVehicleId.value,
    sortKey: scannedHistoryPaginationParams.sortBy,
    sort: scannedHistoryPaginationParams.sort,
    page: 0,
    pageSize: 9999,
  })
  scannedHistoryList.value = data
}

// 数据初始化
const init = async () =>
  await Promise.all([getVehicleDetails(), getScannedHistoryList()])

// 排序参数
const sortByScannedHistoryParams = useSort(
  scannedHistoryPaginationParams,
  () => {
    getScannedHistoryList()
  },
)

// 获取车辆品牌列表
const getVehicleBrandList = async () => {
  const { data } = await getBrandModalListApi()
  // 获取车辆品牌列表
  vehicleBrandList.value = data
  // 初始化车辆品牌型号列表
  const brandData = vehicleBrandList.value.find(
    (brandInfo) => brandInfo.brand === vehicleBrandName.value,
  )
  // 初始化车辆型号列表
  vehicleModelList.value = brandData.vehicleModelDtos
}

// 切换编辑模式
const switchToEditMode = useDebounceFn(
  () => (isEditMode.value = true),
  TimingPreset.DEBOUNCE,
)

// 选择车辆品牌
const handleBrandChange = async (brandId) => {
  vehicleModelName.value = ''
  const brandInfo = vehicleBrandList.value.find((brand) => brand.id === brandId)
  // 获取车辆型号列表
  vehicleModelList.value = brandInfo.vehicleModelDtos
  // 更新车辆品牌名称
  vehicleBrandName.value = brandInfo.brand
}

// 选择车辆品牌型号
const handleModelChange = (modelId) => {
  const modelInfo = vehicleModelList.value.find((model) => model.id === modelId)
  // 更新车辆型号名称
  vehicleModelName.value = modelInfo.name
}

// 编辑车辆信息
const editVehicleInfo = async () => {
  try {
    await editVehicleApi({
      vehicleId: currentVehicleId.value,
      licensePlate: vehicleDetails.licensePlate,
      vin: vehicleDetails.vin,
      brand: vehicleBrandName.value,
      model: vehicleModelName.value,
      year: selectedYear.value,
      name: vehicleDetails.name,
    })
    // 修改成功
    ElMessage.success('Edit success')
    // 刷新
    init()
  } finally {
    // 关闭编辑模式
    isEditMode.value = false
  }
}

watch(isEditMode, (val) => {
  if (val) {
    getVehicleBrandList()
  }
})

onMounted(async () => {
  // 获取页面路径id, 发起请求
  const {
    params: { id },
  } = route
  if (id) {
    currentVehicleId.value = id
    init()
  }
})
</script>

<template>
  <section class="flex h-full flex-col overflow-auto">
    <!-- header -->
    <div class="flex-between mx-32 mb-16">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        {{ vehicleName }}
      </h3>
      <!-- btn group -->
      <el-button v-show="!isEditMode" @click="switchToEditMode">Edit</el-button>
      <el-button type="primary" v-show="isEditMode" @click="editVehicleInfo">
        Save
      </el-button>
    </div>
    <!-- divider -->
    <el-divider />
    <!-- tabs -->
    <el-tabs v-model="activeTabName" class="h-48">
      <el-tab-pane
        :label="VehicleDetailTabs.VEHICLE_DETAILS"
        :name="VehicleDetailTabs.VEHICLE_DETAILS"
      />
      <el-tab-pane
        :label="VehicleDetailTabs.SCANNED_HISTORY"
        :name="VehicleDetailTabs.SCANNED_HISTORY"
      />
    </el-tabs>
    <!-- content, 滚动区域 -->
    <el-scrollbar class="flex flex-1 flex-col" ref="vehicleDetailRef">
      <!-- vehicle info -->
      <div
        class="vehicle-info-container mx-32 mt-6 flex max-w-full justify-between gap-24"
      >
        <div class="flex-1">
          <div class="flex flex-col gap-4">
            <dl class="flex items-center gap-8">
              <dt class="w-112 leading-32 h-32">Name</dt>
              <dd class="flex-1">
                <span v-if="!isEditMode">
                  {{ vehicleDetails.name || '-' }}
                </span>
                <el-input
                  v-else
                  v-model="vehicleDetails.name"
                  placeholder="Enter"
                />
              </dd>
            </dl>
            <dl class="flex items-center gap-8">
              <dt class="w-112 leading-32 h-32">Brand</dt>
              <dd class="flex-1">
                <span v-if="!isEditMode">
                  {{ vehicleBrandName || '-' }}
                </span>
                <el-select
                  v-else
                  v-model="vehicleBrandName"
                  placeholder="Select brand"
                  @change="handleBrandChange"
                >
                  <el-option
                    v-for="brandInfo in vehicleBrandList"
                    :key="brandInfo.id"
                    :label="brandInfo.brand"
                    :value="brandInfo.id"
                  >
                    <el-avatar
                      :src="getFullFilePath(brandInfo.logo)"
                      :size="20"
                      class="vertical-mid"
                    />
                    <span class="ml-8">{{ brandInfo.brand }}</span>
                  </el-option>
                </el-select>
              </dd>
            </dl>
            <dl class="flex items-center gap-8">
              <dt class="w-112 leading-32 h-32">Model</dt>
              <dd class="flex-1">
                <span v-if="!isEditMode">
                  {{ vehicleModelName || '-' }}
                </span>
                <el-select
                  v-else
                  v-model="vehicleModelName"
                  placeholder="Select model"
                  @change="handleModelChange"
                >
                  <el-option
                    v-for="modelInfo in vehicleModelList"
                    :key="modelInfo.id"
                    :label="modelInfo.name"
                    :value="modelInfo.id"
                  />
                </el-select>
              </dd>
            </dl>
            <dl class="flex items-center gap-8">
              <dt class="w-112 leading-32 h-32">Year</dt>
              <dd class="flex-1">
                <span v-if="!isEditMode">{{ selectedYear || '-' }}</span>
                <el-select v-else v-model="selectedYear" placeholder="Enter">
                  <el-option
                    v-for="year in yearOption"
                    :key="year.value"
                    :label="year.label"
                    :value="year.value"
                  />
                </el-select>
              </dd>
            </dl>
            <!-- 引擎马力 -->
            <dl class="flex items-center gap-8">
              <dt class="w-112 leading-32 h-32">Engine</dt>
              <dd class="flex-1">
                {{
                  vehicleDetails.engineCapacity
                    ? `${vehicleDetails.engineCapacity} T`
                    : '-'
                }}
              </dd>
            </dl>
          </div>
        </div>
        <div class="flex-1">
          <div class="flex flex-col gap-4">
            <dl class="flex items-center gap-8">
              <dt class="w-112 leading-32 h-32">License Plate</dt>
              <dd class="flex-1">
                <span v-if="!isEditMode">
                  {{ vehicleDetails.licensePlate || '-' }}
                </span>
                <el-input
                  v-else
                  v-model="vehicleDetails.licensePlate"
                  placeholder="Enter"
                  @input="
                    (val) => (vehicleDetails.licensePlate = val.toUpperCase())
                  "
                />
              </dd>
            </dl>
            <dl class="flex items-center gap-8">
              <dt class="w-112 leading-32 h-32">VIN</dt>
              <dd class="flex-1">
                <span v-if="!isEditMode">
                  {{ vehicleDetails.vin || '-' }}
                </span>
                <el-input
                  v-else
                  v-model="vehicleDetails.vin"
                  placeholder="Enter"
                  @input="(val) => (vehicleDetails.vin = val.toUpperCase())"
                />
              </dd>
            </dl>
            <dl class="flex items-center gap-8">
              <dt class="w-112 leading-32 h-32">Bound Date</dt>
              <dd class="flex-1">
                {{ getDateWithDDMMMYYYY(vehicleDetails.createTime) }}
              </dd>
            </dl>
            <dl class="flex items-center gap-8">
              <dt class="w-112 leading-32 h-32">Last Connected</dt>
              <dd class="flex-1">-</dd>
            </dl>
          </div>
        </div>
      </div>
      <!-- Scanned History -->
      <div class="mt-24 flex flex-col gap-8" ref="scannedHistoryRef">
        <h4
          class="leading-24 heading-body-large-body-14px-medium text-neutrals-off-black mx-32"
        >
          Scanned History
        </h4>
        <!-- divider -->
        <el-divider />
        <!-- table -->
        <div class="mx-32 pb-32">
          <el-table
            :data="scannedHistoryList"
            row-class-name="clickable-row"
            @sort-change="sortByScannedHistoryParams"
            @row-click="
              (row) =>
                $router.push({
                  name: RouteName.DTC_DETAILS,
                  params: { id: row.id },
                })
            "
          >
            <el-table-column
              prop="createTime"
              label="Scanned Date"
              sortable="custom"
            >
              <template #default="{ row }">
                {{ getDateWithDDMMMYYYYhhmma(row.createTime) }}
              </template>
            </el-table-column>
            <el-table-column prop="type" label="Type">
              <template #default="{ row }">
                <span>Quick Scan</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="dtcCount"
              label="Fault Codes"
              sortable="custom"
            >
              <template #default="{ row }">
                <span>
                  {{
                    row.dtcCount
                      ? `${row.dtcCount} DTC${row.dtcCount > 1 ? 's' : ''}`
                      : '-'
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="{ row }">
                <el-button
                  class="rounded-full!"
                  @click.stop="
                    $router.push({
                      name: RouteName.DTC_DETAILS,
                      params: { id: row.id },
                    })
                  "
                >
                  View Details
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-scrollbar>
  </section>
</template>

<style scoped lang="scss">
.vehicle-info-container :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

.vehicle-info-container :deep(.el-input__wrapper::after) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--el-input-border-color, var(--el-border-color));
  pointer-events: none;
}

.vehicle-info-container :deep(.el-select__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

.vehicle-info-container :deep(.el-select__wrapper::after) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--el-input-border-color, var(--el-border-color));
  pointer-events: none;
}
</style>
