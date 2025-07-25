<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const loading = ref(false)
const searchText = ref('')
const selectedRows = ref([])

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 16
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    model: 'PD-1',
    sn: 'A000001',
    lastUsed: '03 Apr 2026 (10 days ago)',
    warrantyEnd: '03 Apr 2026',
    user: 'Ralph Edwards'
  },
  {
    id: 2,
    model: 'PD-1',
    sn: 'A000002',
    lastUsed: '03 Apr 2026 (10 days ago)',
    warrantyEnd: '03 Apr 2026',
    user: 'Kristin Watson'
  },
  {
    id: 3,
    model: 'PD-1',
    sn: 'A000003',
    lastUsed: '03 Apr 2026 (10 days ago)',
    warrantyEnd: '03 Apr 2026',
    user: 'Guy Hawkins'
  },
  {
    id: 4,
    model: 'PD-1',
    sn: 'A000004',
    lastUsed: '03 Apr 2026 (10 days ago)',
    warrantyEnd: '03 Apr 2026',
    user: 'Bessie Cooper'
  },
  {
    id: 5,
    model: 'PD-1',
    sn: 'A000005',
    lastUsed: '03 Apr 2026 (10 days ago)',
    warrantyEnd: '03 Apr 2026',
    user: 'Brooklyn Simmons'
  },
  {
    id: 6,
    model: 'PD-1',
    sn: 'A000006',
    lastUsed: '03 Apr 2026 (10 days ago)',
    warrantyEnd: '03 Apr 2026',
    user: 'Theresa Webb'
  },
  {
    id: 7,
    model: 'PD-1',
    sn: 'A000007',
    lastUsed: '03 Apr 2026 (10 days ago)',
    warrantyEnd: '03 Apr 2026',
    user: 'Cameron Williamson'
  },
  {
    id: 8,
    model: 'PD-1',
    sn: 'A000008',
    lastUsed: '03 Apr 2026 (10 days ago)',
    warrantyEnd: '03 Apr 2026',
    user: 'Jenny Wilson'
  },
  {
    id: 9,
    model: 'PD-1',
    sn: 'A000009',
    lastUsed: '03 Apr 2026 (10 days ago)',
    warrantyEnd: '03 Apr 2026',
    user: 'Courtney Henry'
  },
  {
    id: 10,
    model: 'PD-1',
    sn: 'A000010',
    lastUsed: '03 Apr 2026 (10 days ago)',
    warrantyEnd: '03 Apr 2026',
    user: 'Esther Howard'
  }
])

// 方法
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

const handleSearch = () => {
  // 搜索逻辑
  console.log('搜索:', searchText.value)
}

const handleExport = () => {
  ElMessage.success('导出功能开发中...')
}

const handleCreate = () => {
  ElMessage.success('创建功能开发中...')
}

const handlePageChange = (page) => {
  pagination.currentPage = page
  // 加载数据逻辑
}

const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  // 加载数据逻辑
}

onMounted(() => {
  // 初始化数据
})
</script>

<template>
  <div class="obd-list-container p-6">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">" class="mb-4">
      <el-breadcrumb-item>
        <el-icon class="mr-1">
          <ArrowRight />
        </el-icon>
        OBD Management
      </el-breadcrumb-item>
      <el-breadcrumb-item>OBD List</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 页面头部 -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <h1 class="text-2xl font-semibold text-gray-900 mr-3">OBD List</h1>
        <el-badge :value="selectedRows.length" class="item" v-if="selectedRows.length > 0">
          <div class="w-6 h-6"></div>
        </el-badge>
      </div>
      <div class="flex gap-3">
        <el-button @click="handleExport">Export</el-button>
        <el-button type="primary" @click="handleCreate">Create</el-button>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="mb-6">
      <el-input v-model="searchText" placeholder="Search..." class="w-80" clearable @keyup.enter="handleSearch">
        <template #prefix>
          <el-icon class="el-input__icon">
            <Search />
          </el-icon>
        </template>
      </el-input>
    </div>

    <!-- 数据表格 -->
    <div class="bg-white rounded-lg shadow">
      <el-table :data="tableData" v-loading="loading" @selection-change="handleSelectionChange" class="w-full"
        header-row-class-name="bg-gray-50">
        <el-table-column type="selection" width="55" />

        <el-table-column prop="model" label="Model" min-width="100">
          <template #default="{ row }">
            <span class="font-medium text-gray-900">{{ row.model }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="sn" label="SN" min-width="120">
          <template #default="{ row }">
            <span class="text-gray-700">{{ row.sn }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="lastUsed" label="Last Used" min-width="180" sortable>
          <template #default="{ row }">
            <span class="text-gray-600">{{ row.lastUsed }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="warrantyEnd" label="Warranty End" min-width="140" sortable>
          <template #default="{ row }">
            <span class="text-gray-600">{{ row.warrantyEnd }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="user" label="User" min-width="150">
          <template #default="{ row }">
            <span class="text-gray-700">{{ row.user }}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="flex justify-between items-center p-4 border-t border-gray-200">
        <div class="text-sm text-gray-500">
          {{ (pagination.currentPage - 1) * pagination.pageSize + 1 }} of {{ pagination.total }} pages
        </div>
        <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]" :total="pagination.total" layout="sizes, prev, pager, next"
          @size-change="handleSizeChange" @current-change="handlePageChange" class="justify-end" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.obd-list-container {
  min-height: 100vh;
  background-color: #f8fafc;
}

.el-table {
  border-radius: 8px;
}

.el-table :deep(.el-table__header-wrapper) {
  border-radius: 8px 8px 0 0;
}

.el-table :deep(.el-table__header th) {
  background-color: #f8fafc;
  color: #374151;
  font-weight: 500;
  border-bottom: 1px solid #e5e7eb;
}

.el-table :deep(.el-table__row:hover > td) {
  background-color: #f9fafb;
}

.el-pagination :deep(.el-pagination__sizes) {
  margin-right: 16px;
}

.el-breadcrumb :deep(.el-breadcrumb__inner) {
  color: #6b7280;
}

.el-breadcrumb :deep(.el-breadcrumb__inner:hover) {
  color: #3b82f6;
}
</style>