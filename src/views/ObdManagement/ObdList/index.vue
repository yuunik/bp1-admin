<script setup>
import { ref, reactive } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import BasePagination from '@/components/BasePagination/index.vue'
import { closeOBDApi, getOBDListApi, unbindOBDApi } from '@/apis/obdApi.js'
import { getLastUsedDate, getWarrantyEndDate } from '@/utils/dateUtil.js'
import { RouteName, TimingPreset } from '@/utils/constantsUtil.js'

const router = useRouter()

// 响应式数据
const loading = ref(false)
// 搜索文本
const searchText = ref('')
// OBD 列表数据
const tableData = ref([])
// 选择的 OBD 列表
const selectedOBDIdList = ref([])

// 分页数据
const pagination = reactive({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

// 排序参数
const sortParams = reactive({
  sortKey: '',
  sort: '',
})

// 筛选参数
const userKeys = ref([])

// 获取OBD 列表数据
const getObdList = useDebounceFn(async () => {
  loading.value = true
  const { data, count } = await getOBDListApi({
    searchKey: searchText.value,
    userKey: userKeys.value.join(','),
    sortKey: sortParams.sortKey,
    sort: sortParams.sort,
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
  })
  // 更新分页数据
  pagination.total = count
  // 更新表格数据
  tableData.value = data
  loading.value = false
}, 500)

// 选项勾选变化
const handleSelectionChange = (val) =>
  (selectedOBDIdList.value = val.map((item) => item.id))

// 解绑用户
const handleUnbindUser = async () => {
  await unbindOBDApi(selectedOBDIdList.value.join(','))
  // 解绑成功
  ElMessage.success('Unbind success')
  // 刷新
  getObdList()
}

// 关闭 OBD
const handleCloseOBD = async () => {
  await closeOBDApi(selectedOBDIdList.value.join(','))
  // 关闭成功
  ElMessage.success('Close success')
  // 刷新
  getObdList()
}

// 查看 OBD 详情
const viewOBDDetail = (row, column) => {
  const { type } = column
  if (type === 'selection') {
    // 阻止默认选中行, 跳转查看详情
    return
  }
  router.push({ name: RouteName.OBD_DETAILS, params: { id: row.id } })
}

const handleSearch = useDebounceFn(async () => {
  if (pagination.currentPage === 0) {
    return getObdList()
  }
  pagination.currentPage = 0
}, 500)

const handleSortByCondition = useDebounceFn((data) => {
  const { prop, order } = data
  if (order) {
    sortParams.sortKey = prop === 'simpleUserDto?.name' ? 'user' : prop
    sortParams.sort = order === 'ascending' ? 'asc' : 'desc'
  } else {
    sortParams.sortKey = ''
    sortParams.sort = ''
  }
  getObdList()
}, TimingPreset.DEBOUNCE)

// 监听currentPage, 刷新列表
watch(
  () => pagination.currentPage,
  () => getObdList(),
)

// 监听 userKeys, 刷新列表
watch(
  () => userKeys.value,
  () => {
    pagination.currentPage = 0
    getObdList()
  },
)

// 网络请求
getObdList()
</script>

<template>
  <router-view v-if="$route.name === RouteName.CREATE_STOCK_ORDER" />
  <section class="flex h-full flex-col" v-else>
    <!-- OBD List Header -->
    <div class="px-32 pb-16">
      <!-- 标题栏 -->
      <div class="flex-between">
        <h3 class="heading-h2-20px-medium">OBD List</h3>
        <div>
          <el-button type="default" class="w-70 h-32">Export</el-button>
          <el-button
            type="primary"
            class="w-70 h-32"
            @click="$router.push({ name: RouteName.CREATE_STOCK_ORDER })"
          >
            Create
          </el-button>
        </div>
      </div>
      <div class="flex-between gap-12">
        <!-- 搜索栏 -->
        <el-input
          placeholder="Search..."
          class="obd-list-search mt-16"
          v-model="searchText"
          @input="handleSearch"
        >
          <template #prefix>
            <!-- 前置搜索图标 -->
            <i class="icon-typessearch h-16 w-16" />
          </template>
        </el-input>
        <!-- 状态搜索 -->
        <el-dropdown>
          <span
            class="border-1 neutrals-grey-3 flex cursor-pointer gap-5 rounded-full border-solid border-[#CACFD8] px-8 py-4"
          >
            Users
            <i class="icon-typesdropdown" />
          </span>
          <template #dropdown>
            <el-checkbox-group v-model="userKeys">
              <el-checkbox value="2">With User</el-checkbox>
              <el-checkbox value="1">Without User</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- 分割线 -->
    <el-divider />
    <!-- OBD 表格容器 -->
    <div class="pb-38 box-border flex min-h-0 flex-1 flex-col px-32 pt-8">
      <!-- 选择框操作区 -->
      <div class="flex-between flex" v-show="selectedOBDIdList.length">
        <span class="text-neutrals-off-black heading-body-body-12px-regular">
          {{ selectedOBDIdList.length }} selected
        </span>
        <div>
          <el-button @click="handleUnbindUser">Unbind User</el-button>
          <el-button class="ml-8" @click="handleCloseOBD">Off OBD</el-button>
        </div>
      </div>
      <!-- OBD 表格 -->
      <el-table
        :data="tableData"
        class="obd-table flex-1"
        :fit="false"
        @selection-change="handleSelectionChange"
        @row-click="viewOBDDetail"
        @sort-change="handleSortByCondition"
        row-class-name="clickable-row"
      >
        <!-- 勾选框 -->
        <el-table-column type="selection" />
        <!-- 设备 SN 码 -->
        <el-table-column prop="sn" label="SN" sortable="custom" />
        <!-- 上次使用时间 -->
        <el-table-column prop="useTime" label="Last Used" sortable="custom">
          <template #default="{ row }">
            {{ getLastUsedDate(row.useTime) }}
          </template>
        </el-table-column>
        <!-- 保修期限 -->
        <el-table-column
          prop="warrantyTime"
          label="Warranty End"
          sortable="custom"
        >
          <template #default="{ row }">
            {{ getWarrantyEndDate(row.warrantyTime) }}
          </template>
        </el-table-column>
        <!-- 绑定时间 -->
        <el-table-column prop="bindingTime" label="Bind Time" sortable="custom">
          <template #default="{ row }">
            {{ getLastUsedDate(row.bindingTime) }}
          </template>
        </el-table-column>
        <!-- 使用者 -->
        <el-table-column
          prop="simpleUserDto?.name"
          label="User"
          sortable="custom"
        >
          <template #default="{ row }">
            {{ row.userDto?.name === '' ? '-' : row.userDto?.name }}
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
      <base-pagination v-model="pagination" />
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

.obd-details {
  @apply cursor-pointer!;
}
</style>
