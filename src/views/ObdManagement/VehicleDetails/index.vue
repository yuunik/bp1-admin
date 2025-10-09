<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import {
  EmitterEvent,
  RouteName,
  VehicleDetailTabs,
} from '@/utils/constantsUtil.js'
import { getVehicleInfoApi, getVehicleScanRecordsApi } from '@/apis/obdApi.js'
import {
  getDateWithDDMMMYYYY,
  getDateWithDDMMMYYYYhhmma,
} from '@/utils/dateUtil.js'
import emitter from '@/utils/emitterUtil.js'
import { useSort } from '@/composables/useSort.js'

const activeTabName = ref(VehicleDetailTabs.VEHICLE_DETAILS)

const route = useRoute()

// 车辆详情
const vehicleDetails = reactive({})

const vehicleDetailRef = ref(null)

const faultCodesRef = ref([])

const scannedHistoryRef = ref([])

const currentVehicleId = ref('')

// 获取车辆详情
const getVehicleDetails = async () => {
  const { data } = await getVehicleInfoApi(currentVehicleId.value)
  Object.assign(vehicleDetails, data)
  // 更新面包屑
  emitter.emit(EmitterEvent.UPDATE_BREADCRUMB_LIST, data.OBDDto)
}

const pagination = reactive({
  currentPage: 0,
  pageSize: 10,
  total: 100,
})

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

const sortByScannedHistoryParams = useSort(
  scannedHistoryPaginationParams,
  () => {
    getScannedHistoryList()
  },
)

onMounted(async () => {
  // 获取页面路径id, 发起请求
  const {
    params: { id },
  } = route
  if (id) {
    currentVehicleId.value = id
    await Promise.all([getVehicleDetails(), getScannedHistoryList()])
  }
})
</script>

<template>
  <section class="flex h-full flex-col">
    <!-- header -->
    <h3 class="heading-h2-20px-medium text-neutrals-off-black mx-32 mb-16">
      {{ vehicleDetails.brand }}
    </h3>
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
              <dt class="w-112 leading-32 h-32">Brand</dt>
              <dd class="flex-1">
                {{ vehicleDetails.brand || '-' }}
              </dd>
            </dl>
            <dl class="flex items-center gap-8">
              <dt class="w-112 leading-32 h-32">Model</dt>
              <dd class="flex-1">
                {{ vehicleDetails.model || '-' }}
              </dd>
            </dl>
            <dl class="flex items-center gap-8">
              <dt class="w-112 leading-32 h-32">Year</dt>
              <dd class="flex-1">{{ vehicleDetails.year || '-' }}</dd>
            </dl>
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
                {{ vehicleDetails.licensePlate || '-' }}
              </dd>
            </dl>
            <dl class="flex items-center gap-8">
              <dt class="w-112 leading-32 h-32">VIN</dt>
              <dd class="flex-1">
                {{ vehicleDetails.vin || '-' }}
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
                  name: RouteName.SCAN_FAULT_CODE,
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
</style>
