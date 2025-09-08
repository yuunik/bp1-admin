<script setup>
import BaseFilterInput from '@/components/BaseFilterInput.vue'
import BaseFilterPanel from '@/components/BaseFilterPanel.vue'
import { Edit, EditPen } from '@element-plus/icons-vue'
import BasePagination from '@/components/BasePagination.vue'
import { reactive } from 'vue'

// 条件搜索
const conditionParams = reactive({
  searchKey: '',
})

const filterBySystem = reactive({
  conditionText: 'System',
  sectionList: [
    {
      label: 'With User',
      value: '2',
    },
    {
      label: 'Without User',
      value: '1',
    },
  ],
})

const filterBySeverity = reactive({
  conditionText: 'Severity',
  sectionList: [
    {
      label: 'High',
      value: '1',
    },
    {
      label: 'Medium',
      value: '2',
    },
    {
      label: 'Low',
      value: '3',
    },
  ],
})

const pagination = reactive({
  currentPage: 0,
  total: 0,
  pageSize: 15,
})

// 筛选参数
const conditionSearchParams = reactive({
  systemList: [],
  severityList: [],
})

// 是否有筛选条件
const hasCondition = computed(() => {
  return (
    conditionSearchParams.systemList.length > 0 ||
    conditionSearchParams.severityList.length > 0
  )
})

// dtc 数据
const dtcList = ref([
  {
    system: 'Engine Control Module 1',
    code: 'P0121',
    name: 'Throttle/pedal position sensor/switch range/performance',
    severity: 'High',
  },
  {
    system: 'Brakes 1',
    code: 'C0040',
    name: 'Right front wheel speed sensor circuit malfunction',
    severity: 'Medium',
  },
  {
    system: 'Electronic Central Electric',
    code: 'B1234',
    name: 'Headlight range control module communication error',
    severity: 'Low',
  },
  {
    system: 'Instrument Cluster',
    code: 'U0155',
    name: 'Lost communication with instrument panel cluster control module',
    severity: 'Medium',
  },
  {
    system: 'Engine Control Module 1',
    code: 'P0304',
    name: 'Cylinder 4 misfire detected',
    severity: 'High',
  },
])

// 输入搜索
const handleSearchByInput = () => {}

// 筛选搜索
const handleSearchBySystem = () => {}

const handleSearchBySeverity = () => {}
</script>

<template>
  <!-- 条件搜索 -->
  <div class="flex h-24 gap-8">
    <div class="flex h-24 gap-8">
      <base-filter-panel
        v-model="conditionSearchParams.systemList"
        :section-list="filterBySystem.sectionList"
        :condition-text="filterBySystem.conditionText"
        @search="handleSearchBySystem"
      />
      <base-filter-panel
        v-model="conditionSearchParams.severityList"
        :section-list="filterBySeverity.sectionList"
        :condition-text="filterBySeverity.conditionText"
        @search="handleSearchBySeverity"
      />
    </div>
    <!-- 重置条件搜索 -->
    <el-button text type="primary" class="h-24!" v-show="hasCondition">
      Clear
    </el-button>
  </div>
  <div class="flex flex-1 flex-col justify-between">
    <el-table :data="dtcList" class="flex-1">
      <el-table-column type="selection" min-width="6%" />
      <el-table-column prop="system" label="System" min-width="25%" />
      <el-table-column prop="code" label="DTC Code" min-width="13%" />
      <el-table-column prop="name" label="DTC Name" min-width="42%" />
      <el-table-column prop="severity" label="Severity" min-width="9%" />
      <el-table-column min-width="5%">
        <template #default="{ row }">
          <el-icon class="h-16 w-16 cursor-pointer">
            <edit />
          </el-icon>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pagination" />
  </div>
</template>

<style scoped lang="scss"></style>
