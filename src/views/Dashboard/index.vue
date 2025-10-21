<script setup>
import { Line } from 'vue-chartjs'

import ContentItem from '@/views/Dashboard/components/ContentItem.vue'

// 静态资源
import GreetingIcon from '@/assets/images/Waving Hand.png'
import { useUserStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'
import { getTodayWithWeekday } from '@/utils/dateUtil.js'
import {
  getAllUserExpenseSumApi,
  getDashboardDataApi,
} from '@/apis/dahboardApi.js'
import DashboardCard from '@/views/Dashboard/components/DashboardCard.vue'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import { RouteName } from '@/utils/constantsUtil.js'
import { useSort } from '@/composables/useSort.js'

const chartData = ref({
  labels: [
    '2025-07-18',
    '2025-07-19',
    '2025-07-20',
    '2025-07-21',
    '2025-07-22',
  ],
  datasets: [
    {
      label: 'My Data',
      data: [3, 4, 5, 2, 6],
      borderColor: '#3b82f6',
      backgroundColor: '#3b82f6',
      pointBackgroundColor: '#3b82f6',
      pointRadius: 4,
      tension: 0.3,
      fill: false,
    },
  ],
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      backgroundColor: '#1f2937',
      titleColor: '#fff',
      bodyColor: '#fff',
      callbacks: {
        title: ([ctx]) => {
          const date = new Date(ctx.label)
          return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
          }) // e.g. "20 July"
        },
        label: (ctx) => `${ctx.dataset.data[ctx.dataIndex]}`,
      },
    },
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      time: {
        unit: 'day',
        tooltipFormat: 'dd MMMM',
      },
      ticks: {
        display: false, // 隐藏x轴标签
      },
      grid: {
        display: false, // 隐藏x轴网格线
      },
    },
    y: {
      ticks: {
        display: false, // 隐藏y轴标签
      },
      grid: {
        display: false, // 隐藏y轴网格线
      },
    },
  },
})

const userStore = useUserStore()

// 获取用户相关信息
const { username } = storeToRefs(userStore)

const dashboardData = ref({})

// expense user list
const expenseUserList = ref([])

// 排序参数
const sortParams = reactive({
  sort: '',
  sortBy: '',
})

// expense 用户总花费
const expenseUserListTotalAmount = ref(0)

// 总用户数
const userCount = ref(0)

// 新增用户数
const newUserCount = ref(0)

// obd用户数
const obdUserCount = ref(0)

// 获取数据
const getDashboardData = async () => {
  // 获取数据
  const {
    data: { totalUserCount, todayUserCount, obdUserCount },
  } = await getDashboardDataApi()
  userCount.value = totalUserCount
  newUserCount.value = todayUserCount
  obdUserCount.value = obdUserCount
}

// 获取expense user list数据
const getExpenseUserList = async () => {
  const {
    data: { users, allAmount },
  } = await getAllUserExpenseSumApi(sortParams)
  // 设置数据
  expenseUserList.value = users
  expenseUserListTotalAmount.value = `$${allAmount}`
}

// 排序函数
const sort = useSort(sortParams, getExpenseUserList)

onMounted(async () => {
  // 获取数据
  await Promise.all([getDashboardData(), getExpenseUserList()])
})
</script>

<template>
  <section class="h-full! flex overflow-auto">
    <div class="box-border flex h-full w-[67%] flex-col gap-24 p-32">
      <!-- greeting -->
      <div class="flex-between h-42">
        <div class="flex flex-col gap-8">
          <strong
            class="heading-body-large-body-14px-regular text-neutrals-grey-4 leading-20"
          >
            Welcome back!
          </strong>
          <div class="flex h-24 gap-4">
            <!-- user name -->
            <em
              class="heading-h2-20px-medium text-neutrals-off-black leading-30 not-italic"
            >
              Jonathan Wong
            </em>
            <el-image
              class="inline-block h-24 w-24 rounded-full"
              :src="GreetingIcon"
            />
          </div>
        </div>
        <p class="heading-body-large-body-14px-regular text-neutrals-grey-4">
          Tuesday, 20 Aug
        </p>
      </div>
      <!-- order info -->
      <div class="flex flex-col gap-8">
        <!-- title -->
        <div class="flex-between h-32">
          <h3
            class="heading-body-large-body-14px-medium text-neutrals-off-black leading-20"
          >
            Order
          </h3>
          <i class="icon-typesarrow-right text-16" />
        </div>
        <!-- card container -->
        <div class="flex flex-col gap-8">
          <div class="flex gap-16">
            <dashboard-card
              class="flex-1"
              metric-label="All Orders"
              metric-value="0"
            />
            <dashboard-card
              class="flex-1"
              metric-label="New Additions"
              metric-value="20"
            />
          </div>
          <div class="flex gap-16">
            <dashboard-card
              class="flex-1"
              metric-label="Pending"
              metric-value="20"
              metric-value-text-color="text-status-colours-yellow"
            />
            <dashboard-card
              class="flex-1"
              metric-label="Shipped"
              metric-value="20"
              metric-value-text-color="text-status-colours-orange"
            />
            <dashboard-card
              class="flex-1"
              metric-label="Refund"
              metric-value="10"
              metric-value-text-color="text-status-colours-purple"
            />
          </div>
        </div>
      </div>
      <!-- OBD info -->
      <div class="flex flex-col gap-8">
        <!-- title -->
        <div class="flex-between h-32">
          <h3
            class="heading-body-large-body-14px-medium text-neutrals-off-black leading-20"
          >
            OBD
          </h3>
          <i class="icon-typesarrow-right text-16" />
        </div>
        <!-- card container -->
        <div class="flex gap-24">
          <dashboard-card
            class="flex-1"
            metric-label="In Stock"
            metric-value="500"
            bg-color="bg-status-colours-light-green"
            metric-value-text-color="text-status-colours-green"
          />
          <dashboard-card
            class="flex-1"
            metric-label="In Use"
            metric-value="500"
            bg-color="bg-status-colours-light-blue"
            metric-value-text-color="text-status-colours-blue"
          />
        </div>
      </div>
      <!-- User list info -->
      <div class="flex flex-col gap-8">
        <!-- title -->
        <div class="flex-between h-32">
          <h3
            class="heading-body-large-body-14px-medium text-neutrals-off-black leading-20"
          >
            User
          </h3>
          <i class="icon-typesarrow-right text-16" />
        </div>
        <!-- card container -->
        <div class="flex gap-16">
          <dashboard-card
            class="flex-1"
            metric-label="All User"
            :metric-value="userCount"
          />
          <dashboard-card
            class="flex-1"
            metric-label="New Users"
            :metric-value="newUserCount"
          />
          <dashboard-card
            class="flex-1"
            metric-label="OBD Users"
            :metric-value="obdUserCount"
          />
          <dashboard-card
            class="flex-1"
            metric-label="Total Expense"
            :metric-value="expenseUserListTotalAmount"
          />
        </div>
        <div>
          <el-table :data="expenseUserList" @sort-change="sort">
            <el-table-column
              prop="name"
              label="User"
              min-width="69%"
              sortable="custom"
            >
              <template #default="{ row }">
                <el-avatar
                  v-if="row.logo"
                  fit="cover"
                  :src="getFullFilePath(row.logo)"
                  class="mr-8 h-20 w-20 shrink-0"
                  alt="brand icon"
                  shape="circle"
                  :size="20"
                  @error="errorHandler"
                >
                  <template #error>
                    <i class="i-ep:picture" />
                  </template>
                </el-avatar>
                <span
                  class="cursor-pointer text-wrap underline"
                  @click="
                    $router.push({
                      name: RouteName.PERSON_MANAGE,
                      params: { id: row.userId },
                    })
                  "
                >
                  {{ row.name || '-' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="totalAmount"
              label="Total Expense"
              min-width="31%"
            >
              <template v-slot="{ row }">
                <span>${{ row.totalAmount }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-divider direction="vertical" />
    <div class="box-border h-full w-[33%] p-16">B</div>
  </section>
</template>

<style scoped lang="scss"></style>
