<script setup>
import { ref, reactive } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import BasePagination from '@/components/BasePagination/index.vue'
import { getOBDListApi } from '@/apis/obdApi.js'
import { getLastUsedDate, getWarrantyEndDate } from '@/utils/dateUtil.js'

// 响应式数据
const loading = ref(false)
// 搜索文本
const searchText = ref('')
// OBD 列表数据
const tableData = reactive([])

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 15,
  total: 0,
})

// 获取OBD 列表数据
const getObdList = useDebounceFn(async () => {
  loading.value = true
  const { data, count } = await getOBDListApi({
    searchKey: searchText.value,
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
  })
  // 更新分页数据
  pagination.total = count
  // 更新表格数据
  Object.assign(tableData, data)
  loading.value = false
}, 500)

// 网络请求
getObdList()
</script>

<template>
  <section class="flex h-full flex-col">
    <!-- OBD List Header -->
    <div class="px-32 pb-16">
      <!-- 标题栏 -->
      <div class="flex-between">
        <h3 class="heading-h2-20px-medium">OBD List</h3>
        <div>
          <el-button type="default" class="w-70 h-32">Export</el-button>
          <el-button type="primary" class="w-70 h-32">Create</el-button>
        </div>
      </div>
      <!-- 搜索栏 -->
      <el-input
        placeholder="Search..."
        class="obd-list-search mt-16"
        v-model="searchText"
        @input="getObdList"
      >
        <template #prefix>
          <!-- 前置搜索图标 -->
          <i class="icon-typessearch h-16 w-16" />
        </template>
      </el-input>
    </div>
    <!-- 分割线 -->
    <el-divider />
    <!-- OBD 表格容器 -->
    <div class="pb-38 box-border flex min-h-0 flex-1 flex-col px-32 pt-8">
      <!-- OBD 表格 -->
      <el-table :data="tableData" class="flex-1" :fit="false">
        <!-- 勾选框 -->
        <el-table-column type="selection" />
        <!-- 设备 SN 码 -->
        <el-table-column prop="sn" label="SN" :sortable="true" />
        <!-- 上次使用时间 -->
        <el-table-column prop="updateTime" label="Last Used" :sortable="true">
          <template #default="{ row }">
            {{ getLastUsedDate(row.updateTime) }}
          </template>
        </el-table-column>
        <!-- 保修期限 -->
        <el-table-column
          prop="createTime"
          label="Warranty End"
          :sortable="true"
        >
          <template #default="{ row }">
            {{ getWarrantyEndDate(row.createTime) }}
          </template>
        </el-table-column>
        <!-- 使用者 -->
        <el-table-column prop="simpleUserDto?.name" label="User">
          <template #default="{ row }">
            {{ row.userDto?.name === '' ? 'Unnamed User' : row.userDto?.name }}
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column align="center">
          <template #default>
            <i class="icon-more-2-line" />
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <base-pagination
        :pagination="pagination"
        :handle-page-change="getObdList"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
// 输入框样式重置
.obd-list-search {
  :deep(.el-input__wrapper) {
    box-shadow: none;
    background-color: transparent;
  }
}

:deep(.el-table__header) {
  @apply w-full!;
}

:deep(.el-table__body) {
  @apply w-full!;
}
</style>
