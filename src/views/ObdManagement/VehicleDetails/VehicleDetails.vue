<script setup>
import BasePagination from '@/components/BasePagination/index.vue'
import { getFullDate } from '@/utils/dateUtil.js'

const pagination = reactive({
  currentPage: 0,
  pageSize: 10,
  total: 100,
})

const liveDataList = reactive([
  { id: 1, parameter: 'Engine RPM', data: 8000, unit: 'rpm' },
  { id: 2, parameter: 'Vehicle Speed', data: 255, unit: 'km/h' },
  { id: 3, parameter: 'Engine Coolant Temperature', data: 215, unit: '°C' },
  { id: 4, parameter: 'Intake Air Temperature', data: 215, unit: '°C' },
  { id: 5, parameter: 'MAF Air Flow Rate', data: 655.35, unit: 'g/s' },
  { id: 6, parameter: 'Throttle Position', data: 100, unit: '%' },
  { id: 7, parameter: 'Calculated Engine Load', data: 255, unit: '%' },
  { id: 8, parameter: 'Fuel Level Input', data: 100, unit: '%' },
  { id: 9, parameter: 'Fuel Rail Pressure', data: 655350, unit: 'kPa' },
  { id: 10, parameter: 'Time Since Engine Start', data: 65535, unit: 's' },
  { id: 11, parameter: 'Intake Manifold Pressure', data: 255, unit: 'kPa' },
  { id: 12, parameter: 'O2 Sensor 2 Voltage', data: 1.275, unit: 'V' },
  {
    id: 13,
    parameter: 'O2 Sensor 2 Short-Term Fuel Trim',
    data: 100,
    unit: '%',
  },
  {
    id: 14,
    parameter: 'Distance Traveled with MIL On',
    data: 65535,
    unit: 'km',
  },
])

const faultCodeList = reactive([
  {
    ecu: 'Engine Control Module 1',
    faultCodes: 6,
  },
  {
    ecu: 'Transmission Electronics',
    faultCodes: 0,
  },
  {
    ecu: 'Electronic Central Electric',
    faultCodes: 2,
  },
  {
    ecu: 'Brakes 1',
    faultCodes: 6,
  },
])

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

const dataList = reactive([
  {
    dtcName: 'P0300',
    code: 'P0300',
    severity: 'Major',
  },
  {
    dtcName: 'P0300',
    code: 'P0300',
    severity: 'Major',
  },
  {
    dtcName: 'P0300',
    code: 'P0300',
    severity: 'Major',
  },
])

// 获取提供的vehicleDetails信息
const vehicleDetails = inject('vehicleDetails')

// 监听currentPage, 刷新列表
watch(
  () => pagination.currentPage,
  () => {},
)
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
    <!-- Live Data -->
    <div class="flex flex-col gap-8">
      <h4
        class="leading-24 heading-body-large-body-14px-medium text-neutrals-off-black mx-32"
      >
        Live Data
      </h4>
      <!-- divider -->
      <el-divider />
      <!-- table -->
      <div class="mx-32 flex flex-col gap-16">
        <el-table :data="liveDataList" class="h-512 overflow-auto">
          <el-table-column prop="parameter" label="Parameter" sortable />
          <el-table-column prop="data" label="Data" />
          <el-table-column prop="unit" label="Unit" />
        </el-table>
        <base-pagination v-model="pagination" />
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
              <el-table :data="dataList">
                <el-table-column prop="dtcName" label="DTC Name" />
                <el-table-column prop="code" label="Code" />
                <el-table-column prop="severity" label="Severity" />
                <el-table-column>
                  <template #default="{ row }">
                    <el-button class="rounded-full!">View Details</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="ecu" label="ECU" />
          <el-table-column prop="faultCodes" label="Fault Codes" sortable />
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
