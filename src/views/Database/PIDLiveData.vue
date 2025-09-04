<script setup>
import BaseFilterPanel from '@/components/BaseFilterPanel.vue'
import BaseFilterInput from '@/components/BaseFilterInput.vue'
import BasePagination from '@/components/BasePagination.vue'
import { Edit } from '@element-plus/icons-vue'

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

const pagination = reactive({
  currentPage: 0,
  total: 0,
  pageSize: 15,
})

const pidLiveDataList = reactive([
  { pid: '0C', params: 'Engine RPM', range: '0 – 8,000', unit: 'rpm' },
  { pid: '0D', params: 'Vehicle Speed', range: '0 – 255', unit: 'km/h' },
  {
    pid: '05',
    params: 'Engine Coolant Temperature',
    range: '-40 – 215',
    unit: '°C',
  },
  {
    pid: '0F',
    params: 'Intake Air Temperature',
    range: '-40 – 215',
    unit: '°C',
  },
  { pid: '10', params: 'MAF Air Flow Rate', range: '0 – 655.35', unit: 'g/s' },
  { pid: '11', params: 'Throttle Position', range: '0 – 100', unit: '%' },
  { pid: '04', params: 'Calculated Engine Load', range: '0 – 100', unit: '%' },
  { pid: '2F', params: 'Fuel Level Input', range: '0 – 100', unit: '%' },
  {
    pid: '46',
    params: 'Ambient Air Temperature',
    range: '-40 – 215',
    unit: '°C',
  },
  {
    pid: '0B',
    params: 'Intake Manifold Pressure',
    range: '0 – 255',
    unit: 'kPa',
  },
  {
    pid: '1F',
    params: 'Run Time Since Engine Start',
    range: '0 – 65,535',
    unit: 's',
  },
  { pid: '14', params: 'O2 Sensor 1 Voltage', range: '0 – 1.275', unit: 'V' },
  {
    pid: '15',
    params: 'O2 Sensor 2 Short-Term Fuel Trim',
    range: '-100 – 99.2',
    unit: '%',
  },
  {
    pid: '21',
    params: 'Distance Traveled with MIL On',
    range: '0 – 65,535',
    unit: 'km',
  },
])

// 输入搜索
const handleSearchByInput = () => {}

// 筛选搜索
const handleSearchBySystem = () => {}
</script>

<template>
  <!-- 条件搜索 -->
  <div class="flex-between h-24">
    <base-filter-input
      v-model="conditionParams.searchKey"
      @input-change="handleSearchByInput"
    />
    <base-filter-panel
      :section-list="filterBySystem.sectionList"
      :condition-text="filterBySystem.conditionText"
      @search="handleSearchBySystem"
    />
  </div>
  <div class="flex flex-1 flex-col justify-between">
    <el-table :data="pidLiveDataList" class="flex-1">
      <el-table-column type="selection" min-width="6%" />
      <el-table-column prop="pid" label="PID" min-width="13%" />
      <el-table-column prop="params" label="Parameter" min-width="42%" />
      <el-table-column prop="range" label="Range" min-width="20%" />
      <el-table-column prop="unit" label="Unit" min-width="14%" />
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
