<script setup>
import { useDebounceFn } from '@vueuse/core'

import BaseFilterInput from '@/components/BaseFilterInput.vue'
import BasePagination from '@/components/BasePagination.vue'
import { useSort } from '@/composables/useSort.js'
import { getExpenseListByUserApi } from '@/apis/expenseApi.js'
import { TimingPreset } from '@/utils/constantsUtil.js'
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

// 列表数据
const expenseList = ref([])

// 排序参数
const sortParams = reactive({
  sort: '',
  sortBy: '',
})

// 刷新
const refresh = useDebounceFn(() => {
  if (!pagination.currentPage) {
    return getExpenseListByUser()
  }
  // 设置当前页为 1
  pagination.currentPage = 0
}, TimingPreset.DEBOUNCE)

// 排序函数
const handleSortChange = useSort(sortParams, () => refresh())

// 获取用户分页统计expense
const getExpenseListByUser = async () => {
  const { data } = await getExpenseListByUserApi({
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    sort: sortParams.sort,
    sortBy: sortParams.sortBy,
    searchKey: searchKeywords.value,
  })
  expenseList.value = data
}

// 监听分页数据
watch(
  () => pagination.currentPage,
  () => getExpenseListByUser(),
)

// 组件创建, 获取数据
getExpenseListByUser()
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
      @inputChange="refresh"
      class="mx-32 mb-16"
    />
    <!-- 分割线 -->
    <el-divider />
    <!-- 表格 -->
    <div class="mx-32 flex flex-1 flex-col">
      <el-table
        :data="expenseList"
        @sort-change="handleSortChange"
        class="flex-1"
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
      <base-pagination v-model="pagination" />
    </div>
  </section>
</template>

<style scoped lang="scss"></style>
