<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { EmitterEvent, VehicleDetailTabs } from '@/utils/constantsUtil.js'
import { getVehicleInfoApi } from '@/apis/obdApi.js'
import { getFullDate } from '@/utils/dateUtil.js'
import { getFaultCodeListApi } from '@/apis/appApi.js'
import emitter from '@/utils/emitterUtil.js'

const activeTabName = ref(VehicleDetailTabs.VEHICLE_DETAILS)

const route = useRoute()

// 车辆详情
const vehicleDetails = reactive({})

const vehicleDetailRef = ref(null)

const faultCodesRef = ref(null)

const scannedHistoryRef = ref(null)

// 获取车辆详情
const getVehicleDetails = async (id) => {
  const { data } = await getVehicleInfoApi(id)
  Object.assign(vehicleDetails, data)
  // 更新面包屑
  emitter.emit(EmitterEvent.UPDATE_BREADCRUMB_LIST, data.OBDDto)
}

const pagination = reactive({
  currentPage: 0,
  pageSize: 10,
  total: 100,
})

// 车辆故障码列表
const faultCodeList = ref([])

const scannedHistoryList = reactive([
  {
    id: 1,
    scannedDate: '22 Aug 2024 10:03:36',
    type: 'Full Scan',
    faultCodes: 6,
  },
  {
    id: 2,
    scannedDate: '22 Aug 2024 10:03:36',
    type: 'Quick Scan',
    faultCodes: 6,
  },
  {
    id: 3,
    scannedDate: '22 Aug 2024 10:03:36',
    type: 'Custom Scan',
    faultCodes: 6,
  },
])

// 获取车辆故障码列表
const getFaultCodeList = async (id) => {
  const { data } = await getFaultCodeListApi(id)
  faultCodeList.value = data.dtcItemDtos
}

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

const handleScroll = (scrollData) => {
  console.log(scrollData, '##############')
}

onMounted(async () => {
  // 获取页面路径id, 发起请求
  const {
    params: { id },
  } = route
  if (id) {
    await Promise.all([getVehicleDetails(id), getFaultCodeList(id)])
  }
})
</script>

<template>
  <section class="flex h-full flex-col">
    <!-- header -->
    <h3 class="heading-h2-20px-medium text-neutrals-off-black mb-16 px-32">
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
        :label="VehicleDetailTabs.FAULT_CODES"
        :name="VehicleDetailTabs.FAULT_CODES"
      />
      <el-tab-pane
        :label="VehicleDetailTabs.SCANNED_HISTORY"
        :name="VehicleDetailTabs.SCANNED_HISTORY"
      />
    </el-tabs>
    <!-- content, 滚动区域 -->
    <el-scrollbar
      class="flex flex-1 flex-col"
      ref="vehicleDetailRef"
      @scroll="handleScroll"
    >
      <!-- vehicle info -->
      <div class="mx-32 mt-6 flex max-w-full justify-between gap-24">
        <div class="flex-1">
          <div class="flex flex-col gap-4">
            <dl class="flex items-center gap-8">
              <dt class="w-112 leading-32 h-32">Brand</dt>
              <dd class="flex-1">{{ vehicleDetails.brand || '-' }}</dd>
            </dl>
            <dl class="flex items-center gap-8">
              <dt class="w-112 leading-32 h-32">Model</dt>
              <dd class="flex-1">{{ vehicleDetails.model || '-' }}</dd>
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
              <dd class="flex-1">{{ vehicleDetails.licensePlate || '-' }}</dd>
            </dl>
            <dl class="flex items-center gap-8">
              <dt class="w-112 leading-32 h-32">VIN</dt>
              <dd class="flex-1">{{ vehicleDetails.vin || '-' }}</dd>
            </dl>
            <dl class="flex items-center gap-8">
              <dt class="w-112 leading-32 h-32">Bound Date</dt>
              <dd class="flex-1">
                {{ getFullDate(vehicleDetails.createTime) }}
              </dd>
            </dl>
            <dl class="flex items-center gap-8">
              <dt class="w-112 leading-32 h-32">Last Connected</dt>
              <dd class="flex-1">-</dd>
            </dl>
          </div>
        </div>
      </div>
      <!-- Fault Codes -->
      <div class="mt-24 flex flex-col gap-8" ref="faultCodesRef">
        <h4
          class="leading-24 heading-body-large-body-14px-medium text-neutrals-off-black mx-32"
        >
          Fault Codes
        </h4>
        <!-- divider -->
        <el-divider />
        <!-- table -->
        <div class="mx-32">
          <el-table :data="faultCodeList" class="w-full">
            <el-table-column type="expand" min-width="2%">
              <template #default="{ row }">
                <el-table :data="row.dtcItemDtcDtos">
                  <el-table-column prop="name" label="DTC Name" />
                  <el-table-column prop="code" label="Code" />
                  <!--<el-table-column prop="severity" label="Severity" />-->
                  <el-table-column>
                    <template #default="{ row }">
                      <el-button class="rounded-full!">View Details</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column prop="systemName" label="ECU" min-width="50%" />
            <el-table-column label="Fault Codes" min-width="48%">
              <template #default="{ row }">
                <template v-if="row.faultCount === 0">0</template>
                <template v-else-if="row.faultCount === 1">1 DTC</template>
                <template v-else>{{ row.faultCount }} DTCs</template>
              </template>
            </el-table-column>
          </el-table>
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
          <el-table :data="scannedHistoryList">
            <el-table-column prop="scannedDate" label="Scanned Date" sortable />
            <el-table-column prop="type" label="Type" sortable />
            <el-table-column prop="faultCodes" label="Fault Codes" sortable />
            <el-table-column>
              <template #default="{ row }">
                <el-button class="rounded-full!">View Details</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-scrollbar>
  </section>
</template>

<style scoped lang="scss"></style>
