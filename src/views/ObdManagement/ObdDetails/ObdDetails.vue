<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Line } from 'vue-chartjs'
import { ElMessage } from 'element-plus'

import {
  getOBDBindHistoryApi,
  getOBDBindVehiclesApi,
  unbindOBDApi,
} from '@/apis/obdApi.js'
import {
  getCommentTime,
  getFullDate,
  getLastUsedDate,
  getWarrantyEndDate,
} from '@/utils/dateUtil.js'
import { RouteName } from '@/utils/constantsUtil.js'

const isObdOn = computed(() => obdInfo.status === 10)

const dateRange = ref('1')

const route = useRoute()

const router = useRouter()

const obdInfo = inject('obdInfo')

// 绑定车辆列表
const boundVehicleList = ref([])

// 绑定历史列表
const bindHistoryList = ref([])

// 日期标签（X轴）
const labels = [
  '03-05',
  '03-06',
  '03-07',
  '03-08',
  '03-09',
  '03-10',
  '03-11',
  '03-12',
  '03-13',
  '03-14',
  '03-15',
  '03-16',
  '03-17',
  '03-18',
  '03-19',
  '03-20',
  '03-21',
  '03-22',
  '03-23',
  '03-24',
  '03-25',
  '03-26',
  '03-27',
  '03-28',
  '03-29',
  '03-30',
  '03-31',
  '04-01',
  '04-02',
  '04-03',
]

// 模拟数据（Y轴）
const dataPoints = [
  10, 15, 20, 45, 30, 25, 18, 22, 28, 35, 40, 38, 32, 50, 42, 36, 30, 48, 40,
  35, 28, 25, 20, 18, 22, 30, 32, 40, 38, 36,
]

const chartData = {
  labels,
  datasets: [
    {
      label: '访问量',
      data: dataPoints,
      fill: false,
      borderColor: '#42A5F5',
      backgroundColor: '#42A5F5',
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: {
      display: true,
      text: '每日访问趋势（03月 - 04月）',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 60,
    },
  },
}

// 获取 OBD 绑定历史列表
const getOBDBindHistoryList = async (id) => {
  const { data } = await getOBDBindHistoryApi(id)
  bindHistoryList.value = data
}

// 获取 OBD 绑定车辆列表
const getOBDBindVehicleList = async (id) => {
  const { data } = await getOBDBindVehiclesApi(id)
  boundVehicleList.value = data
}

// 解绑 OBD 绑定的用户
const handleUnbindUser = async (id) => {
  await unbindOBDApi(id)
  ElMessage.success('Unbind success')
}

// 查看 OBD 绑定的车辆详情
const handleViewVehicleDetails = async (id) => {
  router.push(`/obd-management/obd-list/obd-details/vehicle-details/${id}`)
  // router.push({ name: RouteName.VIEW_VEHICLE, params: id })
}

onMounted(async () => {
  // 获取路径中 id
  const {
    params: { id },
  } = route
  if (id) {
    await Promise.all([getOBDBindHistoryList(id), getOBDBindVehicleList(id)])
  }
})
</script>

<template>
  <div class="overflow-auto">
    <!-- OBD Info -->
    <div class="flex-between mx-32 mb-4 gap-24">
      <div class="flex flex-1 flex-col gap-4">
        <div class="leading-32 flex gap-8">
          <label for="model" class="w-112 h-32">Model</label>
          <span
            id="model"
            class="heading-body-body-12px-regular text-neutrals-off-black"
          >
            {{ obdInfo.vehicleDto?.model || '-' }}
          </span>
        </div>
        <div class="leading-32 flex gap-8">
          <label for="last-used" class="w-112 h-32">Last Used</label>
          <span
            id="last-used"
            class="heading-body-body-12px-regular text-neutrals-off-black flex-1"
          >
            {{ getLastUsedDate(obdInfo.createdTime) }}
          </span>
        </div>
        <div class="leading-32 flex gap-8">
          <label for="on_off" class="w-112 leading-32 h-32">On/Off</label>
          <el-switch
            id="on_off"
            v-model="isObdOn"
            class="h-20 w-32"
            active-text="On"
            inactive-text="Off"
          />
        </div>
      </div>
      <div class="flex flex-1 flex-col gap-4">
        <div class="leading-32 flex gap-8">
          <label for="serial-number" class="w-112 leading-32 h-32">
            Serial Number
          </label>
          <span
            id="serial-number"
            class="heading-body-body-12px-regular text-neutrals-off-black flex-1"
          >
            {{ obdInfo.sn }}
          </span>
        </div>
        <div class="leading-32 flex gap-8">
          <label for="warranty-end" class="w-112 leading-32 h-32">
            Warranty End
          </label>
          <div id="warranty-end" class="text-neutrals-off-black flex flex-1">
            <span class="heading-body-body-12px-regular items-center">
              {{ getWarrantyEndDate(obdInfo.warrantyTime) }}
            </span>
            <el-tag type="success" class="rounded-4 ml-8">Valid</el-tag>
          </div>
        </div>
        <div class="leading-32 flex gap-8">
          <label for="order" class="w-112 leading-32 h-32">Order</label>
          <span
            id="order"
            class="heading-body-body-12px-regular text-neutrals-off-black flex-1 underline"
          >
            -
          </span>
        </div>
      </div>
    </div>
    <!-- Bound Users -->
    <div class="mb-24" v-if="bindHistoryList.length">
      <!-- title -->
      <h4
        class="leading-24 heading-body-large-body-14px-medium text-neutrals-off-black mx-32"
      >
        Bound Users
      </h4>
      <!-- divider -->
      <el-divider class="my-8!" />
      <!-- table -->
      <div class="mx-32">
        <el-table :data="bindHistoryList">
          <el-table-column
            prop="userDto.email"
            label="Account"
            :sortable="true"
          />
          <el-table-column
            prop="bindingTime"
            label="Bound Date"
            :sortable="true"
          >
            <template #default="{ row }">
              {{ getCommentTime(row.bindingTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="unboundDate" label="Unbound Date">
            <template #default="{ row }">-</template>
          </el-table-column>
          <el-table-column prop="status" label="Status">
            <template #default="{ row }">
              <span>{{ row.status === 0 ? 'Active' : 'Unbound' }}</span>
            </template>
          </el-table-column>
          <el-table-column>
            <template #default="{ row }">
              <el-button
                v-if="row.status === 0"
                @click.stop="handleUnbindUser(row.id)"
                class="rounded-full!"
              >
                Unbind
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- Vehicles -->
    <div class="mb-24" v-if="boundVehicleList.length">
      <!-- title -->
      <h4
        class="leading-24 heading-body-large-body-14px-medium text-neutrals-off-black mx-32"
      >
        Vehicles
      </h4>
      <!-- divider -->
      <el-divider class="my-8!" />
      <!-- table -->
      <div class="mx-32">
        <el-table :data="boundVehicleList">
          <el-table-column type="index" label="No." />
          <el-table-column prop="brand" label="Brand" />
          <el-table-column prop="model" label="Model" />
          <el-table-column prop="year" label="Year" />
          <el-table-column prop="vin" label="VIN" />
          <el-table-column label="Bind Date">
            <template #default="{ row }">
              {{ getFullDate(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column>
            <template #default="{ row }">
              <el-button
                class="rounded-full!"
                @click.stop="handleViewVehicleDetails(row.id)"
              >
                View Details
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- Behavior Statistics -->
    <div class="mb-24">
      <!-- title -->
      <h4
        class="leading-24 heading-body-large-body-14px-medium text-neutrals-off-black mx-32"
      >
        Behavior Statistics
      </h4>
      <!-- divider -->
      <el-divider class="my-8!" />
      <!-- content -->
      <div class="flex-between mx-32 gap-24">
        <div class="flex flex-1 flex-col gap-4">
          <div class="leading-32 flex items-center">
            <label for="date-range" class="w-113 h-32">Date Range</label>
            <el-radio-group v-model="dateRange" class="ml-8">
              <el-radio value="1">7 days</el-radio>
              <el-radio value="2">30 days</el-radio>
              <el-radio value="3">90 days</el-radio>
            </el-radio-group>
          </div>
          <div class="leading-32 flex items-center">
            <label for="usage-score" class="w-113 h-32">Usage Score</label>
            <span
              id="usage-score"
              class="heading-body-body-12px-regular text-neutrals-off-black"
            >
              60%
            </span>
          </div>
        </div>
        <div class="flex flex-1 flex-col gap-4">
          <!-- Active Days -->
          <div class="leading-32 flex items-center">
            <label for="active-days" class="w-113 h-32">Active Days</label>
            <span
              id="active-days"
              class="heading-body-body-12px-regular text-neutrals-off-black"
            >
              18 days
            </span>
          </div>
          <!-- Avg. Daily Use -->
          <div class="leading-32 flex items-center">
            <label for="avg-daily-use" class="w-113 h-32">Avg. Daily Use</label>
            <span
              id="avg-daily-use"
              class="heading-body-body-12px-regular text-neutrals-off-black"
            >
              22 mins/day
            </span>
          </div>
        </div>
      </div>
      <!-- chart -->
      <div class="h-600 mx-32">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
