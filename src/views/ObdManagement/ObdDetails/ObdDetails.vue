<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Line } from 'vue-chartjs'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

import {
  getOBDBindHistoryApi,
  getOBDBindVehiclesApi,
  getOBDOperationRecordsApi,
  unbindOBDApi,
} from '@/apis/obdApi.js'
import {
  getCommentTime,
  getFullDate,
  getLastUsedDate,
  getWarrantyEndDate,
} from '@/utils/dateUtil.js'
import BasePagination from '@/components/BasePagination/index.vue'
import { getOBDConnectedCountListApi } from '@/apis/appApi.js'
import { BehaviorStatisticsDate } from '@/utils/constantsUtil.js'

// OBD 是否开启
const isObdOn = computed(() => obdInfo.status === 10)

const route = useRoute()

const router = useRouter()

// OBD 信息
const obdInfo = inject('obdInfo')

// 绑定车辆列表
const boundVehicleList = ref([])

// 绑定历史列表
const bindHistoryList = ref([])

// obd 操作记录查询参数
const operationRecordParams = reactive({
  currentPage: 0,
  pageSize: 10,
  total: 0,
})

// obd 操作记录列表
const operationRecordList = ref([])

// 获取 OBD 详情 的方法
const getOBDInfo = inject('getOBDInfo')

// 当前的OBD id
const currentObdId = ref('')

// OBD 链接量统计数据
const obdConnectedCountList = ref([]) // time - 7

const chartData = ref({
  labels: [],
  datasets: [],
})

// 图表配置
const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: {
      display: true,
      text: 'Behavior Statistics',
    },
  },
  scales: {
    x: {
      grid: {
        display: false, // 不显示横向网格线
      },
    },
    y: {
      beginAtZero: true,
      max: 60,
      grid: {
        color: '#F0F0F0', // 虚线颜色 (可自定义)
      },
      border: {
        display: false, // 设置 y 轴是否显示
        dash: [10, 10], // 虚线样式 (10像素 10 空白)
      },
    },
  },
})

// 起始时间戳, (当天结束时的时间戳)
const endTime = ref(dayjs().endOf('day').valueOf())

// 截至时间戳, 初始值为 当前时间 - 7 天
const beginTime = ref(BehaviorStatisticsDate.SEVEN_DAYS)

// 激活天数
const activeDays = computed(() => {
  const { bindingTime } = obdInfo.value
  if (!bindingTime) {
    return '0 days'
  }
  return `${Math.abs(dayjs(beginTime.value).diff(bindingTime, 'day'))} days`
})

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
  await getOBDBindHistoryList(id)
  // 触发刷新 OBD 详情
  await getOBDInfo?.(id)
  ElMessage.success('Unbind success')
}

// 查看 OBD 绑定的车辆详情
const handleViewVehicleDetails = async (id) => {
  router.push(`/obd-management/obd-list/obd-details/vehicle-details/${id}`)
  // router.push({ name: RouteName.VIEW_VEHICLE, params: id })
}

// 获取 OBD 操作记录
const getOBDOperationRecord = async (id) => {
  const { data, count } = await getOBDOperationRecordsApi({
    obdId: id,
    page: operationRecordParams.currentPage,
    pageSize: operationRecordParams.pageSize,
  })
  operationRecordList.value = data
  operationRecordParams.total = count
}

// 获取 OBD 链接量统计
const getOBDConnectedCountList = async (id) => {
  const { data } = await getOBDConnectedCountListApi({
    obdId: id,
    beginTime: beginTime.value,
    endTime: endTime.value,
  })
  obdConnectedCountList.value = data
  // 日期标签（X轴）
  const labels = data.map((item) => item.Day)
  // 模拟数据（Y轴）
  const dataPoints = data.map((item) => item.Count)
  chartData.value = {
    labels,
    datasets: [
      {
        label: 'OBD link count', // 图例和 tooltip 中显示的名称
        data: dataPoints, // 数据点数组，对应每个 x 轴标签的值
        fill: false, // 是否填充线条下方区域，false 表示不填充
        borderColor: '#376DF7', // 折线的颜色
        backgroundColor: '#376DF7', // 数据点的填充颜色（也可用于填充区域）
        tension: 0, // 贝塞尔曲线的张力，0 表示直线，越大越平滑
        pointRadius: 0, // 数据点的默认半径大小（单位：像素）
        pointHoverRadius: 6, // 鼠标悬停时数据点的半径大小
      },
    ],
  }
}

const betweenDays = computed(() =>
  Math.abs(dayjs(endTime.value).diff(beginTime.value, 'day')),
)

// 监听统计图标时间区间的变化, 重新获取数据
watch(beginTime, () => {
  getOBDConnectedCountList(currentObdId.value)
})

onMounted(async () => {
  // 获取路径中 id
  const {
    params: { id },
  } = route
  if (id) {
    currentObdId.value = id
    await Promise.all([
      getOBDBindHistoryList(id),
      getOBDBindVehicleList(id),
      getOBDOperationRecord(id),
      getOBDConnectedCountList(id),
    ])
  }
})

// 监听currentPage, 刷新列表
watch(
  () => operationRecordParams.currentPage,
  () => getOBDOperationRecord(currentObdId.value),
)
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
        <div class="leading-32 flex flex-1 items-center">
          <label for="date-range" class="w-113 h-32">Date Range</label>
          <el-radio-group v-model="beginTime" class="ml-8">
            <el-radio :value="BehaviorStatisticsDate.SEVEN_DAYS">
              7 days
            </el-radio>
            <el-radio :value="BehaviorStatisticsDate.THIRTY_DAYS">
              30 days
            </el-radio>
            <el-radio :value="BehaviorStatisticsDate.NINETY_DAYS">
              90 days
            </el-radio>
          </el-radio-group>
        </div>
        <!-- Active Days -->
        <div class="leading-32 flex flex-1 items-center">
          <label for="active-days" class="w-113 h-32">Active Days</label>
          <span
            id="active-days"
            class="heading-body-body-12px-regular text-neutrals-off-black"
          >
            {{ activeDays }}
          </span>
        </div>
      </div>
      <!-- chart -->
      <div
        class="h-600 mx-32 flex justify-center overflow-hidden"
        v-if="chartData.datasets && chartData.datasets.length > 0"
      >
        <Line
          :data="chartData"
          :options="chartOptions"
          class="overflow-hidden"
        />
      </div>
      <!-- obd records -->
      <div class="mt-20">
        <!-- title -->
        <h4
          class="leading-24 heading-body-large-body-14px-medium text-neutrals-off-black mx-32"
        >
          OBD Connected records
        </h4>
        <!-- divider -->
        <el-divider />
        <div class="mx-32">
          <!-- table -->
          <el-table
            :data="operationRecordList"
            v-if="operationRecordList.length"
          >
            <el-table-column label="Date">
              <template #default="{ row }">
                {{ getFullDate(row.createTime) }}
              </template>
            </el-table-column>
            <el-table-column label="Operator">
              <template #default="{ row }">
                {{ row.userDto?.name || 'Admin' }}
              </template>
            </el-table-column>
            <el-table-column prop="description" label="Detail" />
          </el-table>
          <!-- pagination -->
          <base-pagination v-model="operationRecordParams" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
