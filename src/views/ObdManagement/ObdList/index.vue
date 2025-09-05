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
const userKeys = ref([])

// 获取OBD 列表数据
const getObdList = useDebounceFn(async () => {
  loading.value = true
  const { data, count } = await getOBDListApi({
    searchKey: searchText.value,
    userKey: conditionSearchParams.user,
    statusKey: conditionSearchParams.status,
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
  getOBDInfo(obdId)
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
  const { type, property } = column
  if (type === 'selection') {
    // 阻止默认选中行, 跳转查看详情
    return
  } else if (property === 'actions') {
    return
  }
  router.push({ name: RouteName.OBD_DETAILS, params: { id: row.id } })
}

// 搜索
const handleSearch = useDebounceFn(async () => {
  if (pagination.currentPage === 0) {
    return getObdList()
  }
  pagination.currentPage = 0
}, 500)

// 排序
const handleSortByCondition = useSort(sortParams, () => {
  getObdList()
})

const isInputBlur = ref(false)

const conditionSearchParams = reactive({
  user: '',
  status: '',
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

// 监听currentPage, 刷新列表
watch(
  () => pagination.currentPage,
  () => getObdList(),
)

// 监听 userKeys, 刷新列表
watch(
  () => userKeys.value,
  () => {
    if (pagination.currentPage === 0) {
      return getObdList()
    }
    getObdList()
  },
)

const handleInputBlur = () => {
  console.log('handleInputBlur')
  isInputBlur.value = true
}

const handleInputFocus = () => {
  console.log('handleInputFocus')
  isInputBlur.value = false
}

const handleSearchByUser = (val) => {
  conditionSearchParams.user = val
  refresh()
}

const handleSearchByStatus = (val) => {
  conditionSearchParams.status = val
  refresh()
}

const refresh = () => {
  if (pagination.currentPage === 0) {
    return getObdList()
  }
  pagination.currentPage = 0
}

// 计算显示的用户条件文本
const userConditionText = computed(() => {
  const conditions = []

  // 检查是否选择了 With User
  if (userKeys.value.includes('2')) {
    conditions.push('With Users')
  }

  // 检查是否选择了 Without User
  if (userKeys.value.includes('1')) {
    conditions.push('Without User')
  }

  if (conditions.length > 0) {
    return `Users: ${conditions.join(', ')}`
  }

  return 'User'
})

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
          <!-- 状态搜索 -->
          <base-filter-panel
            :section-list="filterByUser.sectionList"
            :condition-text="filterByUser.conditionText"
            @search="handleSearchByUser"
          />
          <base-filter-panel
            :section-list="filterByStatus.sectionList"
            :condition-text="filterByStatus.conditionText"
            @search="handleSearchByStatus"
          />
        </div>
        <!-- 搜索栏 -->
        <el-input
          placeholder="Search..."
          class="obd-list-search w-200! mt-16"
          v-model="searchText"
          @input="handleSearch"
          @blur="handleInputBlur"
          @focus="handleInputFocus"
        >
          <template #prefix>
            <!-- 前置搜索图标 -->
            <i class="icon-mail-send-line-1 text-24" />
          </template>
        </el-input>
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
          prop="simpleUserDto?.name"
          label="User"
          sortable="custom"
          min-width="14%"
        >
          <template #default="{ row }">
            {{ row.userDto?.id === '' ? '-' : row.userDto?.name }}
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
            <el-dropdown trigger="click" class="test">
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

.condition-search-container :deep(.search-input .el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

.condition-search-container :deep(.search-input .el-input__wrapper::after) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--el-input-border-color, var(--el-border-color));
  pointer-events: none;
}
</style>
