<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Line } from 'vue-chartjs'
import { onMounted } from 'vue'
import dayjs from 'dayjs'

import {
  BehaviorStatisticsDate,
  EmitterEvent,
  ObdDetailsTabs,
  RouteName,
} from '@/utils/constantsUtil.js'
import {
  closeOBDApi,
  getOBDBindHistoryApi,
  getOBDBindVehiclesApi,
  getOBDInfoApi,
  getOBDOperationRecordsApi,
  unbindOBDApi,
} from '@/apis/obdApi.js'
import {
  getFormattedPublishTime,
  getDateWithDDMMMYYYY,
  getLastUsedDate,
  getOneYearLaterDateWithDDMMMYYYYY,
  isDateExpired,
} from '@/utils/dateUtil.js'
import { getOBDConnectedCountListApi, openOBDApi } from '@/apis/appApi.js'
import BasePagination from '@/components/BasePagination.vue'
import emitter from '@/utils/emitterUtil.js'

// 当前激活的标签
const activeTabName = ref(ObdDetailsTabs.OBD_DETAILS)

// OBD 信息
const obdInfo = ref({})

// 当前的OBD id
const currentObdId = computed(() => obdInfo.value.id)

// 路由
const route = useRoute()

// 路由器
const router = useRouter()

// 获取 OBD 详情
const getOBDInfo = async (id) => {
  const { data } = await getOBDInfoApi(id)
  obdInfo.value = data
  // 更新面包屑标题
  emitter.emit(EmitterEvent.UPDATE_BREADCRUMB_LIST, data.sn)
}

// 解绑 OBD 绑定的用户
const handleUnbindUser = async () => {
  try {
    await unbindOBDApi(currentObdId.value)
    await getOBDInfo(currentObdId.value)
    ElMessage.success('Unbind success')
  } finally {
    unbindUserDialogVisible.value = false
  }
}

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

// OBD 链接量统计数据
const obdConnectedCountList = ref([]) // time - 7

const chartData = ref({
  labels: [],
  datasets: [],
})

// 图表配置
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
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
      // 关键配置：只显示整数刻度
      ticks: {
        stepSize: 1, // 每个刻度间隔 1
        precision: 0, // 精度为 0，强制整数
      },
    },
  },
})

// 起始时间戳, (当天结束时的时间戳)
const endTime = ref(dayjs().endOf('day').valueOf())

// 截至时间戳, 初始值为 当前时间 - 7 天
const beginTime = ref(BehaviorStatisticsDate.SEVEN_DAYS)

const unbindUserDialogVisible = ref(false)

// 激活天数
const activeDays = computed(() => {
  const { bindingTime } = obdInfo.value
  if (!bindingTime) {
    return '0 days'
  }
  return `${Math.abs(dayjs(beginTime.value).diff(bindingTime, 'day'))} days`
})

const obdDetailRef = ref(null)

// OBD 是否开启
const isObdOn = ref(false)

// 当前 OBD id
const nowObdId = ref('')

// 获取 OBD 绑定历史列表
const getOBDBindHistoryList = async (id) => {
  const { data } = await getOBDBindHistoryApi(id)
  bindHistoryList.value.push(data)
}

// 获取 OBD 绑定车辆列表
const getOBDBindVehicleList = async (id) => {
  const { data } = await getOBDBindVehiclesApi(id)
  boundVehicleList.value = data
}

// 查看 OBD 绑定的车辆详情
const handleViewVehicleDetails = async (id) =>
  router.push(`/obd-management/obd-list/obd-details/vehicle-details/${id}`)
// router.push(
//   `/obd-management/obd-list/obd-details/vehicle-details/${id}?obdId=${nowObdId.value}`,
// )

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
  // 获取最大使用值
  const maxCount = Math.max(...data.map((item) => item.Count))
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
  // 设置 图标 y 轴最大值
  chartOptions.value.scales.y.max = maxCount
}

const behaviorStatisticsRef = ref(null)

// 开启OBD
const openOBD = async (obdId) => {
  await openOBDApi(obdId)
  // 提示
  ElMessage.success('Open success')
  // 刷新
  getOBDInfo(obdId)
}

// 关闭 OBD
const handleCloseOBD = async (obdId) => {
  await closeOBDApi(obdId)
  // 关闭成功
  ElMessage.success('Close success')
  // 刷新
  getOBDInfo(obdId)
}

// 处理OBD 状态的切换
const handleIsObdChange = (val) => {
  if (val === true) {
    openOBD(currentObdId.value)
  } else {
    handleCloseOBD(currentObdId.value)
  }
}

// 打开解绑用户弹窗
const openUnbindUserDialog = () => {
  unbindUserDialogVisible.value = true
}

// 滚动事件
const handleScroll = (scrollData) => {
  const { scrollTop } = scrollData
  if (scrollTop < 443) {
    activeTabName.value = ObdDetailsTabs.OBD_DETAILS
  } else {
    activeTabName.value = ObdDetailsTabs.BEHAVIOR_STATISTICS
  }
}

// 切换标签, 滚动至指定位置
const handleTabChange = (val) => {
  if (val === ObdDetailsTabs.OBD_DETAILS) {
    obdDetailRef.value.setScrollTop(0)
  } else if (val === ObdDetailsTabs.BEHAVIOR_STATISTICS) {
    behaviorStatisticsRef.value.scrollIntoView({ behavior: 'smooth' })
  }
}

// 监听统计图标时间区间的变化, 重新获取数据
watch(beginTime, () => {
  getOBDConnectedCountList(currentObdId.value)
})

onMounted(() => {
  // 初始加载（如果不是子路由）
  if (route.name !== RouteName.VIEW_VEHICLE) {
    loadOBDData(route.params.id)
  }
})

// 监听currentPage, 刷新列表
watch(
  () => operationRecordParams.currentPage,
  () => getOBDOperationRecord(currentObdId.value),
)

// 监听路由变化
watch(
  () => [route.name, route.params.id],
  ([toName, toId], [fromName, fromId]) => {
    // 从子路由返回到主详情页，且 ID 存在
    if (
      fromName === RouteName.VIEW_VEHICLE &&
      toName !== RouteName.VIEW_VEHICLE &&
      toId
    ) {
      loadOBDData(toId)
    }
    // 或者 ID 变了（比如切换不同 OBD）
    if (toId && toId !== fromId && toName !== RouteName.VIEW_VEHICLE) {
      loadOBDData(toId)
    }
  },
  { immediate: false },
)

// 封装数据加载逻辑
const loadOBDData = async (id) => {
  if (!id) return

  nowObdId.value = id
  try {
    await Promise.all([
      getOBDInfo(id),
      getOBDBindHistoryList(id),
      getOBDBindVehicleList(id),
      getOBDOperationRecord(id),
      getOBDConnectedCountList(id),
    ])
    isObdOn.value = obdInfo.value.status !== 10
  } catch (error) {
    console.error('Failed to load OBD data:', error)
  }
}
</script>

<template>
  <router-view
    v-if="$route.name === RouteName.VIEW_VEHICLE"
    @refresh="getOBDInfo"
  />
  <section class="flex h-full flex-col overflow-auto" v-else>
    <!-- header -->
    <div class="flex-between px-32">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        {{ obdInfo.sn }}
      </h3>
      <el-button @click="openUnbindUserDialog" v-if="obdInfo.userDto?.id">
        Unbind User
      </el-button>
    </div>
    <!-- divider -->
    <el-divider class="mt-16! mb-19!" />
    <!-- tabs -->
    <el-tabs v-model="activeTabName" @tab-change="handleTabChange">
      <el-tab-pane
        :label="ObdDetailsTabs.OBD_DETAILS"
        :name="ObdDetailsTabs.OBD_DETAILS"
      />
      <el-tab-pane
        :label="ObdDetailsTabs.BEHAVIOR_STATISTICS"
        :name="ObdDetailsTabs.BEHAVIOR_STATISTICS"
      />
    </el-tabs>
    <!-- content -->
    <el-scrollbar
      class="odb-detail-container"
      ref="obdDetailRef"
      @scroll="handleScroll"
    >
      <!-- OBD Info -->
      <div class="mx-32 mb-4 mt-32 grid grid-cols-2 gap-x-24 gap-y-8">
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
            @change="handleIsObdChange"
          />
        </div>
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
        <div class="leading-32 flex h-32 gap-8">
          <label for="warranty-end" class="w-112 leading-32 h-32">
            Warranty End
          </label>
          <div
            id="warranty-end"
            class="text-neutrals-off-black row-center h-32 flex-1"
          >
            <template v-if="obdInfo.warrantyTime">
              <span class="heading-body-body-12px-regular items-center">
                {{ getOneYearLaterDateWithDDMMMYYYYY(obdInfo.warrantyTime) }}
              </span>
              <el-tag
                :type="
                  isDateExpired(obdInfo.warrantyTime) ? 'danger' : 'success'
                "
                class="rounded-4 ml-8"
              >
                {{ isDateExpired(obdInfo.warrantyTime) ? 'Expired' : 'Valid' }}
              </el-tag>
            </template>
            <template v-else>
              <span class="heading-body-body-12px-regular items-center">-</span>
            </template>
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
            <el-table-column prop="name" label="Name" :sortable="true">
              <template #default="{ row }">
                <span>{{ row.userId ? row.name : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="email" label="Account" :sortable="true">
              <template #default="{ row }">
                <span>{{ row.userId ? row.email : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="bindingTime"
              label="Bound Date"
              :sortable="true"
            >
              <template #default="{ row }">
                {{
                  row.userId ? getFormattedPublishTime(row.bindingTime) : '-'
                }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="Status">
              <template #default="{ row }">
                <span>{{ row.userId ? 'Active' : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="{ row }">
                <el-button
                  v-if="row.userId"
                  @click.stop="handleUnbindUser(row)"
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
                {{ getDateWithDDMMMYYYY(row.createTime) }}
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
      <div class="mb-24" ref="behaviorStatisticsRef">
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
          <Line :data="chartData" :options="chartOptions" />
        </div>
        <!-- obd records -->
        <div class="mt-20" v-if="operationRecordList.length">
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
            <el-table :data="operationRecordList">
              <el-table-column label="Date">
                <template #default="{ row }">
                  {{ getDateWithDDMMMYYYY(row.createTime) }}
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
    </el-scrollbar>
    <!-- 解绑用户 -->
    <el-dialog
      v-model="unbindUserDialogVisible"
      title="Unbind User ?"
      align-center
      width="304"
      :show-close="false"
    >
      <div class="flex flex-col gap-16">
        <p class="heading-body-body-12px-regular text-neutrals-grey-3">
          You are about to unbind this user's OBD device. Once unbound, the
          device will no longer be linked to this account or transmit data. Are
          you sure you want to proceed?
        </p>
        <el-divider />
        <div class="flex-between flex gap-16">
          <el-button class="flex-1" @click="unbindUserDialogVisible = false">
            Cancel
          </el-button>
          <el-button type="danger" class="flex-1" @click="handleUnbindUser">
            Unbind
          </el-button>
        </div>
      </div>
    </el-dialog>
  </section>
</template>

<style scoped lang="scss"></style>
