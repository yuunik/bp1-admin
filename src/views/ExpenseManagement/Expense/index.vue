<script setup>
import { useDebounceFn } from '@vueuse/core'

import BaseFilterInput from '@/components/BaseFilterInput.vue'
import BasePagination from '@/components/BasePagination.vue'
import { useSort } from '@/composables/useSort.js'
import {
  getExpenseListByBrandApi,
  getExpenseListByUserApi,
} from '@/apis/expenseApi.js'
import { RouteName, TimingPreset } from '@/utils/constantsUtil.js'
import {
  getFormatNumberString,
  getFullFilePath,
} from '@/utils/dataFormattedUtil.js'

import DefaultAvatar from '@/assets/specialIcons/avatar_default.svg'

// tab 名
const activeTab = ref('By User')

// 输入搜索关键字
const searchKeywords = ref('')

// 分页数据
const pagination = reactive({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

// 用户费用列表数据
const userExpenseList = ref([])

// 品牌费用列表数据
const brandExpenseList = ref([])

// 排序参数
const sortParams = reactive({
  sort: '',
  sortBy: '',
})

// 刷新
const refresh = useDebounceFn(() => {
  if (!pagination.currentPage) {
    actionMap[activeTab.value]?.()
  }
  // 设置当前页为 1
  pagination.currentPage = 0
}, TimingPreset.DEBOUNCE)

// 排序函数
const handleSortChange = useSort(sortParams, () => refresh())

// 获取用户分页统计expense
const getExpenseListByUser = async () => {
  const { data, count } = await getExpenseListByUserApi({
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    sort: sortParams.sort,
    sortBy: sortParams.sortBy,
    searchKey: searchKeywords.value,
  })
  userExpenseList.value = data
  pagination.total = count
}

// 管理员根据车辆品牌分页统计expense
const getExpenseListByBrand = async () => {
  const { data, count } = await getExpenseListByBrandApi({
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    sort: sortParams.sort,
    sortBy: sortParams.sortBy,
    searchKey: searchKeywords.value,
  })
  brandExpenseList.value = data
  pagination.total = count
}

// 动作映射
const actionMap = {
  'By User': getExpenseListByUser,
  'By Car Brand': getExpenseListByBrand,
}

// 获取数据
const fetchExpenseList = () => actionMap[activeTab.value]?.()

// 数据重置
const resetData = () => {
  // 切换tab, 清空分页参数
  pagination.value = {
    currentPage: 0,
    pageSize: 15,
    total: 0,
  }
  // 清空搜索关键字
  searchKeywords.value = ''
  // 清空排序参数
  sortParams.sort = ''
  sortParams.sortBy = ''
}

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
  <section class="box-border flex h-full flex-col overflow-auto pb-24">
    <!-- 标题 -->
    <h2
      class="heading-h2-20px-medium text-neutrals-off-black leading-30 row-center mx-32 h-32"
    >
      Expense
    </h2>
    <!-- tabs 栏 -->
    <el-tabs v-model="activeTab" class="no-bottom my-16">
      <el-tab-pane label="By User" name="By User" />
      <el-tab-pane label="By Car Brand" name="By Car Brand" />
    </el-tabs>
    <!-- 输入搜索 -->
    <base-filter-input
      v-model="searchKeywords"
      @input-change="refresh"
      class="mx-32 mb-16"
    />
    <!-- 分割线 -->
    <el-divider />
    <!-- 表格 -->
    <div class="mx-32 flex flex-1 flex-col">
      <el-table
        v-if="activeTab === 'By User'"
        :data="userExpenseList"
        @sort-change="handleSortChange"
        class="flex-1"
        row-class-name="clickable-row"
        @row-click="
          (row) =>
            $router.push({
              name: RouteName.PERSON_MANAGE,
              params: { id: row.id },
            })
        "
      >
        <!-- 用户名 -->
        <el-table-column prop="name" label="Name" min-width="50%">
          <template #default="{ row }">
            <el-avatar
              :src="getFullFilePath(row.logo)"
              fit="cover"
              alt="user avatar"
              class="mr-8"
              :size="20"
              @error="() => true"
            >
              <img :src="DefaultAvatar" />
            </el-avatar>
            <span class="ml-8">
              {{ row.name }}
            </span>
          </template>
        </el-table-column>
        <!-- 总花费 -->
        <el-table-column
          prop="amount"
          label="Total Expense"
          min-width="50%"
          sortable="custom"
        >
          <template #default="{ row }">
            <span>
              {{
                getFormatNumberString(row.amount)
                  ? `$${getFormatNumberString(row.amount)}`
                  : '-'
              }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-else
        :data="brandExpenseList"
        @sort-change="handleSortChange"
        class="flex-1"
        row-class-name="clickable-row"
        @row-click="
          (row) =>
            $router.push({
              name: RouteName.CAR_COST_DETAILS,
              params: { id: row.id },
            })
        "
      >
        <!-- 品牌名 -->
        <el-table-column
          prop="name"
          label="Brand"
          min-width="50%"
          sortable="custom"
          row-class-name="clickable-row"
        >
          <template #default="{ row }">
            <el-avatar
              :src="getFullFilePath(row.logo)"
              fit="cover"
              alt="user avatar"
              class="mr-8"
              :size="20"
              @error="() => true"
            >
              B
            </el-avatar>
            <span class="ml-8">
              {{ row.name }}
            </span>
          </template>
        </el-table-column>
        <!-- 总花费 -->
        <el-table-column
          prop="amount"
          label="Total Expense"
          min-width="50%"
          sortable="custom"
        >
          <template #default="{ row }">
            <span>
              {{
                getFormatNumberString(row.amount)
                  ? `$${getFormatNumberString(row.amount)}`
                  : '-'
              }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination v-model="pagination" />
    </div>
  </section>
</template>

<style scoped lang="scss"></style>
