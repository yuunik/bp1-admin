<script setup>
import { useRoute } from 'vue-router'

import { getFullDate } from '@/utils/dateUtil.js'
import { getFaultCodeListApi } from '@/apis/appApi.js'

const pagination = reactive({
  currentPage: 0,
  pageSize: 10,
  total: 100,
})

// 车辆故障码列表
const faultCodeList = ref([])

const route = useRoute()

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

// 获取提供的vehicleDetails信息
const vehicleDetails = inject('vehicleDetails')

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

const {
  params: { id },
} = route
if (id) {
  getFaultCodeList(id)
}
</script>

<template>
  <div class="flex flex-col gap-24 overflow-auto">
    <!-- vehicle info -->
    <div class="mx-32 mt-6 flex justify-between gap-24">
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
            <dd class="flex-1">{{ getFullDate(vehicleDetails.createTime) }}</dd>
          </dl>
          <dl class="flex items-center gap-8">
            <dt class="w-112 leading-32 h-32">Last Connected</dt>
            <dd class="flex-1">-</dd>
          </dl>
        </div>
      </div>
    </div>
    <!-- Fault Codes -->
    <div class="flex flex-col gap-8">
      <h4
        class="leading-24 heading-body-large-body-14px-medium text-neutrals-off-black mx-32"
      >
        Fault Codes
      </h4>
      <!-- divider -->
      <el-divider />
      <!-- table -->
      <div class="mx-32 flex flex-col gap-16">
        <el-table :data="faultCodeList">
          <el-table-column type="expand">
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
          <el-table-column prop="systemName" label="ECU" />
          <el-table-column label="Fault Codes" sortable>
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
    <div class="flex flex-col gap-8">
      <h4
        class="leading-24 heading-body-large-body-14px-medium text-neutrals-off-black mx-32"
      >
        Scanned History
      </h4>
      <!-- divider -->
      <el-divider />
      <!-- table -->
      <div class="mx-32 flex flex-col gap-16">
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
  </div>
</template>

<style scoped lang="scss"></style>
