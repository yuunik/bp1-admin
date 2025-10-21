<script setup>
import { ElMessage } from 'element-plus'
import { useCloned, useDebounceFn, useSessionStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'

import BaseFilterInput from '@/components/BaseFilterInput.vue'
import { RouteName, TimingPreset } from '@/utils/constantsUtil.js'
import BasePagination from '@/components/BasePagination.vue'
import { getDateWithDDMMMYYYYhhmma } from '@/utils/dateUtil.js'
import BaseDialog from '@/components/BaseDialog.vue'
import { useSort } from '@/composables/useSort.js'
import BaseUpload from '@/components/BaseUpload.vue'
import {
  addClubApi,
  approveClubApi,
  deleteClubApi,
  editClubApi,
  getClubListApi,
  manageClubApi,
  rejectClubApi,
} from '@/apis/clubApi.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import BaseFilterPanel from '@/components/BaseFilterPanel.vue'
import BaseTag from '@/components/BaseTag.vue'

const clubList = ref([])

const router = useRouter()

const stateColorMap = {
  Pending: 'orange',
  Rejected: 'red',
  Disabled: 'gray',
  Active: 'green',
}

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

// 俱乐部状态筛选参数
const statusList = ref([])

const statusKeys = computed(() =>
  statusList.value.length ? statusList.value.join(',') : '',
)

const statusFilterParams = ref([
  {
    label: 'Pending',
    value: 'Pending',
  },
  {
    label: 'Rejected',
    value: 'Rejected',
  },
  {
    label: 'Disabled',
    value: 'Disabled',
  },
  {
    label: 'Active',
    value: 'Active',
  },
])

// 禁止俱乐部创建的弹窗
const dialogRejectGroupVisible = ref(false)

// 所选中的俱乐部管理者列表
const selectedClubManagerList = useSessionStorage('selectedClubManagerList', [])

// 拒绝的俱乐部表单
const rejectClubForm = reactive({
  clubId: '',
  reason: '',
  name: '',
})

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

// 删除俱乐部
const handleDeleteClub = async () => {
  await deleteClubApi(
    selectedClubIdList.value.length
      ? selectedClubIdList.value.join(',')
      : clubForm.value.id,
  )
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
    status: statusKeys.value,
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
  if (no === 0 || no === 6) {
    return
  } else if (no === 2) {
    if (row.usersDto?.length === 1) {
      router.push({
        name: RouteName.PERSON_MANAGE,
        params: { id: row.usersDto[0].userId },
      })
    }
    return
  }
  // 记录当前的俱乐部所属的管理者列表
  selectedClubManagerList.value = row.usersDto

  router.push({ name: RouteName.GROUP_DETAILS, params: { id: row.id } })
}

// 打开拒绝俱乐部创建的弹窗
const handleOpenRejectGroupDialog = (row) => {
  const { cloned } = useCloned(row)
  Object.assign(rejectClubForm, cloned.value)
  rejectClubForm.clubId = row.id
  dialogRejectGroupVisible.value = true
}

// 拒绝俱乐部创建
const handleRejectGroup = async () => {
  // 拒绝理由非空校验
  if (!rejectClubForm.reason) {
    ElMessage.error('Please enter a reason')
    return
  }
  try {
    await rejectClubApi(rejectClubForm)
    // 提示
    ElMessage.success('Rejected successfully')
    refresh()
  } finally {
    dialogRejectGroupVisible.value = false
  }
}

// 根据 row.status 计算出当前行的菜单项
const computedMenuItems = computed(() => (row) => {
  const items = []

  if (row.state === 'Pending') {
    // Pending
    items.push(
      { label: 'Approve', action: 'approve' },
      { label: 'Reject', action: 'reject' },
    )
  } else if (row.state === 'Rejected') {
    //  Rejected
    items.push(
      { label: 'Edit', action: 'edit' },
      { label: 'Re-Approve', action: 'reApprove' },
    )
  } else if (row.state === 'Disabled') {
    // Disabled
    items.push({ label: 'Enable', action: 'enable' })
  } else if (row.state === 'Active') {
    //  Active
    items.push(
      { label: 'Disable', action: 'disable' },
      { label: 'Disband', action: 'disband' },
      { label: 'Edit', action: 'edit' },
    )
  }

  return items
})

// 批准俱乐部
const handleApproveClub = async (clubId) => {
  await approveClubApi(clubId)
  // 提示
  ElMessage.success('Approved successfully')
  refresh()
}

// 禁用/启用俱乐部
const handleClubStatus = async (clubId, type) => {
  await manageClubApi(clubId)
  // 提示
  ElMessage.success(
    `${type.charAt(0).toUpperCase() + type.slice(1)} successfully`,
  )
  refresh()
}

// 处理 操作栏的事件
const handleDropdownItemClick = (action, row) => {
  switch (action) {
    case 'approve':
      handleApproveClub(row.id)
      break
    case 'reject':
      handleOpenRejectGroupDialog(row)
      break
    case 'edit':
      openEditClubItemDialog(row)
      break
    case 'reApprove':
      handleApproveClub(row.id)
      break
    case 'enable':
      handleClubStatus(row.id, action)
      break
    case 'disable':
      handleClubStatus(row.id, action)
      break
    case 'disband':
      handleOpenDeleteClubItemDialog(row)
      break
    default:
      console.warn('Unknown action:', action)
  }
}

// 查看用户详情
const handleViewUserInfo = (userInfo) =>
  router.push({
    name: RouteName.PERSON_MANAGE,
    params: { id: userInfo.userId },
  })

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
    <div class="flex-between">
      <div class="row-center filter-container flex-wrap gap-8">
        <!-- 应用平台筛选 -->
        <base-filter-panel
          v-model="statusList"
          :section-list="statusFilterParams"
          condition-text="Status"
          @search="refresh"
        />
        <!-- 清除按钮 -->
        <el-button
          text
          class="h-24! text-status-colours-blue!"
          @click="statusList = []"
          v-show="statusList.length"
        >
          Clear
        </el-button>
      </div>
      <!-- 输入搜索 -->
      <base-filter-input v-model="searchKeywords" @inputChange="refresh" />
    </div>
    <el-divider />
    <div class="flex-between h-42" v-show="selectedClubIdList.length">
      <span class="text-neutrals-off-black heading-body-body-12px-regular">
        {{ selectedClubIdList.length }} selected
      </span>
      <el-button @click="dialogDeleteClubItemVisible = true">Delete</el-button>
    </div>
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
        <el-table-column type="selection" min-width="6%" />
        <el-table-column
          prop="name"
          label="Group"
          min-width="23%"
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
        <el-table-column prop="owner" label="Admin" min-width="23%">
          <template #default="{ row }">
            <template v-if="row.usersDto && row.usersDto.length">
              <div v-if="row.usersDto.length === 1" class="row-center">
                <el-avatar
                  v-if="row.usersDto[0].logo"
                  fit="cover"
                  :src="getFullFilePath(row.usersDto[0].logo)"
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
                <span
                  class="text-wrap underline"
                  @click="
                    $router.push({
                      name: RouteName.PERSON_MANAGE,
                      params: { id: row.usersDto[0].userId },
                    })
                  "
                >
                  {{ row.usersDto[0].name || '-' }}
                </span>
              </div>
              <el-dropdown v-else>
                <div class="row-center">
                  <el-avatar
                    v-if="row.usersDto[0].logo"
                    fit="cover"
                    :src="getFullFilePath(row.usersDto[0].logo)"
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
                  <span class="text-wrap underline">
                    {{ row.usersDto[0].name || '-' }}
                  </span>
                  <span>+{{ row.usersDto.length - 1 }}</span>
                </div>
                <template #dropdown>
                  <el-dropdown-menu class="custom-dropdown-menu">
                    <el-dropdown-item
                      v-for="user in row.usersDto"
                      :key="user.id"
                      @click="handleViewUserInfo(user)"
                    >
                      <div class="row-center">
                        <el-avatar
                          v-if="user.logo"
                          fit="cover"
                          :src="getFullFilePath(user.logo)"
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
                          {{ user.name || '-' }}
                        </span>
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="memberCount"
          label="Members"
          min-width="13%"
          sortable="custom"
        />
        <el-table-column
          prop="state"
          label="Status"
          min-width="13%"
          sortable="custom"
        >
          <template #default="{ row }">
            <base-tag :text="row.state" :color="stateColorMap[row.state]" />
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="Create Time"
          min-width="16%"
          sortable="custom"
        >
          <template #default="{ row }">
            <span>{{ getDateWithDDMMMYYYYhhmma(row.createTime) }}</span>
          </template>
        </el-table-column>
        <!-- 操作栏 -->
        <el-table-column align="center" min-width="6%">
          <template #default="{ row }">
            <el-dropdown trigger="click" v-if="row.state !== 0">
              <i class="icon-more-2-line cursor-pointer" />
              <template #dropdown>
                <el-dropdown-menu class="custom-dropdown-menu">
                  <el-dropdown-item
                    v-for="item in computedMenuItems(row)"
                    :key="item.label"
                    @click="handleDropdownItemClick(item.action, row)"
                  >
                    {{ item.label }}
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
  <!-- 删除俱乐部提示框 -->
  <base-dialog
    v-model="dialogDeleteClubItemVisible"
    title="Delete Item ?"
    button-type="danger"
    confirm-text="Delete"
    @cancel="dialogDeleteClubItemVisible = false"
    @confirm="handleDeleteClub"
  >
    <template #content>
      <p
        v-if="!selectedClubIdList.length"
        class="heading-body-body-12px-regular text-neutrals-grey-3"
      >
        Are you sure you want to delete the {{ clubForm.name }} Club? All data
        associated with this club will be permanently deleted, and this action
        cannot be undone.
      </p>
      <p v-else class="heading-body-body-12px-regular text-neutrals-grey-3">
        Are you sure you want to delete these clubs? All data associated with
        this club will be permanently deleted, and this action cannot be undone.
      </p>
    </template>
  </base-dialog>
  <!-- 禁止俱乐部创办的提示框 -->
  <base-dialog
    v-model="dialogRejectGroupVisible"
    title="Reject Group"
    button-type="danger"
    confirm-text="Reject Group"
    @cancel="dialogRejectGroupVisible = false"
    @confirm="handleRejectGroup"
  >
    <template #content>
      <dl
        class="[&>dt]:row-center [&>dd]:row-center grid grid-cols-[80px_1fr] gap-8 [&>dd]:h-32 [&>dt]:h-32"
      >
        <dt>Name</dt>
        <dd>{{ rejectClubForm.name }}</dd>
        <!--<dt>Creator</dt>-->
        <!--<dd>Esther Howard</dd>-->
      </dl>
      <el-divider class="my-8!" />
      <div class="reason-container flex gap-8">
        <p class="w-112">
          Reason
          <span class="text-red">*</span>
        </p>
        <el-input
          v-model="rejectClubForm.reason"
          placeholder="Enter"
          class="club-name-input"
          rows="3"
          type="textarea"
        />
      </div>
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

// 重置文本框样式
.reason-container :deep(.el-textarea__inner) {
  background-color: transparent !important;
  border: none; /* 去掉默认边框 */
  border-bottom: 1px solid #dcdfe6; /* 只保留底部边框 */
  border-radius: 0; /* 去掉圆角 */
  box-shadow: none;
  padding: 0;
}
</style>
