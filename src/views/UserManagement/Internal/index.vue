<script setup>
import { useRouter } from 'vue-router'

import { getAdminListApi } from '@/apis/userCenterApi.js'
import BasePagination from '@/components/BasePagination.vue'
import BaseFilterPanel from '@/components/BaseFilterPanel.vue'
import BaseFilterInput from '@/components/BaseFilterInput.vue'
import { useDebounceFn } from '@vueuse/core'
import { getForumListApi } from '@/apis/forumApi.js'
import { TimingPreset } from '@/utils/constantsUtil.js'
import { useSort } from '@/composables/useSort.js'

const router = useRouter()

// 查看详情
const onRowClick = (_, column) => {
  const { no } = column
  if (no === 0 || no === 5) {
    return
  }
  router.push({ name: 'Internal Manage', params: { id: '12432314231' } })
}

// 账号状态筛选
const statusFilterParams = [
  {
    label: 'Disabled',
    value: '0',
  },
  {
    label: 'Active',
    value: '1',
  },
]

// 角色筛选
const roleFilterParams = [
  {
    label: 'Admin',
    value: 'Admin',
  },
  {
    label: 'Support',
    value: 'Support',
  },
  {
    label: 'User',
    value: 'User',
  },
]

// 管理员列表
const internalDataList = ref([])

// 分页参数
const pageQueryParams = reactive({
  currentPage: 0,
  total: 0,
  pageSize: 15,
})

// 条件查询参数
const conditionSearchParams = reactive({
  searchKey: '',
  status: '',
  role: '',
  sort: '',
})

// 排序查询
const sortParams = reactive({
  sort: '',
  sortBy: '',
})

// 获取管理员列表
const getAdminList = async () => {
  const { data } = await getAdminListApi({
    searchKey: conditionSearchParams.searchKey,
    status: conditionSearchParams.status,
    role: conditionSearchParams.role,
    page: pageQueryParams.currentPage,
    pageSize: pageQueryParams.pageSize,
    sort: sortParams.sort,
    sortBy: sortParams.sortBy,
  })
  internalDataList.value = data
}

// 排序功能函数
const sort = useSort(sortParams, () => getAdminList())

// 账号状态筛选
const handleSearchByStatus = (val) => {
  conditionSearchParams.status = val
  refresh()
}

// 账号角色筛选
const handleSearchByRole = (val) => {
  conditionSearchParams.role = val
  refresh()
}

// 网络请求
getAdminList()

// 刷新页面
const refresh = () => {
  if (!pageQueryParams.currentPage) {
    return getAdminList()
  }
  getAdminList()
}

// 条件搜索
const handleSearchByInput = useDebounceFn(async () => {
  pageQueryParams.currentPage = 0
  const { data } = await getAdminListApi({
    searchKey: conditionSearchParams.searchKey,
    status: conditionSearchParams.status,
    role: conditionSearchParams.role,
    page: pageQueryParams.currentPage,
    pageSize: pageQueryParams.pageSize,
    sort: sortParams.sort,
    sortBy: sortParams.sortBy,
  })
  internalDataList.value = data
}, TimingPreset.DEBOUNCE)

// 监听当前页的变化
watch(
  () => pageQueryParams.currentPage,
  () => getAdminList(),
)
</script>

<template>
  <router-view v-if="$route.name === 'Internal Manage'" />
  <router-view v-else-if="$route.name === 'Create Internal User'" />
  <section class="flex flex-col gap-16" v-else>
    <!-- Header -->
    <div class="flex-between mx-32 h-32">
      <h3>Internal</h3>
      <el-button
        type="primary"
        @click="$router.push({ name: 'Create Internal User' })"
      >
        Create
      </el-button>
    </div>
    <!-- Search -->
    <div class="flex-between mx-32 flex h-24 gap-20">
      <!-- 筛选查询 -->
      <div class="flex gap-8">
        <!-- 账号状态筛选 -->
        <base-filter-panel
          :section-list="statusFilterParams"
          condition-text="Status"
          @search="handleSearchByStatus"
        />
        <!-- 账号角色筛选 -->
        <base-filter-panel
          :section-list="roleFilterParams"
          condition-text="Role"
          @search="handleSearchByRole"
        />
      </div>
      <!-- 条件搜索 -->
      <base-filter-input
        v-model="conditionSearchParams.searchKey"
        @input-change="handleSearchByInput"
      />
    </div>
    <!-- Divider -->
    <el-divider />
    <!-- Table -->
    <div class="mx-32 flex flex-1 flex-col overflow-auto pb-32">
      <el-table
        :data="internalDataList"
        @row-click="onRowClick"
        row-class-name="clickable-row"
        class="flex-1"
        @sort-change="sort"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="Name" prop="name" sortable="custom" />
        <el-table-column label="Status" prop="state">
          <template #default="{ row }">
            <!-- state 为 0, 为 Disabled, state 为 1 , 则 Active -->
            <el-tag :type="row.state ? 'success' : 'danger'">
              {{ row.state ? 'Active' : 'Disabled' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Email" prop="email" sortable="custom" />
        <el-table-column label="Role" prop="role" />
        <!-- 操作 -->
        <el-table-column align="center" prop="actions" width="100">
          <template #default="{ row }">
            <!-- 状态搜索 -->
            <el-dropdown popper-class="custom-dropdown">
              <i class="icon-more-2-line" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>Edit</el-dropdown-item>
                  <el-dropdown-item>Reset Password</el-dropdown-item>
                  <el-dropdown-item>Enable</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination v-model="pageQueryParams" />
    </div>
  </section>
</template>

<style scoped lang="scss">
// 输入框样式重置
.internal-list-search {
  :deep(.el-input__wrapper) {
    box-shadow: none;
    background-color: transparent;
  }
}
</style>
