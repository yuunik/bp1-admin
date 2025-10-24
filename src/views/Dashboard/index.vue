<script setup>
import { Line, Pie } from 'vue-chartjs'
import { storeToRefs } from 'pinia'

import ContentItem from '@/views/Dashboard/components/ContentItem.vue'

// 静态资源
import GreetingIcon from '@/assets/images/Waving Hand.png'
import { useUserStore } from '@/store/index.js'
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

const orderFormData = {
  labels: ['App', 'Web'],
  datasets: [
    {
      data: [20, 80],
      backgroundColor: ['#000000', '#3B82F6'], // 黑色 + 蓝色
      borderWidth: 0,
      cutout: '70%', // 控制环的粗细
    },
  ],
}

// 自定义插件：在中心绘制文字
const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    const { ctx, width, height } = chart
    ctx.save()

    const text1 = 'Web'
    const text2 = '80%'

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // 第一行
    ctx.fillStyle = '#6F7788'
    ctx.font = '14px sans-serif'
    ctx.fillText(text1, width / 2, height / 2 - 10)

    // 第二行
    ctx.font = 'bold 16px sans-serif'
    ctx.fillText(text2, width / 2, height / 2 + 15)

    ctx.restore()
  },
}

const orderFormOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false, // 右侧图例可关掉，自己写 legend
    },
  },
}

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
  <section class="h-full! border-box flex overflow-auto overflow-x-hidden">
    <div class="box-border flex h-full w-[67%] w-full flex-col gap-24 p-32">
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
              {{ username }}
            </em>
            <el-image
              class="inline-block h-24 w-24 rounded-full"
              :src="GreetingIcon"
            />
          </div>
        </div>
        <p class="heading-body-large-body-14px-regular text-neutrals-grey-4">
          {{ getTodayWithWeekday() }}
        </p>
      </div>
      <!-- order info -->
      <div class="get-gray flex flex-col gap-8">
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
              metric-value="-"
            />
            <dashboard-card
              class="flex-1"
              metric-label="New Additions"
              metric-value="-"
            />
          </div>
          <div class="flex gap-16">
            <dashboard-card
              class="flex-1"
              metric-label="Pending"
              metric-value="-"
              metric-value-text-color="text-status-colours-yellow"
            />
            <dashboard-card
              class="flex-1"
              metric-label="Shipped"
              metric-value="-"
              metric-value-text-color="text-status-colours-orange"
            />
            <dashboard-card
              class="flex-1"
              metric-label="Refund"
              metric-value="-"
              metric-value-text-color="text-status-colours-purple"
            />
          </div>
        </div>
      </div>
      <!-- OBD info -->
      <div class="get-gray flex flex-col gap-8">
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
            metric-value="-"
            bg-color="bg-status-colours-light-green"
            metric-value-text-color="text-status-colours-green"
          />
          <dashboard-card
            class="flex-1"
            metric-label="In Use"
            metric-value="-"
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
            <el-table-column prop="Name" label="User" min-width="69%">
              <template #default="{ row }">
                <el-avatar
                  v-if="row.Logo"
                  fit="cover"
                  :src="getFullFilePath(row.Logo)"
                  class="mr-8 h-20 w-20 shrink-0"
                  alt="brand icon"
                  shape="circle"
                  :size="20"
                  @error="() => true"
                >
                  <template #error>
                    <i class="i-ep:picture" />
                  </template>
                </el-avatar>
                <span
                  class="cursor-pointer text-wrap underline"
                  @click="
                    $router.push({
                      Name: RouteName.PERSON_MANAGE,
                      params: { id: row.UserId },
                    })
                  "
                >
                  {{ row.Name || '-' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="TotalAmount"
              label="Total Expense"
              min-width="31%"
            >
              <template v-slot="{ row }">
                <span>${{ row.TotalAmount }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!--<el-divider direction="vertical" />-->
    <!--<div class="get-gray box-border flex h-full w-[33%] flex-col gap-32 p-16">-->
    <!--  <div class="flex flex-col gap-16">-->
    <!--    &lt;!&ndash; Subscription info &ndash;&gt;-->
    <!--    <div class="rounded-8 border-container row-center px-16 py-36">-->
    <!--      <div class="flex flex-1 flex-col gap-16">-->
    <!--        <span-->
    <!--          class="heading-body-large-body-14px-regular text-neutrals-grey-4 leading-20"-->
    <!--        >-->
    <!--          Subscription-->
    <!--        </span>-->
    <!--        <p-->
    <!--          class="heading-h1-26px-medium leading-34 text-neutrals-off-black leading-34"-->
    <!--        >-->
    <!--          50-->
    <!--        </p>-->
    <!--      </div>-->
    <!--      <div class="flex flex-1 flex-col gap-16">-->
    <!--        <span-->
    <!--          class="heading-body-large-body-14px-regular text-neutrals-grey-4 leading-20"-->
    <!--        >-->
    <!--          Subscription Rate-->
    <!--        </span>-->
    <!--        <p-->
    <!--          class="heading-h1-26px-medium leading-34 text-neutrals-off-black leading-34"-->
    <!--        >-->
    <!--          40%-->
    <!--        </p>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--    &lt;!&ndash; New Subscription &ndash;&gt;-->
    <!--    <div class="new-subscription-container">-->
    <!--      <div class="flex flex-1 flex-col gap-16">-->
    <!--        <h4-->
    <!--          class="heading-body-body-12px-regular leading-16 text-neutrals-grey-2"-->
    <!--        >-->
    <!--          New Subscription-->
    <!--        </h4>-->
    <!--        <div class="flex flex-col gap-16">-->
    <!--          <div class="h-19 flex gap-8">-->
    <!--            <em-->
    <!--              class="heading-h1-26px-medium text-neutrals-off-white leading-34"-->
    <!--            >-->
    <!--              5-->
    <!--            </em>-->
    <!--            <i class="rounded-100 flex bg-[#EF3C3033] p-4">-->
    <!--              <em-->
    <!--                class="heading-body-body-12px-regular text-status-colours-red leading-16 m-auto not-italic"-->
    <!--              >-->
    <!--                -2%-->
    <!--              </em>-->
    <!--            </i>-->
    <!--          </div>-->
    <!--          <span-->
    <!--            class="heading-caption-caption-10px-regular text-neutrals-grey-3 leading-15 h-7"-->
    <!--          >-->
    <!--            Compared to last month-->
    <!--          </span>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <Line-->
    <!--        class="min-w-0 flex-1"-->
    <!--        :data="chartData"-->
    <!--        :options="chartOptions"-->
    <!--      />-->
    <!--    </div>-->
    <!--    &lt;!&ndash; Order Form &ndash;&gt;-->
    <!--    <div-->
    <!--      class="h-116 rounded-8 border-container row-center box-border flex gap-16 px-16 py-36"-->
    <!--    >-->
    <!--      <div class="h-96 flex-1">-->
    <!--        <Pie-->
    <!--          class="h-full w-full"-->
    <!--          :data="orderFormData"-->
    <!--          :options="orderFormOptions"-->
    <!--          :plugins="[centerTextPlugin]"-->
    <!--        />-->
    <!--      </div>-->
    <!--      <div class="flex flex-1 flex-col gap-16">-->
    <!--        <h4-->
    <!--          class="heading-body-body-12px-regular text-neutrals-grey-4 leading-16 tracking-0"-->
    <!--        >-->
    <!--          Order From-->
    <!--        </h4>-->
    <!--        <div class="flex flex-col gap-16">-->
    <!--          <div class="flex-between">-->
    <!--            <div class="row-center h-9 gap-8">-->
    <!--              <i-->
    <!--                class="custom-radial-gradient block h-8 w-8 rounded-full"-->
    <!--              />-->
    <!--              <span-->
    <!--                class="heading-caption-caption-10px-regular text-neutrals-grey-4 leading-15"-->
    <!--              >-->
    <!--                App-->
    <!--              </span>-->
    <!--            </div>-->
    <!--            <span-->
    <!--              class="heading-body-body-12px-medium text-neutrals-off-black leading-16"-->
    <!--            >-->
    <!--              20-->
    <!--            </span>-->
    <!--          </div>-->
    <!--          <div class="flex-between">-->
    <!--            <div class="row-center h-9 gap-8">-->
    <!--              <i-->
    <!--                class="bg-branding-colours-primary block h-8 w-8 rounded-full"-->
    <!--              />-->
    <!--              <span-->
    <!--                class="heading-caption-caption-10px-regular text-neutrals-grey-4 leading-15"-->
    <!--              >-->
    <!--                Web-->
    <!--              </span>-->
    <!--            </div>-->
    <!--            <span-->
    <!--              class="heading-body-body-12px-medium text-neutrals-off-black leading-16"-->
    <!--            >-->
    <!--              80-->
    <!--            </span>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--  </div>-->
    <!--  <div>-->
    <!--    &lt;!&ndash; title &ndash;&gt;-->
    <!--    <div class="flex-between h-32">-->
    <!--      <h3-->
    <!--        class="heading-body-large-body-14px-medium text-neutrals-off-black leading-20"-->
    <!--      >-->
    <!--        Order-->
    <!--      </h3>-->
    <!--      <i class="icon-typesarrow-right text-16" />-->
    <!--    </div>-->
    <!--    &lt;!&ndash; notifications&ndash;&gt;-->
    <!--    <div-->
    <!--      class="h-55 border-tb-container row-center gap-12 py-8"-->
    <!--      v-for="item in 10"-->
    <!--      :key="item"-->
    <!--    >-->
    <!--      &lt;!&ndash; 头像 &ndash;&gt;-->
    <!--      <div class="relative h-32 w-32">-->
    <!--        &lt;!&ndash; 头像 &ndash;&gt;-->
    <!--        <i-->
    <!--          class="bg-neutrals-grey-1 m-auto block flex h-32 w-32 rounded-full"-->
    <!--        >-->
    <!--          <span class="leading-32 h-32">JW</span>-->
    <!--        </i>-->
    <!--        &lt;!&ndash; 消息通知点 &ndash;&gt;-->
    <!--        <i-->
    <!--          class="bg-status-colours-green absolute right-0 top-0 block h-8 w-8 rounded-full"-->
    <!--        />-->
    <!--      </div>-->
    <!--      &lt;!&ndash; 内容 &ndash;&gt;-->
    <!--      <div class="flex flex-col gap-8">-->
    <!--        <p class="heading-body-body-12px-medium text-neutrals-off-black">-->
    <!--          Title-->
    <!--        </p>-->
    <!--        <span-->
    <!--          class="heading-caption-caption-10px-regular text-neutrals-grey-4"-->
    <!--        >-->
    <!--          Description-->
    <!--        </span>-->
    <!--        <span-->
    <!--          class="heading-caption-caption-10px-regular text-neutrals-grey-3"-->
    <!--        >-->
    <!--          1 mins ago-->
    <!--        </span>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--  </div>-->
    <!--</div>-->
  </section>
</template>

<style scoped lang="scss">
.border-container {
  border: 1px solid #eaeef4;
}

// 新增订阅率的容器
.new-subscription-container {
  @apply rounded-8 h-116 flex px-16 py-24;
  background-image: $default-background-image;
  box-shadow: 0 1px 2px 0 rgba(10, 13, 20, 0.03);
}

.custom-radial-gradient {
  background-image: $default-background-image;
}

.border-tb-container {
  border-top: 1px solid #eff4f9;
  border-bottom: 1px solid #eff4f9;
}

//.get-gray {
//  color: #ccc;
//  background-color: #9e9e9e;
//}
</style>
