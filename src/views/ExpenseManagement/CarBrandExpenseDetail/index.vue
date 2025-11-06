<script setup>
import { useDebounceFn } from '@vueuse/core'
import { useRoute } from 'vue-router'

import BaseExpenseBreakdownChart from '@/components/BaseExpenseBreakdownChart.vue'
import BaseFilterInput from '@/components/BaseFilterInput.vue'
import {
  CategoryColorMap,
  CategoryIconMap,
  ModuleColorMap,
  ModuleIconMap,
  TimingPreset,
} from '@/utils/constantsUtil.js'
import BasePagination from '@/components/BasePagination.vue'
import {
  getExpenseGroupPriceByBrandApi,
  getExpenseGroupPriceListByBrandApi,
} from '@/apis/expenseApi.js'

// 获取路由
const route = useRoute()

// 当前的品牌id
const brandId = ref('')

// 获取路径中的id
const {
  params: { id },
} = route
if (id) {
  brandId.value = id
}

// 当前 tab 页
const activeTab = ref('By Module')

// 输入搜索关键字
const searchKeywords = ref('')

// 分页数据
const pagination = reactive({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

const tableData = ref([
  {
    model: 'A1',
    engine: 500,
    transmission: 500,
    brakes: 500,
    electrical: 500,
    chassis: 500,
    bodyTrim: 500,
    others: 500,
  },
  {
    model: 'A2',
    engine: 500,
    transmission: 500,
    brakes: 500,
    electrical: 500,
    chassis: 500,
    bodyTrim: 500,
    others: 500,
  },
])

// 费用数据列表
const expenseList = ref([])

// 型号费用数据列表
const modelExpenseList = ref([])

// 分组类型
const byGroup = computed(() =>
  activeTab.value === 'By Module' ? 'module' : 'category',
)

// 图表数据
const chartData = computed(() =>
  expenseList.value.length
    ? expenseList.value.map((expense) => ({
        name: expense.category,
        amount: Number(expense.amount),
        icon:
          byGroup.value === 'module'
            ? ModuleIconMap[expense.category]
            : CategoryIconMap[expense.category],
        color:
          byGroup.value === 'module'
            ? ModuleColorMap[expense.category]
            : CategoryColorMap[expense.category],
      }))
    : [],
)

// 刷新
const refresh = useDebounceFn(() => {
  if (!pagination.currentPage) {
    return
  }
  // 设置当前页为 1
  pagination.currentPage = 0
}, TimingPreset.DEBOUNCE)

// 管理员根据Brand获取分组价格
const getExpenseGroupPriceByBrand = async () => {
  const { data } = await getExpenseGroupPriceByBrandApi({
    brandId: brandId.value,
    byGroup: byGroup.value,
  })
  expenseList.value = data
}

// 管理员根据Brand分页获取每个型号的分组价格
const getExpenseGroupPriceListByBrand = async () => {
  const { data } = await getExpenseGroupPriceListByBrandApi({
    brandId: brandId.value,
    byGroup: byGroup.value,
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
  })
  modelExpenseList.value = data
}
// 获取数据
const fetchExpenseList = async () =>
  await Promise.all([
    getExpenseGroupPriceByBrand(),
    getExpenseGroupPriceListByBrand(),
  ])

// 数据重置
const resetData = () =>
  // 切换tab, 清空分页参数
  (pagination.value = {
    currentPage: 0,
    pageSize: 15,
    total: 0,
  })

// 监听分页数据
watch(
  () => pagination.currentPage,
  () => fetchExpenseList(),
)

// 监听tab切换
watch(
  activeTab,
  () => {
    // 数据重置
    resetData()
    // 获取数据
    fetchExpenseList()
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <section class="box-border flex h-full flex-col gap-16 overflow-auto pb-24">
    <h2
      class="heading-h2-20px-medium text-neutrals-off-black leading-30 row-center mx-32 h-32"
    >
      Audi
    </h2>
    <!-- tabs 栏 -->
    <el-tabs v-model="activeTab" class="has-top">
      <el-tab-pane label="By Module" name="By Module" />
      <el-tab-pane label="By Category" name="By Category" />
    </el-tabs>
    <!-- 图表 -->
    <base-expense-breakdown-chart
      v-if="chartData.length"
      :chart-data="chartData"
      class="max-w-1000 mx-32"
    />
    <div class="mx-32 flex flex-1 flex-col">
      <h3
        class="heading-body-large-body-14px-medium text-neutrals-off-black leading-20 row-center mx-32 h-24"
      >
        Model Expense
      </h3>
      <el-divider class="mt-8!" />
      <!-- 输入搜索 -->
      <base-filter-input
        v-model="searchKeywords"
        @input-change="refresh"
        class="h-32"
      />
      <!-- 表格 -->
      <div class="flex flex-1 flex-col">
        <el-table :data="tableData" class="has-top flex-1">
          <el-table-column prop="model" label="Model" width="100" />

          <el-table-column prop="engine" label="Engine" align="right" />
          <el-table-column
            prop="transmission"
            label="Transmission"
            align="right"
          />
          <el-table-column prop="brakes" label="Brakes" align="right" />
          <el-table-column prop="electrical" label="Electrical" align="right" />
          <el-table-column prop="chassis" label="Chassis" align="right" />
          <el-table-column
            prop="bodyTrim"
            label="Body and Trim"
            align="right"
          />
          <el-table-column prop="others" label="Others" align="right" />
        </el-table>
        <base-pagination v-model="pagination" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss"></style>
