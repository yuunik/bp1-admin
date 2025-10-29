<script setup>
import { ref, watch, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { Star } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

import BasePagination from '@/components/BasePagination.vue'
import {
  getMerchantListApi,
  getUserListApi,
  adminUserStatusApi,
  resetUserPasswordApi,
  approveMerchantApi,
  mergeMerchantApi,
  rejectMerchantApi,
} from '@/apis/userApi.js'
import { UserManagementTab } from '@/utils/constantsUtil.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import { getLastUsedDate } from '@/utils/dateUtil.js'
import BaseDialog from '@/components/BaseDialog.vue'
import { useSort } from '@/composables/useSort.js'
import StarIcon from '@/assets/specialIcons/fi_star.svg'
import BaseTag from '@/components/BaseTag.vue'
import BaseFilterPanel from '@/components/BaseFilterPanel.vue'
import BaseFilterInput from '@/components/BaseFilterInput.vue'

// 修理厂列表
const merchantList = ref([])

// 用户列表
const userList = ref([])

// 分页数据
const pagination = ref({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

// 搜索条件
const searchKey = ref('')

// 用户列表排序
const userSortParams = reactive({
  sort: '',
  sortBy: '',
})

// 修理厂列表排序
const merchantSortParams = reactive({
  sort: '',
  sortBy: '',
})

// 当前tab页
const activeTab = ref(UserManagementTab.PERSON)

// 重置密码弹窗
const dialogResetPasswordVisible = ref(false)

// 重置密码的用户信息
const resetPasswordUser = ref(null)

// 状态筛选参数
const statusList = ref([])

const statusKeys = computed(() =>
  statusList.value.length > 0 ? statusList.value.join(',') : '',
)

const statusFilterParams = ref([
  {
    label: 'Active',
    value: 1,
  },
  {
    label: 'Banned',
    value: 2,
  },
  {
    label: 'Disabled',
    value: 0,
  },
])

// 勾选的 workshop id
const selectedWorkshopIdList = ref([])

// 合并修理厂弹窗
const dialogMergeWorkshopVisible = ref(false)

// 合并的修理厂id列表
const selectedMergeWorkshopList = ref([])

// 需要合并的修理厂的id
const selectedMergeWorkshopId = ref('')

const router = useRouter()

// 获取用户列表
const getUserList = useDebounceFn(async () => {
  const { data, count } = await getUserListApi({
    searchKey: searchKey.value,
    page: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
    sort: userSortParams.sort,
    sortBy: userSortParams.sortBy,
    statusKey: statusKeys.value,
  })
  // 记录总数
  pagination.value.total = count
  // 记录用户列表
  userList.value = data
}, 500)

// 获取修理厂列表
const getMerchantList = useDebounceFn(async () => {
  const { data, count } = await getMerchantListApi({
    searchKey: searchKey.value,
    page: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
    sort: merchantSortParams.sort,
    sortBy: merchantSortParams.sortBy,
    statusKey: statusKeys.value,
  })
  // 记录总数
  pagination.value.total = count
  // 记录修理厂列表
  merchantList.value = data
}, 500)

// 处理tab切换
const handleTabChange = (tabName) => (activeTab.value = tabName)

// 管理员禁用、解禁用户
const handleUserStatus = async (userId) => {
  await adminUserStatusApi(userId)
  // 提示
  ElMessage.success('Success')
  // 刷新列表
  getUserList()
}

// 重置用户密码
const handleResetPassword = async (row) => {
  const { data } = await resetUserPasswordApi(row.id)
  ElMessage.success('Success')
  // 记录重置用户信息
  resetPasswordUser.value = row
  // 记录重置的用户密码
  resetPasswordUser.value.resetPassword = data
  // 打开弹窗
  dialogResetPasswordVisible.value = true
}

// 根据 row.status 计算出当前行的菜单项
const computedMenuItems = computed(() => (row) => {
  const items = []

  if (row.state === 0) {
    // Disabled
    // items.push({ label: 'Reactivate', action: 'reactivate' })
  } else if (row.state === 1) {
    //  Active
    items.push(
      { label: 'Reset Password', action: 'resetPassword' },
      { label: 'Ban', action: 'ban' },
    )
  } else if (row.state === 2) {
    // Banned
    // items.push({ label: 'Reactivate', action: 'reactivate' })
    items.push({ label: 'Unban', action: 'unban' })
  }

  return items
})

// 处理 操作栏的事件
const handleDropdownItemClick = (action, row) => {
  switch (action) {
    case 'unban':
      handleUserStatus(row.id)
      break
    case 'ban':
      handleUserStatus(row.id)
      break
    // case 'reactivate':
    //   handleUserStatus(row.id)
    //   break
    case 'resetPassword':
      handleResetPassword(row)
      break
    default:
      console.warn('Unknown action:', action)
  }
}

// 处理条件搜索
const handleSearchByCondition = () => {
  // 重置为第一页
  pagination.value.currentPage = 0
  // 重新获取列表
  if (activeTab.value === UserManagementTab.PERSON) {
    getUserList()
  } else if (activeTab.value === UserManagementTab.Workshop) {
    getMerchantList()
  }
}

// 处理用户列表排序
const handleUserSortChange = useSort(userSortParams, () => getUserList())

// 处理修理厂列表排序
const handleMerchantSortChange = useSort(merchantSortParams, () =>
  getMerchantList(),
)

// 处理行点击事件
const handleUserRowClick = (row, column) => {
  const { no } = column
  if (no === 0 || no === 8) {
    return
  }
  // 跳转到用户详情页
  router.push({
    name: 'Person Manage',
    params: { id: row.id },
  })
}

// 查看修理厂详情
const handleMerchantRowClick = (row, column) => {
  const { no } = column
  if (no === 0 || no === 5) {
    return
  }
  // 跳转到修理厂详情页
  router.push({
    name: 'Workshop Manage',
    params: { id: row.id },
  })
}

// 复制重置信息
const handleCopyPassword = async () => {
  try {
    await navigator.clipboard.writeText(
      `Person name: ${resetPasswordUser.value.name}\n Email: ${resetPasswordUser.value.email} \n Password: ${resetPasswordUser.value.resetPassword}`,
    )
    // 提示
    ElMessage.success(
      'The "Reset Password" information has been successfully copied. You can paste it now.',
    )
  } catch (err) {
    ElMessage.error('Failed to copy, try again.')
  } finally {
    // 关闭对话框
    dialogResetPasswordVisible.value = false
  }
}

// 获取 tag 颜色
const getTagColor = (state) => {
  switch (state) {
    case 1:
      return 'green'
    case 2:
      return 'red'
    default:
      return 'gray'
  }
}

// 获取 tag 文本
const getTagText = (state) => {
  switch (state) {
    case 1:
      return 'Active'
    case 2:
      return 'Banned'
    default:
      return 'Disabled'
  }
}

const refresh = () => {
  if (activeTab.value === UserManagementTab.PERSON) {
    onUserListRefresh()
  } else if (activeTab.value === UserManagementTab.Workshop) {
    onMerchantListRefresh()
  }
}

const onUserListRefresh = () => {
  if (pagination.value.currentPage === 0) {
    return getUserList()
  }
  pagination.value.currentPage = 0
}

const onMerchantListRefresh = () => {
  if (pagination.value.currentPage === 0) {
    return getMerchantList()
  }
  pagination.value.currentPage = 0
}

// 合并修理厂
const handleMergeWorkshop = async () => {
  try {
    await mergeMerchantApi({
      currentId: selectedMergeWorkshopId.value,
      deleteIds: selectedMergeWorkshopList.value
        .filter((item) => item.id !== selectedMergeWorkshopId.value)
        .map((x) => x.id)
        .join(','),
    })
    ElMessage.success('Repair shop merge successfully.')
    getMerchantList()
  } finally {
    dialogMergeWorkshopVisible.value = false
    // 重置勾选
    selectedMergeWorkshopId.value = ''
  }
}

// 勾选框勾选
const handleWorkshopSelectionChange = (val) =>
  (selectedMergeWorkshopList.value = val)

// 状态到颜色的映射
const stateColor = (state) => {
  switch (state) {
    case 'Pending':
      return 'orange'
    case 'Active':
      return 'green'
    case 'Disable':
      return 'gray'
    case 'Rejected':
      return 'red'
    default:
      return 'blue' // 默认颜色
  }
}

// 批准修理厂
const handleApproveWorkshop = async (workshopId) => {
  await approveMerchantApi(workshopId)
  ElMessage.success('Repair shop approved successfully.')
  getMerchantList()
}

// 拒绝修理厂
const handleRejectWorkshop = async (workshopId) => {
  await rejectMerchantApi(workshopId)
  ElMessage.success('Repair shop approval rejected successfully.')
  getMerchantList()
}

// 关闭合并修理厂的弹窗
const handleCloseMergeWorkshop = () => {
  // 重置
  selectedMergeWorkshopId.value = ''
  selectedMergeWorkshopList.value = []
  // 关闭弹窗
  dialogMergeWorkshopVisible.value = false
}

// 监听tab变化，获取对应列表
watch(
  () => activeTab.value,
  (val) => {
    // 切换tab, 清空分页参数
    pagination.value = {
      currentPage: 0,
      pageSize: 15,
      total: 0,
    }
    // 获取对应列表
    if (val === UserManagementTab.PERSON) {
      getUserList()
    } else if (val === UserManagementTab.Workshop) {
      getMerchantList()
    }
  },
  {
    immediate: true,
  },
)

// 监听currentPage, 刷新列表
watch(
  () => pagination.value.currentPage,
  () => {
    // 获取对应列表
    if (activeTab.value === UserManagementTab.PERSON) {
      getUserList()
    } else if (activeTab.value === UserManagementTab.Workshop) {
      getMerchantList()
    }
  },
)
</script>

<template>
  <section class="flex h-full flex-col overflow-auto">
    <!-- Extern Header -->
    <div class="flex-between mx-32 h-32">
      <!-- 标题栏 -->
      <h3 class="heading-h2-20px-medium">Extern</h3>
      <!-- 创建修理厂按钮 -->
      <el-button
        type="primary"
        class="w-70 h-32"
        @click="$router.push({ name: 'Create Workshop' })"
        v-show="activeTab === UserManagementTab.Workshop"
      >
        Create
      </el-button>
    </div>
    <!-- tab 栏 -->
    <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="my-16">
      <el-tab-pane
        :label="UserManagementTab.PERSON"
        :name="UserManagementTab.PERSON"
      />
      <el-tab-pane
        :label="UserManagementTab.Workshop"
        :name="UserManagementTab.Workshop"
      />
    </el-tabs>
    <!-- 搜索栏 -->
    <div class="flex-between mx-32 mb-16 h-24">
      <div class="row-center h-24 gap-8">
        <!-- 账号状态筛选 -->
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
      <base-filter-input v-model="searchKey" @inputChange="refresh" />
    </div>
    <!-- 分割线 -->
    <el-divider />
    <!-- person 页 -->
    <template v-if="activeTab === UserManagementTab.PERSON">
      <!-- 表格容器 -->
      <div
        class="pb-38 flex-between box-border flex min-h-0 flex-1 flex-col px-32 pt-16"
      >
        <!-- 批量选择栏 -->
        <div class="h-42 flex-between hidden w-full py-4 pl-16">
          <span
            class="heading-body-body-12px-regular text-neutrals-off-black leading-16"
          >
            3 selected
          </span>
          <div>
            <el-button>Disable</el-button>
            <el-button>Up</el-button>
            <el-button>Down</el-button>
          </div>
        </div>
        <!-- 用户列表 -->
        <el-table
          :data="userList"
          class="flex-1"
          @sort-change="handleUserSortChange"
          @row-click="handleUserRowClick"
          row-class-name="clickable-row"
        >
          <!-- 勾选框 -->
          <el-table-column type="selection" min-width="6%" />
          <!-- 用户名称 -->
          <el-table-column
            prop="name"
            label="Name"
            sortable="custom"
            min-width="17%"
          >
            <!-- 用户头像 -->
            <template #default="{ row }">
              <el-image
                :src="getFullFilePath(row.logo)"
                v-if="row.logo"
                fit="cover"
                alt="merchant logo"
                class="mr-8 h-14 w-14"
              />
              <!-- 用户名称 -->
              <el-text>{{ row?.name ?? '-' }}</el-text>
            </template>
          </el-table-column>
          <!-- 用户邮箱 -->
          <el-table-column
            prop="email"
            label="Email"
            sortable="custom"
            min-width="17%"
          >
            <template #default="{ row }">
              <!-- 用户邮箱 -->
              <el-text>
                {{ row.email === '' ? '-' : row.email }}
              </el-text>
            </template>
          </el-table-column>
          <!-- 用户状态 -->
          <el-table-column
            prop="state"
            label="Status"
            sortable="custom"
            min-width="11%"
          >
            <template #default="{ row }">
              <!-- 用户状态, state 为 1, 激活, 为 0, 删除 , 为2, 禁用-->
              <base-tag
                :text="getTagText(row?.state)"
                :color="getTagColor(row?.state)"
              />
            </template>
          </el-table-column>
          <!-- OBD 数量 -->
          <el-table-column
            prop="obdCount"
            label="OBD"
            min-width="7%"
            sortable="custom"
          >
            <template #default="{ row }">
              <!-- OBD 数量 -->
              <el-text>{{ row.obdCount || '-' }}</el-text>
            </template>
          </el-table-column>
          <!-- 车辆数量 -->
          <el-table-column
            prop="vehicleCount"
            label="Vehicle"
            min-width="9%"
            sortable="custom"
          >
            <template #default="{ row }">
              <!-- 车辆数量 -->
              <el-text>{{ row.vehicleCount || '-' }}</el-text>
            </template>
          </el-table-column>
          <!-- 是否订阅 -->
          <el-table-column
            prop="subscription"
            label="Subscription"
            min-width="11%"
          >
            <template #default="{ row }">
              <!-- 是否订阅 -->
              <el-text>{{ row.subscription || '-' }}</el-text>
            </template>
          </el-table-column>
          <!-- 上次登录时间 -->
          <el-table-column
            prop="updateTime"
            label="Last Login"
            min-width="22%"
            sortable="custom"
          >
            <template #default="{ row }">
              <!-- 上次登录时间 -->
              <el-text>
                {{ getLastUsedDate(row.updateTime) }}
              </el-text>
            </template>
          </el-table-column>
          <!-- 操作栏 -->
          <el-table-column align="center" min-width="11%">
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
        <!-- 分页器 -->
        <base-pagination v-model="pagination" />
      </div>
    </template>
    <!-- workshop 页 -->
    <template v-if="activeTab === UserManagementTab.Workshop">
      <!-- 表格容器 -->
      <div
        class="pb-38 flex-between box-border flex min-h-0 flex-1 flex-col px-32 pt-16"
      >
        <!-- 批量选择栏 -->
        <div
          class="h-42 flex-between w-full py-4 pl-16"
          v-show="selectedMergeWorkshopList.length"
        >
          <span
            class="heading-body-body-12px-regular text-neutrals-off-black leading-16"
          >
            {{ selectedMergeWorkshopList.length }} selected
          </span>
          <div>
            <el-button>Disable</el-button>
            <el-button @click="dialogMergeWorkshopVisible = true">
              Merge Workshop
            </el-button>
            <el-button>Up</el-button>
            <el-button>Down</el-button>
          </div>
        </div>
        <!-- 修理厂列表 -->
        <el-table
          :data="merchantList"
          class="flex-1"
          @sort-change="handleMerchantSortChange"
          @row-click="handleMerchantRowClick"
          @selection-change="handleWorkshopSelectionChange"
          row-class-name="clickable-row"
        >
          <!-- 勾选框 -->
          <el-table-column type="selection" min-width="6%" />
          <!-- 修理厂名称 -->
          <el-table-column
            prop="name"
            label="Name"
            sortable="custom"
            min-width="29%"
          >
            <!-- 修理厂 logo -->
            <template #default="{ row }">
              <el-image
                :src="getFullFilePath(row.logo)"
                v-if="row.logo"
                fit="cover"
                alt="merchant logo"
                class="mr-8 h-14 w-14"
              />
              <!-- 修理厂名称 -->
              <el-text>{{ row?.name ?? '-' }}</el-text>
            </template>
          </el-table-column>
          <!-- 修理厂邮箱 -->
          <el-table-column
            prop="userDto?.email"
            label="Email"
            sortable="custom"
            min-width="29%"
          >
            <template #default="{ row }">
              <!-- 修理厂邮箱 -->
              <el-text>
                {{ row?.userDto?.email === '' ? '-' : row?.userDto?.email }}
              </el-text>
            </template>
          </el-table-column>
          <!-- 修理厂评分 -->
          <el-table-column
            prop="rating"
            label="Reveiw"
            sortable="custom"
            min-width="12%"
          >
            <template #default="{ row }">
              <div class="row-center gap-8">
                <!-- 星星图标 -->
                <el-image :src="StarIcon" size="14" class="row-center!" />
                <!-- 评分 -->
                <el-text>{{ row?.rating ?? '-' }}</el-text>
              </div>
            </template>
          </el-table-column>
          <!-- 修理厂状态 -->
          <el-table-column prop="status" label="Status" min-width="18%">
            <template #default="{ row }">
              <base-tag :text="row.state" :color="stateColor(row.state)" />
            </template>
          </el-table-column>
          <!-- 操作栏 -->
          <el-table-column min-width="6%" align="center">
            <template #default="{ row }">
              <el-dropdown trigger="click">
                <i class="icon-more-2-line cursor-pointer" />
                <template #dropdown>
                  <el-dropdown-menu v-if="row.state === 'Pending'">
                    <el-dropdown-item @click="handleApproveWorkshop(row.id)">
                      Approve
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleRejectWorkshop(row.id)">
                      Reject
                    </el-dropdown-item>
                  </el-dropdown-menu>
                  <el-dropdown-menu v-else-if="row.state === 'Active'">
                    <el-dropdown-item>Reset Password</el-dropdown-item>
                    <el-dropdown-item>Disable</el-dropdown-item>
                  </el-dropdown-menu>
                  <el-dropdown-menu v-else-if="row.state === 'Disable'">
                    <el-dropdown-item>Reset Password</el-dropdown-item>
                    <el-dropdown-item>Disable</el-dropdown-item>
                  </el-dropdown-menu>
                  <el-dropdown-menu v-else-if="row.state === 'Rejected'">
                    <el-dropdown-item>Reset Password</el-dropdown-item>
                    <el-dropdown-item>Disable</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <base-pagination v-model="pagination" />
      </div>
    </template>
  </section>
  <!-- 重置密码提示弹窗 -->
  <base-dialog
    v-model="dialogResetPasswordVisible"
    title="Reset Password"
    @cancel="dialogResetPasswordVisible = false"
    @confirm="handleCopyPassword"
  >
    <template #content>
      <dl
        class="[&>dt]:leading-80 grid grid-cols-[100px_1fr] items-center gap-x-8 [&>dt]:h-80"
      >
        <dt>Person name</dt>
        <dd>{{ resetPasswordUser.name }}</dd>
        <dt>Email</dt>
        <dd>{{ resetPasswordUser.email }}</dd>
        <dt>Password</dt>
        <dd>{{ resetPasswordUser.resetPassword }}</dd>
      </dl>
    </template>
  </base-dialog>
  <!-- 合并修理厂弹窗 -->
  <base-dialog
    v-model="dialogMergeWorkshopVisible"
    title="Merge Workshop"
    @cancel="handleCloseMergeWorkshop"
    @confirm="handleMergeWorkshop"
    class="merge-workshop-dialog"
    dialog-width="50%"
  >
    <template #content>
      <p
        class="heading-body-body-12px-regular text-neutrals-grey-4 mt-16 whitespace-pre"
      >
        The selected workshops seem to belong to the same brand.
        <br />
        Choose which details to keep after merging.
      </p>
      <!-- selected card -->
      <el-radio-group class="w-full!" v-model="selectedMergeWorkshopId">
        <div
          class="workshops-card-container max-h-520 mt-16 grid w-full grid-cols-2 gap-8 overflow-auto"
        >
          <div
            v-for="workshop in selectedMergeWorkshopList"
            :key="workshop.id"
            :class="[
              'rounded-9',
              'relative',
              'box-border',
              'flex',
              'flex-col',
              'gap-12',
              'p-12',
              'default-transition',
              selectedMergeWorkshopId !== workshop.id
                ? 'border-neutral-grey-1-1px'
                : 'border-branding-colours-primary-1px',
            ]"
          >
            <!-- absolute position -->
            <el-radio :value="workshop.id" />
            <!-- workshop name -->
            <div class="row-center h-32 gap-8">
              <el-avatar :src="getFullFilePath(workshop.logo)" :size="32" />
              <span
                class="heading-body-body-12px-regular text-neutrals-off-black leading-16"
              >
                {{ workshop.name }}
              </span>
            </div>
            <span
              class="heading-body-body-12px-regular text-neutrals-grey-4 leading-16"
            >
              {{ workshop.businessHours }}
            </span>
            <span
              class="heading-body-body-12px-regular text-neutrals-grey-4 leading-16"
            >
              {{ workshop.phoneCountry ? `+${workshop.phoneCountry}` : '' }}
              {{ workshop.phoneNumber || '-' }}
            </span>
            <span
              class="heading-body-body-12px-regular text-neutrals-grey-4 leading-16"
            >
              {{ workshop.shopAddress || '-' }}
            </span>
          </div>
        </div>
      </el-radio-group>
    </template>
  </base-dialog>
</template>

<style scoped lang="scss">
// 搜索框样式重置
.extern-search {
  :deep(.el-input__wrapper) {
    box-shadow: none;
    background-color: transparent;
  }
}

// 评星图标样式
.icon-fi_star {
  color: $status-colours-orange;

  &::before {
    vertical-align: middle;
  }
}

// 重置 tab 的下划线
:deep(.el-tabs__header) {
  border: none;
}

// 重置chekcbox
.workshops-card-container {
  :deep(.el-radio) {
    @apply absolute right-4 top-4 mr-0 h-20 w-20;
  }
}
</style>
