<script setup>
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

import { deleteAppVersionApi, getAppVersionListApi } from '@/apis/appApi.js'
import BasePagination from '@/components/BasePagination.vue'
import { getFormattedPublishTime } from '@/utils/dateUtil.js'
import { RouteName, TimingPreset } from '@/utils/constantsUtil.js'
import BaseDialog from '@/components/BaseDialog.vue'
import BaseFilterPanel from '@/components/BaseFilterPanel.vue'
import BaseFilterInput from '@/components/BaseFilterInput.vue'
import { computed, ref } from 'vue'

const searchKey = ref('')

const handleSearch = () => {}

// 分页查询条件
const pagination = reactive({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

// 版本数据列表
const appVersionList = ref([])

// 搜索的版本平台
const searchType = ref('')

const router = useRouter()

// 删除弹窗
const dialogConfirmDeleteVisible = ref(false)

// 删除提示信息
const deleteContent = ref('')

// 所选中的版本信息
const selectedRow = ref({})

const platformList = ref([])

const platformKeys = computed(() =>
  platformList.value.length > 0 ? platformList.value.join(',') : '',
)

const platformFilterParams = ref([
  {
    label: 'iOS',
    value: 'iOS',
  },
  {
    label: 'Android',
    value: 'Android',
  },
])

// 获取版本列表
const getAppVersionList = useDebounceFn(async () => {
  const { data, count } = await getAppVersionListApi({
    searchKey: searchKey.value,
    types: platformKeys.value,
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
  })
  appVersionList.value = data.map((item) => ({ ...item, isHover: false }))
  // 更新分页数据
  pagination.total = count
}, TimingPreset.DEBOUNCE)

// 刷新页面
const refresh = () => {
  if (pagination.currentPage === 0) {
    return getAppVersionList()
  }
  pagination.currentPage = 0
}

// 搜索平台切换
const handlePlatformChange = (command) => {
  searchType.value = command
  // 修改当前页
  if (pagination.currentPage === 0) {
    return getAppVersionList()
  }
  pagination.currentPage = 0
}

// 查看版本详情
const viewVersionDetail = (row, column) => {
  const { no } = column
  if (no === 0 || no === 6) {
    return
  }
  router.push({ name: RouteName.MANAGE_VERSION, params: { id: row.id } })
}

// 移除搜索平台
const removeSearchPlatform = () => {
  searchType.value = ''
  // 刷新页面
  refresh()
}

// 当单元格 hover 进入时会触发该事件
const handleCellMouseEnter = (row) => (row.isHover = true)

// 当单元格 hover 离开时会触发该事件
const handleCellMouseLeave = (row) => (row.isHover = false)

// 打开删除确认弹窗
const openConfirmDeleteDialog = (row) => {
  selectedRow.value = row
  // 记录删除信息
  deleteContent.value = `Are you sure you want to delete the ${selectedRow.value.type} ${selectedRow.value.version} version? Once deleted, it cannot be recovered.`
  dialogConfirmDeleteVisible.value = true
}

// 删除版本信息
const handleDeleteVersionControl = async () => {
  await deleteAppVersionApi(selectedRow.value.id)
  // 提示
  ElMessage.success('Delete successfully')
  dialogConfirmDeleteVisible.value = false
  refresh()
}

// 监听 pagination.currentPage, 自动发起查询
watch(
  () => pagination.currentPage,
  () => getAppVersionList,
)

// 组件创建时, 发起网络请求
getAppVersionList()
</script>

<template>
  <section class="flex h-full flex-col gap-16 overflow-auto">
    <!-- header -->
    <div class="flex-between mx-32 h-32">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        Version Control
      </h3>
      <el-button
        type="primary"
        @click="$router.push({ name: RouteName.VERSION_CONTROL_CREATE })"
      >
        New Config
      </el-button>
    </div>
    <!-- 搜索栏 -->
    <div class="flex-between mx-32 h-24">
      <div class="row-center h-24 gap-8">
        <!-- 账号状态筛选 -->
        <base-filter-panel
          v-model="platformList"
          :section-list="platformFilterParams"
          condition-text="Platform"
          @search="refresh"
        />
        <!-- 清除按钮 -->
        <el-button
          text
          class="h-24! text-status-colours-blue!"
          @click="platformList = []"
          v-show="platformList.length"
        >
          Clear
        </el-button>
      </div>
      <!-- 输入搜索 -->
      <base-filter-input v-model="searchKey" @inputChange="refresh" />
    </div>
    <!-- divider -->
    <el-divider />
    <!-- list -->
    <div class="pb-38 mx-32 flex flex-1 flex-col">
      <el-table
        :data="appVersionList"
        class="flex-1"
        row-class-name="clickable-row"
        @row-click="viewVersionDetail"
        @cell-mouse-enter="handleCellMouseEnter"
        @cell-mouse-leave="handleCellMouseLeave"
      >
        <el-table-column type="selection" min-width="6%" />
        <el-table-column prop="type" label="Platform" min-width="15%" />
        <el-table-column prop="version" label="Version" min-width="15%" />
        <el-table-column label="Status" min-width="15%">
          <template #default="{ row }">
            <el-text v-if="row.state === 0">No prompt</el-text>
            <el-text v-else-if="row.state === 1">Prompt to update</el-text>
            <el-text v-else-if="row.state === 2">Force update</el-text>
            <el-text v-else-if="row.state === 3">Under review</el-text>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="Content" min-width="30%" />
        <el-table-column label="Create Date" min-width="15%">
          <template #default="{ row }">
            {{ getFormattedPublishTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column min-width="4%">
          <template #default="{ row }">
            <el-icon
              v-show="row.isHover"
              class="default-transition h-16 w-16"
              @click="openConfirmDeleteDialog(row)"
            >
              <delete />
            </el-icon>
          </template>
        </el-table-column>
      </el-table>
      <!-- pagination -->
      <base-pagination v-model="pagination" />
    </div>
  </section>
  <!-- 删除确认弹窗 -->
  <base-dialog
    v-model="dialogConfirmDeleteVisible"
    title="Delete version ?"
    button-type="danger"
    @cancel="dialogConfirmDeleteVisible = false"
    @confirm="handleDeleteVersionControl"
  >
    <template #content>
      <p class="heading-body-body-12px-medium text-neutrals-grey-3">
        {{ deleteContent }}
      </p>
    </template>
  </base-dialog>
</template>

<style scoped lang="scss">
// 搜索框
.version-control-list-search {
  // 输入框样式重置
  :deep(.el-input__wrapper) {
    box-shadow: none;
    background-color: transparent;
    padding-left: 0;
  }

  // 重置文本框样式
  :deep(.el-textarea__inner) {
    background-color: $neutrals-off-white;
  }

  // 重置下拉框样式
  :deep(.el-select__wrapper) {
    background-color: $neutrals-off-white;
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
  }

  :deep(.el-select__wrapper::after) {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background-color: var(--el-input-border-color, var(--el-border-color));
    pointer-events: none;
  }
}
</style>
