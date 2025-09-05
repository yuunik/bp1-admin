<script setup>
import { ref, reactive } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'

import BasePagination from '@/components/BasePagination.vue'
import { getBrandModalListApi } from '@/apis/appApi.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import BaseFilterInput from '@/components/BaseFilterInput.vue'
import { TimingPreset } from '@/utils/constantsUtil.js'

// 响应式数据
const loading = ref(false)

// Brand Model 列表数据
const tableData = ref([])

// 分页数据
const pagination = reactive({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

// 排序参数
const sortParams = reactive({
  sort: '',
  sortBy: '',
})

// 条件搜索参数
const conditionSearchParams = reactive({
  searchText: '',
  status: '',
})

// 获取Brand Model 列表数据
const getBrandModelList = useDebounceFn(async () => {
  loading.value = true
  const { data, count } = await getBrandModalListApi({
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    searchKey: conditionSearchParams.searchText,
    status: conditionSearchParams.status,
    sort: sortParams.sort,
    sortBy: sortParams.sortBy,
  })
  // 更新分页数据
  pagination.total = count
  // 更新表格数据
  tableData.value = data
  loading.value = false
}, 500)

const router = useRouter()
// 查看详情
const viewVehicleDetail = (row, column) => {
  const { no } = column
  if (no === 0 || no === 5) {
    return
  }
  router.push({
    name: 'BrandAndModelManagement',
    params: { id: row.id },
  })
}

// 排序查询
const changeSortChange = (data) => {
  const { prop, order } = data
  if (order === 'ascending') {
    sortParams.sort = 'asc'
    sortParams.sortBy = prop
  } else if (order === 'descending') {
    sortParams.sort = 'desc'
    sortParams.sortBy = prop
  } else if (!order) {
    sortParams.sort = ''
    sortParams.sortBy = ''
  }
  getBrandModelList()
}

// 搜索
const handleSearchByInput = useDebounceFn(async () => {
  pagination.currentPage = 0
  const { data } = await getBrandModalListApi({
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    searchKey: conditionSearchParams.searchText,
    status: conditionSearchParams.status,
    sort: sortParams.sort,
    sortBy: sortParams.sortBy,
  })
  tableData.value = data
}, TimingPreset.DEBOUNCE)

// 网络请求
getBrandModelList()

// 监听currentPage, 刷新列表
watch(
  () => pagination.currentPage,
  () => getBrandModelList,
)
</script>

<template>
  <section class="flex h-full flex-col">
    <!-- Brand Model Header -->
    <div class="flex flex-col gap-16 px-32 pb-16">
      <!-- 标题栏 -->
      <div class="flex-between">
        <h3 class="heading-h2-20px-medium">Brand & Model</h3>
        <!-- 创建车辆按钮 -->
        <el-button
          type="primary"
          class="w-70 h-32"
          @click="$router.push('/app-configuration/brand-model/create')"
        >
          Create
        </el-button>
      </div>
      <!-- 搜索栏 -->
      <div class="flex-between h-24">
        <!-- 状态搜索 -->
        <el-dropdown :hide-on-click="false">
          <span
            class="border-1 neutrals-grey-3 flex cursor-pointer gap-5 rounded-full border-solid border-[#CACFD8] px-8 py-4"
          >
            Status
            <i class="icon-typesdropdown" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>Action 1</el-dropdown-item>
              <el-dropdown-item>Action 2</el-dropdown-item>
              <el-dropdown-item>Action 3</el-dropdown-item>
              <el-dropdown-item disabled>Action 4</el-dropdown-item>
              <el-dropdown-item divided>Action 5</el-dropdown-item>
              <el-dropdown-item divided>Action 6</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- 条件搜索 -->
        <base-filter-input
          v-model="conditionSearchParams.searchText"
          @input-change="handleSearchByInput"
        />
      </div>
    </div>
    <!-- 分割线 -->
    <el-divider />
    <!-- Brand Model 表格容器 -->
    <div class="pb-38 box-border flex min-h-0 flex-1 flex-col px-32 pt-8">
      <!-- Brand Model 表格 -->
      <el-table
        class="min-h-0 flex-1"
        :data="tableData"
        :loading="loading"
        @row-click="viewVehicleDetail"
        @sort-change="changeSortChange"
        row-class-name="clickable-row"
        :fit="false"
      >
        <!-- 勾选框 -->
        <el-table-column type="selection" min-width="6%" />
        <!-- 排序 -->
        <el-table-column
          prop="sort"
          label="Sort"
          sortable="custom"
          min-width="8%"
        />
        <!-- 品牌名称 -->
        <el-table-column
          prop="name"
          label="Brand"
          sortable="custom"
          min-width="43%"
        >
          <template #default="{ row }">
            <div class="flex items-center">
              <el-image
                v-if="row.logo"
                fit="cover"
                :src="getFullFilePath(row.logo)"
                class="mr-8 h-24 w-24"
                alt="brand icon"
              >
                <template #error>
                  <i class="i-ep:picture" />
                </template>
              </el-image>
              <el-text>{{ row.brand }}</el-text>
            </div>
          </template>
        </el-table-column>
        <!-- 车型数量: 月姐说了, 取vehicleModelDtos -->
        <el-table-column
          prop="modelCount"
          label="Model Count"
          sortable="custom"
          min-width="19%"
        >
          <template #default="{ row }">
            <span>{{ row.vehicleModelDtos?.length || 0 }}</span>
          </template>
        </el-table-column>
        <!-- 状态: 月姐说了, 取 isDelete , 0 代表激活, 1 代表禁用 -->
        <el-table-column
          prop="status"
          label="Status"
          sortable="custom"
          min-width="18%"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="row.isDelete === 0 ? 'success' : 'info'">
              {{ row.isDelete === 0 ? 'Active' : 'Disabled' }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column min-width="6%" align="center">
          <template #default>
            <div class="w-48 cursor-pointer">
              <i class="icon-more-2-line text-24" />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <base-pagination v-model="pagination" />
    </div>
  </section>
</template>

<style scoped lang="scss">
// 搜索框
.brand-model-search {
  // 输入框样式重置
  :deep(.el-input__wrapper) {
    box-shadow: none;
    background-color: transparent;
  }
}
:deep(.el-table) {
  background-color: rgb(252, 252, 252);
}

:deep(th) {
  background-color: rgb(252, 252, 252);
}

:deep(tr) {
  background-color: rgb(252, 252, 252);
}

:deep(.el-table__header) {
  @apply w-full!;
}

:deep(.el-table__body) {
  @apply w-full!;
}
</style>
