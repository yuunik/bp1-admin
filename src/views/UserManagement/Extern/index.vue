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
} from '@/apis/userApi.js'
import { UserManagementTab } from '@/utils/constantsUtil.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import { getLastUsedDate } from '@/utils/dateUtil.js'
import BaseDialog from '@/components/BaseDialog.vue'
import { useSort } from '@/composables/useSort.js'

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

const router = useRouter()

// 获取用户列表
const getUserList = useDebounceFn(async () => {
  console.log('getUserList', userSortParams)
  const { data, count } = await getUserListApi({
    searchKey: searchKey.value,
    page: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
    sort: userSortParams.sort,
    sortBy: userSortParams.sortBy,
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
    items.push({ label: 'Unban', action: 'unban' })
  } else if (row.state === 1) {
    items.push(
      { label: 'Reset Password', action: 'resetPassword' },
      { label: 'Ban', action: 'ban' },
    )
  } else if (row.state === 2) {
    items.push({ label: 'Reactivate', action: 'reactivate' })
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
      break
    case 'reactivate':
      handleUserStatus(row.id)
      break
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
    name: 'External Manage',
    params: { id: row.id },
    query: { type: 'user' },
  })
}

const handleMerchantRowClick = (row, column) => {
  const { no } = column
  if (no === 0 || no === 5) {
    return
  }
  // 跳转到修理厂详情页
  // router.push({
  //   name: 'External Manage',
  //   params: { id: row.id },
  //   query: { type: 'merchant' },
  // })
}

// 复制重置信息
const handleCopyPassword = async () => {
  try {
    await navigator.clipboard.writeText(
      `Person name: ${resetPasswordUser.value.name}\n Email: ${resetPasswordUser.value.email} \n Password: 32523213`,
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
    // 清空条件搜索文本
    searchKey.value = ''
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
  <router-view v-if="$route.name === 'External Manage'" />
  <router-view v-else-if="$route.name === 'Create Workshop'" />
  <section class="flex h-full flex-col" v-else>
    <!-- Extern Header -->
    <div class="flex-between mx-32 mb-16 h-32">
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
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
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
    <div class="flex-between mx-32">
      <!-- 条件搜索 -->
      <el-input
        v-model="searchKey"
        @input="handleSearchByCondition"
        placeholder="Search..."
        class="extern-search mt-16"
      >
        <template #prefix>
          <!-- 前置搜索图标 -->
          <i class="icon-mail-send-line-1 text-16" />
        </template>
      </el-input>
      <!-- 状态搜索 -->
      <el-dropdown trigger="click">
        <span
          class="border-1 neutrals-grey-3 flex cursor-pointer gap-5 rounded-full border-solid border-[#CACFD8] px-8 py-4"
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
    <!-- 分割线 -->
    <el-divider />
    <!-- person 页 -->
    <template v-if="activeTab === UserManagementTab.PERSON">
      <!-- 表格容器 -->
      <div
        class="pb-38 flex-between box-border flex min-h-0 flex-1 flex-col px-32 pt-16"
      >
        <!-- 用户列表 -->
        <el-table
          :data="userList"
          class="flex-1"
          :fit="false"
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
              <el-tag :type="row.state === 1 ? 'success' : 'info'">
                {{ row?.state === 1 ? 'Active' : 'Disabled' }}
              </el-tag>
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
              <el-dropdown trigger="click">
                <i class="icon-more-2-line cursor-pointer" />
                <template #dropdown>
                  <el-dropdown-menu>
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
        <!-- 修理厂列表 -->
        <el-table
          :data="merchantList"
          class="flex-1"
          :fit="false"
          @sort-change="handleMerchantSortChange"
          @row-click="handleMerchantRowClick"
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
                <el-icon class="h-14 w-14"><Star /></el-icon>
                <!-- 评分 -->
                <el-text>{{ row?.rating ?? '-' }}</el-text>
              </div>
            </template>
          </el-table-column>
          <!-- 修理厂状态 -->
          <el-table-column prop="status" label="Status" min-width="18%">
            <template #default="{ row }">
              <el-tag :type="row.isDelete === 0 ? 'success' : 'info'">
                {{ row.isDelete === 0 ? 'Active' : 'Disabled' }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- 操作栏 -->
          <el-table-column min-width="6%" align="center">
            <template #default>
              <el-dropdown trigger="click">
                <i class="icon-more-2-line cursor-pointer" />
                <template #dropdown>
                  <el-dropdown-menu>
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

:deep(.el-table__header) {
  @apply w-full!;
}

:deep(.el-table__body) {
  @apply w-full!;
}
</style>
