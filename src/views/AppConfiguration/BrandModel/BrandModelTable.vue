<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'

import BasePagination from '@/components/BasePagination/index.vue'
import { getBrandModalListApi } from '@/apis/appApi.js'
import { getFullPath } from '@/utils/dataFormattedUtil.js'

// 响应式数据
const loading = ref(false)
// 搜索文本
const searchText = ref('')
// Brand Model 列表数据
const tableData = reactive([])

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 15,
  total: 0,
})

// 获取Brand Model 列表数据
const getBrandModelList = useDebounceFn(async () => {
  loading.value = true
  const { code, data, msg, count } = await getBrandModalListApi({
    searchKey: searchText.value,
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
  })
  if (code === 0) {
    // 提示成功信息
    ElMessage.success('Get Brand Model List Success')
    // 更新分页数据
    pagination.total = count
    // 更新表格数据
    Object.assign(tableData, data)
  } else {
    ElMessage.error(msg)
  }
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
  <section class="brand-model-container">
    <!-- Brand Model Header -->
    <div class="px-32 pb-16">
      <!-- 标题栏 -->
      <div class="flex-between">
        <h3 class="heading-h2-20px-medium">Brand & Model</h3>
        <!-- 创建车辆按钮 -->
        <el-button
          type="primary"
          class="w-70 h-32"
          @click="$router.push('/app-configuration/brand-Model/create')"
        >
          Create
        </el-button>
      </div>
      <!-- 搜索栏 -->
      <div class="flex flex-between">
        <!-- 条件搜索 -->
        <el-input
          placeholder="Search..."
          class="mt-16 brand-model-search"
          v-model="searchText"
          @input="getBrandModelList"
        >
          <template #prefix>
            <!-- 前置搜索图标 -->
            <i class="icon-typessearch w-16 h-16" />
          </template>
        </el-input>
        <!-- 状态搜索 -->
        <el-dropdown :hide-on-click="false">
          <span
            class="rounded-full flex gap-5 border-1 border-[#CACFD8] border-solid px-8 py-4 neutrals-grey-3 cursor-pointer"
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
    <div class="table-container">
      <!-- Brand Model 表格 -->
      <el-table
        class="brand-model-table"
        :data="tableData"
        height="100%"
        :loading="loading"
        @row-click="viewVehicleDetail"
        row-class-name="clickable-row"
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
                :src="getFullPath(row.logo)"
                class="w-24 h-24 mr-8"
                alt="brand icon"
              >
                <template #error>
                  <i class="i-ep-picture" />
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
            <span>{{ row?.vehicleModelDtos?.length || 0 }}</span>
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
.brand-model-container {
  width: 100%;
  height: 100%;
  // 使用视口高度
  display: flex;
  flex-direction: column;

  // 搜索框
  .brand-model-search {
    // 输入框样式重置
    :deep(.el-input__wrapper) {
      box-shadow: none;
      background-color: transparent;
    }
  }

  // 表格容器
  .table-container {
    padding: 8px 32px 38px;
    flex: 1;
    min-height: 0; // 确保 flex 子项可以收缩
    display: flex;
    flex-direction: column;

    :deep(.el-table) {
      background-color: rgb(252, 252, 252);
    }

    :deep(th) {
      background-color: rgb(252, 252, 252);
    }

    :deep(tr) {
      background-color: rgb(252, 252, 252);
    }
  }
}
</style>
