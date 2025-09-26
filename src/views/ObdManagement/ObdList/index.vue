<script setup>
/**
 * obd status === 10, 处于关闭状态
 * obd status === 0, 处于开启状态
 */

import { ref, reactive, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import BasePagination from '@/components/BasePagination.vue'
import { closeOBDApi, getOBDListApi, unbindOBDApi } from '@/apis/obdApi.js'
import {
  getLastUsedDate,
  getOneYearLaterDateWithDDMMMYYYYY,
} from '@/utils/dateUtil.js'
import { RouteName } from '@/utils/constantsUtil.js'
import { openOBDApi } from '@/apis/appApi.js'
import BaseTag from '@/components/BaseTag.vue'
import { useSort } from '@/composables/useSort.js'
import BaseFilterPanel from '@/components/BaseFilterPanel.vue'
import BaseFilterInput from '@/components/BaseFilterInput.vue'

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
  sortBy: '',
  sort: '',
})

// 筛选参数
const userKeys = computed(() =>
  conditionSearchParams.userList && conditionSearchParams.userList.length > 0
    ? conditionSearchParams.userList.join(',')
    : '',
)

const statusKeys = computed(() =>
  conditionSearchParams.statusList &&
  conditionSearchParams.statusList.length > 0
    ? conditionSearchParams.statusList.join(',')
    : '',
)

const conditionSearchParams = reactive({
  userList: [],
  statusList: [],
})

const filterByUser = reactive({
  conditionText: 'User',
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

const filterByStatus = reactive({
  conditionText: 'Status',
  sectionList: [
    {
      label: 'On',
      value: '0',
    },
    {
      label: 'Off',
      value: '10',
    },
  ],
})

// 是否有筛选条件
const hasCondition = computed(() => {
  return (
    conditionSearchParams.userList.length > 0 ||
    conditionSearchParams.statusList.length > 0
  )
})

// 获取OBD 列表数据
const getObdList = useDebounceFn(async () => {
  loading.value = true
  const { data, count } = await getOBDListApi({
    searchKey: searchText.value,
    userKey: userKeys.value,
    statusKey: statusKeys.value,
    sortKey: sortParams.sortBy,
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

// 操作栏解绑用户
const onUnbindUser = async (id) => {
  await unbindOBDApi(id)
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

// 开启OBD
const openOBD = async (obdId) => {
  await openOBDApi(obdId)
  // 提示
  ElMessage.success('Open success')
  // 刷新
  getObdList()
}

// 操作栏关闭 OBD
const onCloseOBD = async (id) => {
  await closeOBDApi(id)
  // 关闭成功
  ElMessage.success('Close success')
  // 刷新
  getObdList()
}

// 查看 OBD 详情
const viewOBDDetail = (row, column) => {
  const { no } = column
  if (no === 0 || no === 7) {
    return
  }
  router.push({ name: RouteName.OBD_DETAILS, params: { id: row.id } })
}

// 搜索
const handleSearch = useDebounceFn(async () => refresh(), 500)

// 排序
const handleSortByCondition = useSort(sortParams, () => {
  getObdList()
})

// 刷新
const refresh = () => {
  if (pagination.currentPage === 0) {
    return getObdList()
  }
  pagination.currentPage = 0
}

// 重置条件搜索
const handleResetAllCondition = () => {
  conditionSearchParams.userList = []
  conditionSearchParams.statusList = []
  // 刷新
  refresh()
}

// 监听currentPage, 刷新列表
watch(
  () => pagination.currentPage,
  () => getObdList(),
)

// 网络请求
getObdList()
</script>

<template>
  <section class="flex h-full flex-col">
    <!-- OBD List Header -->
    <div class="flex flex-col gap-16 px-32 pb-16">
      <!-- 标题 -->
      <h3 class="heading-h2-20px-medium">OBD List</h3>
      <div class="flex-between condition-search-container h-24">
        <div class="flex h-24 gap-8">
          <div class="flex h-24 gap-8">
            <!-- 状态搜索 -->
            <base-filter-panel
              v-model="conditionSearchParams.userList"
              :section-list="filterByUser.sectionList"
              :condition-text="filterByUser.conditionText"
              @search="refresh"
            />
            <base-filter-panel
              v-model="conditionSearchParams.statusList"
              :section-list="filterByStatus.sectionList"
              :condition-text="filterByStatus.conditionText"
              @search="refresh"
            />
          </div>
          <!-- 重置条件搜索 -->
          <el-button
            text
            type="primary"
            class="h-24!"
            @click="handleResetAllCondition"
            v-show="hasCondition"
          >
            Clear
          </el-button>
        </div>
        <!-- 输入搜索栏 -->
        <base-filter-input v-model="searchText" @input-change="handleSearch" />
      </div>
    </div>
    <!-- 分割线 -->
    <el-divider />
    <!-- OBD 表格容器 -->
    <div class="pb-38 box-border flex min-h-0 flex-1 flex-col px-32 pt-8">
      <!-- 选择框操作区 -->
      <div class="flex-between" v-show="selectedOBDIdList.length">
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
        @selection-change="handleSelectionChange"
        @row-click="viewOBDDetail"
        @sort-change="handleSortByCondition"
        row-class-name="clickable-row"
      >
        <!-- 勾选框 -->
        <el-table-column type="selection" min-width="6%" />
        <!-- 设备 SN 码 -->
        <el-table-column
          prop="sn"
          label="SN"
          sortable="custom"
          min-width="14%"
        />
        <!-- 设备状态 -->
        <el-table-column
          prop="status"
          label="Status"
          sortable="custom"
          min-width="14%"
        >
          <template #default="{ row }">
            <base-tag
              :color="row.status === 0 ? 'green' : 'gray'"
              :text="row.status === 0 ? 'On' : 'Off'"
            />
          </template>
        </el-table-column>
        <!-- 上次使用时间 -->
        <el-table-column
          prop="useTime"
          label="Last Used"
          sortable="custom"
          min-width="20%"
        >
          <template #default="{ row }">
            {{ getLastUsedDate(row.useTime) }}
          </template>
        </el-table-column>
        <!-- 保修期限 -->
        <el-table-column
          prop="warrantyTime"
          label="Warranty End"
          sortable="custom"
          min-width="20%"
        >
          <template #default="{ row }">
            {{ getOneYearLaterDateWithDDMMMYYYYY(row.warrantyTime) }}
          </template>
        </el-table-column>
        <!-- 绑定时间 -->
        <el-table-column
          prop="bindingTime"
          label="Bind Time"
          sortable="custom"
          min-width="20%"
        >
          <template #default="{ row }">
            {{ getLastUsedDate(row.bindingTime) }}
          </template>
        </el-table-column>
        <!-- 使用者 -->
        <el-table-column
          prop="user"
          label="User"
          sortable="custom"
          min-width="14%"
        >
          <template #default="{ row }">
            {{ row.userDto?.id === '' ? '-' : row.userDto?.name }}
          </template>
        </el-table-column>
        <!-- 详情 -->
        <el-table-column prop="remark" label="Remark" min-width="20%">
          <template #default="{ row }">
            {{ row.remark ? row.remark : '-' }}
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          align="center"
          prop="actions"
          class="table-action-container"
          min-width="6%"
        >
          <template #default="{ row }">
            <!-- 状态搜索 -->
            <el-dropdown trigger="click" placement="bottom-end">
              <i class="icon-more-2-line text-16" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    @click="onUnbindUser(row.id)"
                    v-if="row.userDto?.id"
                  >
                    Unbind User
                  </el-dropdown-item>
                  <!-- status 为 10 时, 为 关闭状态 -->
                  <el-dropdown-item
                    @click="onCloseOBD(row.id)"
                    v-if="row.status === 0"
                  >
                    Off OBD
                  </el-dropdown-item>
                  <!-- status 为 10 时, 为 关闭状态 -->
                  <el-dropdown-item
                    @click="openOBD(row.id)"
                    v-if="row.status === 10"
                  >
                    On OBD
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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

:deep(.el-tooltip__trigger:focus),
:deep(.el-tooltip__trigger:focus-visible) {
  outline: none;
}

:deep(.el-input) {
  margin: 0;
}
</style>
