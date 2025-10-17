<script setup>
import { ElMessage } from 'element-plus'
import { useCloned, useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'

import BaseFilterInput from '@/components/BaseFilterInput.vue'
import { RouteName, TimingPreset } from '@/utils/constantsUtil.js'
import BasePagination from '@/components/BasePagination.vue'
import { getDateWithDDMMMYYYY } from '@/utils/dateUtil.js'
import BaseDialog from '@/components/BaseDialog.vue'
import { useSort } from '@/composables/useSort.js'
import BaseUpload from '@/components/BaseUpload.vue'
import {
  addClubApi,
  deleteClubApi,
  editClubApi,
  getClubListApi,
} from '@/apis/clubApi.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'

const clubList = ref([])

const router = useRouter()

// 分页数据
const pagination = reactive({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

// 输入搜索关键字
const searchKeywords = ref('')

// 创建Expense的弹窗
const dialogClubFormVisible = ref(false)

// club 表单
const clubForm = ref({
  name: '',
  description: '',
  logo: '',
})

// 确认删除弹窗
const dialogDeleteClubItemVisible = ref(false)

// 排序参数
const sortParams = reactive({
  sort: '',
  sortBy: '',
})

// 勾选的expense item list
const selectedClubIdList = ref([])

const baseUploadRef = ref(null)

// 刷新
const refresh = useDebounceFn(() => {
  if (!pagination.currentPage) {
    return getClubList()
  }
  // 设置当前页为 1
  pagination.currentPage = 0
}, TimingPreset.DEBOUNCE)

// 新增 club
const handleCreateClubItem = async () => {
  await addClubApi(clubForm.value)
  // 关闭弹窗
  dialogClubFormVisible.value = false
  // 提示
  ElMessage.success('Added successfully')
  refresh()
}

// 打开表单弹窗
const openEditClubItemDialog = (row) => {
  const { cloned } = useCloned(row)
  clubForm.value = cloned.value
  dialogClubFormVisible.value = true
}

// 编辑 club
const handleEditClubItem = async () => {
  await editClubApi(clubForm.value)
  // 关闭弹窗
  dialogClubFormVisible.value = false
  // 提示
  ElMessage.success('Edit successfully')
  refresh()
}

// 管理expense item
const handleManageClubItem = async () => {
  if (!clubForm.value.id) {
    handleCreateClubItem()
  } else {
    handleEditClubItem()
  }
}

// 打开确认删除弹窗
const handleOpenDeleteClubItemDialog = (row) => {
  clubForm.value = row
  dialogDeleteClubItemVisible.value = true
}

// 删除 expense item
const handleDeleteExpenseItem = async () => {
  await deleteClubApi(clubForm.value.id)
  dialogDeleteClubItemVisible.value = false
  // 提示
  ElMessage.success('Delete successfully')
  refresh()
}

// 排序函数
const handleSortChange = useSort(sortParams, () => refresh())

// 勾选框勾选
const handleSelectionChange = (val) =>
  (selectedClubIdList.value = val.map((item) => item.id))

// 获取Club列表
const getClubList = async () => {
  const { data } = await getClubListApi({
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    searchKey: searchKeywords.value,
    sort: sortParams.sort,
    sortBy: sortParams.sortBy,
  })
  clubList.value = data
}

// 获取上传的本地文件
const handleGetLocalFile = (file) => (clubForm.value.logo = file)

// 错误行为
const errorHandler = () => true

// 显示用于回显的logo
const getLogoDisplay = (logo) => {
  // logo为空, 直接返回
  if (!logo) {
    return logo
  }
  if (logo instanceof File) {
    // logo为本地文件, 创建本地文件路径
    return URL.createObjectURL(logo)
  } else {
    // logo为服务器文件, 拼接全称路径
    return getFullFilePath(logo)
  }
}

// 打开查看俱乐部详情弹窗
const handleOpenClubInfoDialog = async (row, column) => {
  const { no } = column
  if (no === 4) {
    return
  }

  router.push({ name: RouteName.CLUB_DETAILS, params: { id: row.id } })
}

// 监听
watch(dialogDeleteClubItemVisible, (val) => {
  if (!val) {
    clubForm.value = {}
  }
})

watch(dialogClubFormVisible, (val) => {
  if (!val) {
    clubForm.value = {
      name: '',
      description: '',
      logo: '',
    }
    baseUploadRef.value.clear()
  }
})

watch(
  () => pagination.currentPage,
  () => getClubList(),
)

// 网络请求
onMounted(async () => {
  getClubList()
})
</script>

<template>
  <section
    class="mx-32 box-border flex h-full flex-col gap-16 overflow-auto pb-32"
  >
    <!-- 标题栏 -->
    <div class="flex-between h-32">
      <h3
        class="heading-h2-20px-medium text-neutrals-off-black row-center h-32"
      >
        Groups
      </h3>
      <el-button type="primary" @click="dialogClubFormVisible = true">
        Create
      </el-button>
    </div>
    <!-- 搜索栏 -->
    <div class="row-center flex-end h-24">
      <!-- 输入搜索 -->
      <base-filter-input v-model="searchKeywords" @inputChange="refresh" />
    </div>
    <el-divider />
    <!--<div class="flex-between h-42" v-show="selectedClubIdList.length">-->
    <!--  <span class="text-neutrals-off-black heading-body-body-12px-regular">-->
    <!--    {{ selectedClubIdList.length }} selected-->
    <!--  </span>-->
    <!--  <el-button @click="dialogBatchDeleteExpenseItemVisible = true">-->
    <!--    Delete-->
    <!--  </el-button>-->
    <!--</div>-->
    <!-- 表格内容 -->
    <div class="flex flex-1 flex-col justify-between overflow-hidden">
      <el-table
        :data="clubList"
        style="width: 100%"
        class="flex-1"
        row-class-name="clickable-row"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
        @row-click="handleOpenClubInfoDialog"
      >
        <el-table-column
          prop="name"
          label="Name"
          min-width="23.5%"
          sortable="custom"
        >
          <template #default="{ row }">
            <div class="row-center gap-8">
              <el-avatar
                v-if="row.logo"
                fit="cover"
                :src="getFullFilePath(row.logo)"
                class="mr-8 h-20 w-20 shrink-0"
                alt="brand icon"
                shape="circle"
                :size="20"
                @error="errorHandler"
              >
                <template #error>
                  <i class="i-ep:picture" />
                </template>
              </el-avatar>
              <span class="text-wrap">
                {{ row.name || '-' }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="Description"
          min-width="23.5%"
        />
        <el-table-column
          prop="memberCount"
          label="Member Count"
          min-width="23.5%"
        />
        <el-table-column
          prop="createTime"
          label="Create Time"
          min-width="23.5%"
          sortable="custom"
        >
          <template #default="{ row }">
            <span>{{ getDateWithDDMMMYYYY(row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="6%">
          <template #default="{ row }">
            <el-dropdown trigger="click">
              <i class="icon-more-2-line text-16" />
              <template #dropdown>
                <el-dropdown-menu class="px-16! py-8! rounded-8!" place>
                  <el-dropdown-item @click="openEditClubItemDialog(row)">
                    Edit
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click="handleOpenDeleteClubItemDialog(row)"
                  >
                    Delete
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination v-model="pagination" />
    </div>
  </section>
  <!-- 创建 club 弹窗 -->
  <base-dialog
    v-model="dialogClubFormVisible"
    :title="clubForm.id ? 'Edit Club' : 'Create a New Club'"
    :confirm-text="clubForm.id ? 'Edit' : 'Create'"
    @cancel="dialogClubFormVisible = false"
    @confirm="handleManageClubItem"
    class="club-form-container"
  >
    <template #content>
      <div class="flex flex-col gap-8">
        <!-- 上传 logo -->
        <base-upload
          v-if="dialogClubFormVisible"
          ref="baseUploadRef"
          default-avatar-text="A"
          :img-path="getLogoDisplay(clubForm.logo)"
          @get-local-file="handleGetLocalFile"
        />
        <div class="flex flex-col gap-8">
          <p class="heading-body-body-12px-medium text-neutrals-off-black">
            Club Name
          </p>
          <el-input
            v-model="clubForm.name"
            placeholder="Enter"
            class="club-name-input"
          />
        </div>
        <div class="flex flex-col gap-8">
          <p class="heading-body-body-12px-medium text-neutrals-off-black">
            Description
          </p>
          <el-input
            type="textarea"
            v-model="clubForm.description"
            rows="3"
            placeholder="Enter"
            class="club-description-input"
          />
        </div>
      </div>
    </template>
  </base-dialog>
  <!-- 删除 expense item 提示框 -->
  <base-dialog
    v-model="dialogDeleteClubItemVisible"
    title="Delete Item ?"
    button-type="danger"
    confirm-text="Delete"
    @cancel="dialogDeleteClubItemVisible = false"
    @confirm="handleDeleteExpenseItem"
  >
    <template #content>
      <p class="heading-body-body-12px-regular text-neutrals-grey-3">
        Are you sure you want to delete the {{ clubForm.name }} Club? All data
        associated with this club will be permanently deleted, and this action
        cannot be undone.
      </p>
    </template>
  </base-dialog>
</template>

<style scoped lang="scss">
// 重置 el-input 的样式
:deep(.club-description-input) {
  .el-textarea__inner {
    @apply rounded-12 bg-[#EAEEF480];
  }
}

// 重置选择框的样式
:deep(.club-name-input) {
  .el-input__wrapper {
    @apply rounded-12 h-32 bg-[#EAEEF480];
  }
}

// 重置滚动条布局
.scrollbar-container :deep(.el-scrollbar__view) {
  @apply flex flex-col gap-16;
}

:deep(.el-table__header .cell) {
  @apply text-neutrals-grey-3;
}
</style>
