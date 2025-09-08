<script setup>
// 当前 tab 名称
import BaseFilterPanel from '@/components/BaseFilterPanel.vue'
import BaseFilterInput from '@/components/BaseFilterInput.vue'
import { useDebounceFn } from '@vueuse/core'
import { TimingPreset } from '@/utils/constantsUtil.js'
import BasePagination from '@/components/BasePagination.vue'

const activeName = ref('All')

// 筛选组参数
const groupList = ref([])

const groupKeys = computed(() => groupList.value.join(','))

const groupFilterParams = ref([
  {
    label: 'All',
    value: 'All',
  },
  {
    label: 'Vehicle Parts',
    value: 'Vehicle Parts',
  },
  {
    label: 'Maintenance',
    value: 'Maintenance',
  },
  {
    label: 'Fuel',
    value: 'Fuel',
  },
  {
    label: 'Services',
    value: 'Services',
  },
  {
    label: 'Others',
    value: 'Others',
  },
])

// 分类参数
const categoryList = ref([])

const categoryKeys = computed(() => categoryList.value.join(','))

const categoryFilterParams = ref([
  {
    label: 'Active',
    value: '0',
  },
  {
    label: 'Disabled',
    value: '1',
  },
])

// 模块参数
const moduleList = ref([])

const moduleKeys = computed(() => moduleList.value.join(','))

const moduleFilterParams = ref([
  {
    label: 'Active',
    value: '0',
  },
  {
    label: 'Disabled',
    value: '1',
  },
])

// 创建者参数
const creatorList = ref([])

const creatorKeys = computed(() => creatorList.value.join(','))

const creatorFilterParams = ref([
  {
    label: 'All',
    value: 'All',
  },
  {
    label: 'Vehicle Parts',
    value: 'Vehicle Parts',
  },
  {
    label: 'Maintenance',
    value: 'Maintenance',
  },
  {
    label: 'Fuel',
    value: 'Fuel',
  },
  {
    label: 'Services',
    value: 'Services',
  },
  {
    label: 'Others',
    value: 'Others',
  },
])

// 创建日期参数
const createdDateList = ref([])

const createdDateKeys = computed(() => createdDateList.value.join(','))

const createdDateFilterParams = ref([
  {
    label: 'All',
    value: 'All',
  },
  {
    label: 'Today',
    value: 'Today',
  },
  {
    label: 'This Month',
    value: 'This Month',
  },
  {
    label: 'This Year',
    value: 'This Year',
  },
])

// 分页数据
const pagination = reactive({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

// 是否有筛选条件
const hasCondition = computed(
  () =>
    groupList.value.length > 0 ||
    categoryList.value.length > 0 ||
    moduleList.value.length > 0 ||
    creatorList.value.length > 0 ||
    createdDateList.value.length > 0,
)

// 输入搜索关键字
const searchKeywords = ref('')

const expenseList = reactive([
  {
    group: 'Vehicle Parts',
    itemName: 'Air & Fuel Delivery',
    category: 'Repair',
    module: 'Engine',
    creator: 'Admin',
    creationDate: '03 Apr 2026',
  },
  {
    group: 'Vehicle Parts',
    itemName: 'Audio / Video',
    category: 'Repair',
    module: 'Engine',
    creator: 'Admin',
    creationDate: '03 Apr 2026',
  },
  {
    group: 'Vehicle Parts',
    itemName: 'Belts & Cooling',
    category: 'Repair',
    module: 'Engine',
    creator: 'Admin',
    creationDate: '03 Apr 2026',
  },
  {
    group: 'Vehicle Parts',
    itemName: 'Body',
    category: 'Repair',
    module: 'Engine',
    creator: 'Admin',
    creationDate: '03 Apr 2026',
  },
  {
    group: 'Maintenance',
    itemName: 'General Maintenance Check',
    category: 'Repair',
    module: 'Engine',
    creator: 'Admin',
    creationDate: '03 Apr 2026',
  },
  {
    group: 'Maintenance',
    itemName: 'Engine Oil Change',
    category: 'Repair',
    module: 'Engine',
    creator: 'Admin',
    creationDate: '03 Apr 2026',
  },
  {
    group: 'Others',
    itemName: 'Oil Filter Replacement',
    category: 'Repair',
    module: 'Engine',
    creator: 'Admin',
    creationDate: '03 Apr 2026',
  },
  {
    group: 'Others',
    itemName: 'Timing Belt Replacement',
    category: 'Repair',
    module: 'Engine',
    creator: 'Admin',
    creationDate: '03 Apr 2026',
  },
  {
    group: 'Others',
    itemName: 'Battery Replacement',
    category: 'Repair',
    module: 'Brakes',
    creator: 'Katy',
    creationDate: '03 Apr 2026',
  },
])

// 刷新
const refresh = useDebounceFn(() => {
  if (!pagination.currentPage) {
    return
  }
  // 设置当前页为 1
  pagination.currentPage = 0
}, TimingPreset.DEBOUNCE)

// 清除筛选条件
const handleClearCondition = () => {
  groupList.value = []
  categoryList.value = []
  moduleList.value = []
  creatorList.value = []
  createdDateList.value = []
  refresh()
}

// 监听分页数据变化
watch(
  () => pagination.currentPage,
  () => {},
)
</script>

<template>
  <section class="mx-32 box-border flex flex-col gap-16 overflow-auto pb-32">
    <!-- 标题栏 -->
    <div class="flex-between h-32">
      <h3
        class="heading-h2-20px-medium text-neutrals-off-black row-center h-32"
      >
        Expense Items
      </h3>
      <el-button type="primary">Create</el-button>
    </div>
    <!-- tab 栏 -->
    <el-tabs v-model="activeName">
      <el-tab-pane label="All" name="All" />
      <el-tab-pane label="Vehicle Parts" name="Vehicle Parts" />
      <el-tab-pane label="Maintenance" name="Maintenance" />
      <el-tab-pane label="Fuel" name="Fuel" />
      <el-tab-pane label="Services" name="Services" />
      <el-tab-pane label="Others" name="Others" />
    </el-tabs>
    <!-- 搜索栏 -->
    <div class="flex-between h-24">
      <div class="row-center h-24 gap-8">
        <div class="row-center h-24 gap-8">
          <!-- 组筛选 -->
          <base-filter-panel
            v-model="groupList"
            :section-list="groupFilterParams"
            condition-text="Group"
            @search="refresh"
          />
          <!-- 分类筛选 -->
          <base-filter-panel
            v-model="categoryList"
            :section-list="categoryFilterParams"
            condition-text="Group"
            @search="refresh"
          />
          <!-- 模块筛选 -->
          <base-filter-panel
            v-model="moduleList"
            :section-list="moduleFilterParams"
            condition-text="Group"
            @search="refresh"
          />
          <!-- 创建者筛选 -->
          <base-filter-panel
            v-model="creatorList"
            :section-list="creatorFilterParams"
            condition-text="Group"
            @search="refresh"
          />
          <!-- 创建日期筛选 -->
          <base-filter-panel
            v-model="createdDateList"
            :section-list="createdDateFilterParams"
            condition-text="Group"
            @search="refresh"
          />
        </div>
        <!-- 清除按钮 -->
        <el-button
          type="text"
          class="h-24!"
          @click="handleClearCondition"
          v-show="hasCondition"
        >
          Clear
        </el-button>
      </div>
      <!-- 输入搜索 -->
      <base-filter-input v-model="searchKeywords" @inputChange="refresh" />
    </div>
    <!-- 表格内容 -->
    <div class="flex flex-1 flex-col justify-between">
      <el-table :data="expenseList" style="width: 100%" class="flex-1">
        <el-table-column type="selection" min-width="6%" />
        <el-table-column prop="group" label="Group" min-width="17%" />
        <el-table-column prop="itemName" label="Item Name" min-width="17%" />
        <el-table-column prop="category" label="Category" min-width="17%" />
        <el-table-column prop="module" label="Module" min-width="17%" />
        <el-table-column prop="creator" label="Creator" min-width="17%" />
        <el-table-column
          prop="creationDate"
          label="Creation Date"
          min-width="17%"
        />
        <el-table-column min-width="6%">
          <template #default="scope">
            <i class="icon-more-2-line text-16" />
          </template>
        </el-table-column>
      </el-table>
      <base-pagination v-model="pagination" />
    </div>
  </section>
</template>

<style scoped lang="scss">
// 重置 tab 栏样式
:deep(.el-tabs__nav-wrap) {
  margin-left: 0 !important;
}
</style>
