<script setup>
import { ref, reactive } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'

import BasePagination from '@/components/BasePagination/index.vue'
import { getBrandModalListApi } from '@/apis/appApi.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'

// 响应式数据
const loading = ref(false)
// 搜索文本
const searchText = ref('')
// Brand Model 列表数据
const tableData = reactive([])

// 分页数据
const pagination = reactive({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

// 获取Brand Model 列表数据
const getBrandModelList = useDebounceFn(async () => {
  loading.value = true
  const { data, count } = await getBrandModalListApi({
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

const router = useRouter()
// 查看详情
const viewVehicleDetail = (row) =>
  router.push({
    name: 'BrandAndModelManagement',
    params: { id: row.id },
  })

// 网络请求
getBrandModelList()
</script>

<template>
  <section class="flex h-full flex-col">
    <!-- Brand Model Header -->
    <div class="px-32 pb-16">
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
      <div class="flex-between flex">
        <!-- 条件搜索 -->
        <el-input
          placeholder="Search..."
          class="brand-model-search mt-16"
          v-model="searchText"
          @input="getBrandModelList"
        >
          <template #prefix>
            <!-- 前置搜索图标 -->
            <i class="icon-typessearch h-16 w-16" />
          </template>
        </el-input>
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
        row-class-name="clickable-row"
        :fit="false"
      >
        <!-- 勾选框 -->
        <el-table-column type="selection" min-width="6%" />
        <!-- 排序 -->
        <el-table-column
          prop="sort"
          label="Sort"
          :sortable="true"
          min-width="8%"
        />
        <!-- 品牌名称 -->
        <el-table-column label="Brand" :sortable="true" min-width="43%">
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
          :sortable="true"
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
          :sortable="true"
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
            <i class="icon-more-2-line cursor-pointer" />
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <base-pagination
        :pagination="pagination"
        :handle-page-change="getBrandModelList"
      />
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
