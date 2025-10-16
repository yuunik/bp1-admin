<script setup>
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import BasePagination from '@/components/BasePagination.vue'
import BaseFilterInput from '@/components/BaseFilterInput.vue'
import { RouteName } from '@/utils/constantsUtil.js'
import { useSort } from '@/composables/useSort.js'
import { deleteDtcRecordApi, getVehicleScanRecordsApi } from '@/apis/obdApi.js'
import { getDateWithDDMMMYYYYhhmma } from '@/utils/dateUtil.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import ErrorImage from '@/assets/images/error-img.png'
import { Delete } from '@element-plus/icons-vue'
import BaseDialog from '@/components/BaseDialog.vue'

const router = useRouter()

// 查看详情
const onRowClick = (row, column) => {
  const { no } = column
  if (no === 0 || no === 5) {
    return
  }
  router.push({ name: RouteName.DTC_DETAILS, params: { id: row.id } })
}

// 条件查询参数
const searchKey = ref('')

const sortParams = reactive({
  sort: '',
  sortBy: '',
})

// 分页数据
const pagination = reactive({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

// dtc 列表
const dtcList = ref([])

// 删除弹窗
const dialogConfirmDeleteVisible = ref(false)

// 所选中的dtc信息
const selectedRow = ref({})

// 勾选的dtc item list
const selectedDTCIdList = ref([])

// 排序功能函数
const sort = useSort(sortParams, () => getDtcList())

// 刷新页面
const refresh = () => {
  if (!pagination.currentPage) {
    return getDtcList()
  }
  pagination.currentPage === 0
}

// 条件搜索
const handleSearchByInput = () => refresh()

// 获取 dtc 列表
const getDtcList = async () => {
  const { data, count } = await getVehicleScanRecordsApi({
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    sort: sortParams.sort,
    sortKey: sortParams.sortBy,
    searchKey: searchKey.value,
  })
  // 获取数据
  dtcList.value = data.map((item) => ({ ...item, isHover: false }))
  // 设置总页数
  pagination.total = count
}

// 当单元格 hover 进入时会触发该事件
const handleCellMouseEnter = (row) => (row.isHover = true)

// 当单元格 hover 离开时会触发该事件
const handleCellMouseLeave = (row) => (row.isHover = false)

// 删除DTC
const handleDeleteDTC = async () => {
  await deleteDtcRecordApi(
    selectedRow.value.id ?? selectedDTCIdList.value.join(','),
  )
  // 提示
  ElMessage.success('Delete successfully')
  dialogConfirmDeleteVisible.value = false
  refresh()
}

// 打开删除确认弹窗
const openConfirmDeleteDialog = (row) => {
  selectedRow.value = row
  dialogConfirmDeleteVisible.value = true
}

// 勾选框勾选
const handleSelectionChange = (val) =>
  (selectedDTCIdList.value = val.map((item) => item.id))

watch(
  () => pagination.currentPage,
  () => getDtcList(),
)

// 获取 dtc 列表
getDtcList()
</script>

<template>
  <section class="flex h-full flex-col gap-16">
    <!-- Header -->
    <h3 class="heading-h2-20px-medium mx-32 h-32">DTC</h3>
    <!-- Search -->
    <base-filter-input
      v-model="searchKey"
      @input-change="handleSearchByInput"
      class="mx-32"
    />
    <!-- Batch delete -->
    <div class="flex-between h-42 mx-32" v-show="selectedDTCIdList.length">
      <span class="text-neutrals-off-black heading-body-body-12px-regular">
        {{ selectedDTCIdList.length }} selected
      </span>
      <el-button @click="dialogConfirmDeleteVisible = true">Delete</el-button>
    </div>
    <!-- Divider -->
    <el-divider />
    <!-- Table -->
    <div class="mx-32 flex flex-1 flex-col overflow-auto pb-32">
      <el-table
        :data="dtcList"
        @row-click="onRowClick"
        row-class-name="clickable-row"
        class="flex-1"
        @sort-change="sort"
        @cell-mouse-enter="handleCellMouseEnter"
        @cell-mouse-leave="handleCellMouseLeave"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" min-width="6%" />
        <el-table-column
          label="User"
          prop="user"
          sortable="custom"
          min-width="25%"
        >
          <template #default="{ row }">
            <div class="row-center">
              <!-- 用户头像 -->
              <el-avatar
                :size="20"
                v-if="row.userDto?.logo"
                :src="getFullFilePath(row.userDto?.logo)"
                @error="() => true"
                class="mr-8"
              >
                <el-image :src="ErrorImage" fit="cover" alt="error image" />
              </el-avatar>
              <span>{{ row.userDto?.name || '-' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="SN" prop="sn" sortable="custom" min-width="15%">
          <template #default="{ row }">
            <span>{{ row.obdDto?.sn || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Vehicle"
          prop="vehiclename"
          sortable="custom"
          min-width="25%"
        >
          <template #default="{ row }">
            <span v-if="row.vehicleDto?.name">
              {{ row.vehicleDto?.name || '-' }}
            </span>
            <span v-else>
              {{
                `${row.vehicleDto?.brand} ${row.vehicleDto?.model}`.trim()
                  ? `${row.vehicleDto?.brand} ${row.vehicleDto?.model}`.trim()
                  : '-'
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="Date"
          prop="createtime"
          min-width="25%"
          sortable="custom"
        >
          <template #default="{ row }">
            <span>{{ getDateWithDDMMMYYYYhhmma(row.createTime) }}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column align="center" prop="actions" min-width="4%">
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
      <base-pagination v-model="pagination" />
    </div>
  </section>
  <!-- 删除确认弹窗 -->
  <base-dialog
    v-model="dialogConfirmDeleteVisible"
    title="Delete DTC ?"
    button-type="danger"
    @cancel="dialogConfirmDeleteVisible = false"
    @confirm="handleDeleteDTC"
  >
    <template #content>
      <p class="heading-body-body-12px-medium text-neutrals-grey-3">
        <!-- DTC 删除提示信息 -->
        Are you sure you want to delete
        {{ !selectedRow.id ? 'these' : 'this' }} DTC record{{
          !selectedRow.id ? 's' : ''
        }}? Once deleted, {{ !selectedRow.id ? 'they' : 'it' }} cannot be
        recovered.
      </p>
    </template>
  </base-dialog>
</template>

<style scoped lang="scss"></style>
