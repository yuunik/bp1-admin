<script setup>
import { DocumentCopy } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'

import BaseDialog from '@/components/BaseDialog.vue'
import {
  adminUserStatusApi,
  getRecordListApi,
  getRepairTotalPriceApi,
  getUserInfoApi,
  getUserOBDListApi,
  getUserVehicleListApi,
  resetUserPasswordApi,
} from '@/apis/userApi.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import {
  getDateWithDDMMMYYYY,
  getDateWithDDMMMYYYYhhmma,
  getLastUsedDate,
} from '@/utils/dateUtil.js'
import BaseTag from '@/components/BaseTag.vue'
import { RouteName } from '@/utils/constantsUtil.js'

import EmptyOBD from '@/assets/specialIcons/empty-obd.svg'
import EmptyCar from '@/assets/specialIcons/empty-car.svg'
import { unbindOBDApi } from '@/apis/obdApi.js'
import BaseFilterInput from '@/components/BaseFilterInput.vue'
import BasePagination from '@/components/BasePagination.vue'
import { useSort } from '@/composables/useSort.js'

const logAndNoteDataList = ref([
  {
    date: '15 May 2025 9:00 am',
    user: 'Rhode',
    action: 'Add Note',
    detail: 'Replenished 10 OBDs missing after stocktaking.',
  },
  {
    date: '15 May 2025 9:00 am',
    user: 'Rhode',
    action: 'Edit',
    detail: 'Change quantity from 12 to 10.',
  },
  {
    date: '15 May 2025 9:00 am',
    user: 'Rhode',
    action: 'Create Inbound Order',
    detail: 'Inbound order #IN-00017 created, added 10 OBDs to inventory.',
  },
])

const route = useRoute()

const router = useRouter()

const userInfo = reactive({})

const activeTab = ref('Customer Details')

// obd device list
const obdDeviceList = ref([])

const vehicleList = ref([])

// 当前用户 id
const userId = ref('')

const dialogUnbindOBDVisible = ref(false)

const dialogDisabledUserVisible = ref(false)

const dialogBanUserVisible = ref(false)

const dialogEnableUserVisible = ref(false)

const dialogUnbanUserVisible = ref(false)

// 重置密码确认框
const dialogResetPasswordConfirmVisible = ref(false)

// 重置密码提示框
const dialogResetPasswordVisible = ref(false)

// 重置的密码
const resetPassword = ref('')

const customDetailsRef = ref(null)

const obdDevicesRef = ref(null)

const vehiclesRef = ref(null)

const logsAndNoteRef = ref(null)

const unbindOBDDialogVisible = ref(false)

const unbindOBDId = ref('')

// 维修记录列表
const expenseRecordList = ref([])

// 输入搜索关键字
const searchKeywords = ref('')

// 复制 handleCopyTransactionID
const handleCopyTransactionID = async () => {
  try {
    await navigator.clipboard.writeText('TransactionID: 1234567890 ')
    ElMessage.success('Copied to clipboard')
  } catch (error) {
    console.log(error)
  }
}

// 获取用户详情
const getUserInfo = async () => {
  const { data } = await getUserInfoApi(userId.value)
  Object.assign(userInfo, data)
}

// 获取用户已绑定的OBD列表
const getUserOBDList = async () => {
  const { data } = await getUserOBDListApi(userId.value)
  obdDeviceList.value = data
}

// 获取用户已绑定的车辆列表
const getUserVehicleList = async () => {
  const { data } = await getUserVehicleListApi(userId.value)
  vehicleList.value = data
}

// avatar加载的错误行为
const avatarErrorHandler = () => true

// 管理员禁用、解禁用户
const handleUserStatus = async () => {
  try {
    await adminUserStatusApi(userId.value)
    // 提示
    ElMessage.success('Success')
    // 刷新列表
    initData()
  } finally {
    // 关闭解禁用户弹窗
    dialogUnbanUserVisible.value && (dialogUnbanUserVisible.value = false)
    // 关闭禁用用户弹窗
    dialogBanUserVisible.value && (dialogBanUserVisible.value = false)
  }
}

// 刷新页面
const initData = async () =>
  await Promise.all([
    getUserInfo(),
    getUserOBDList(),
    getUserVehicleList(),
    getUserRepairRecordList(),
    getUserExpenseTotalPrice(),
  ])

// 重置用户密码
const handleResetPassword = async () => {
  const { data } = await resetUserPasswordApi(userId.value)
  ElMessage.success('Reset password successfully')
  // 记录重置的用户密码
  resetPassword.value = data
  // 关闭重置密码弹窗
  dialogResetPasswordConfirmVisible.value = false
  // 打开重置密码提示弹窗
  dialogResetPasswordVisible.value = true
}

// 复制重置密码等信息
const handleCopyResetPassword = async () => {
  try {
    // 复制
    await navigator.clipboard.writeText(
      `Person name: ${userInfo.name}\n Email: ${userInfo.email} \n Password: ${resetPassword.value}`,
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

// 查看 OBD 绑定的车辆详情
const handleViewVehicleDetails = async (id) =>
  router.push({ name: RouteName.VIEW_VEHICLE, params: { id: id } })

// 监听 tab 切换
watch(activeTab, (val) => {
  if (val === 'OBD Devices') {
    obdDevicesRef.value.scrollIntoView({ behavior: 'smooth' })
  } else if (val === 'Vehicles') {
    vehiclesRef.value.scrollIntoView({ behavior: 'smooth' })
  } else if (val === 'Logs & Note') {
    logsAndNoteRef.value.scrollIntoView({ behavior: 'smooth' })
  } else if (val === 'Customer Details') {
    customDetailsRef.value.scrollIntoView({ behavior: 'smooth' })
  }
})

const sectionMap = [
  { key: 'Customer Details', ref: customDetailsRef },
  { key: 'OBD Devices', ref: obdDevicesRef },
  { key: 'Vehicles', ref: vehiclesRef },
  { key: 'Logs & Note', ref: logsAndNoteRef },
]

const scrollbarRef = ref()

// 排序参数
const conditionParams = reactive({
  sortBy: '',
  sort: '',
})

// 分页查询条件
const expenseRecordPagination = reactive({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

// 用户维修总价
const repairTotalPrice = ref(0)

const handleScroll = () => {
  // const scrollTop = scrollbarRef.value?.wrapRef
}

// 打开解绑 OBD 对话框
const handleOpenUnbindOBDDialog = (obdId) => {
  unbindOBDId.value = obdId
  unbindOBDDialogVisible.value = true
}

// 解绑 OBD
const handleUnbindOBD = async () => {
  try {
    await unbindOBDApi(unbindOBDId.value)
    ElMessage.success('Unbind success')
    initData()
  } finally {
    unbindOBDDialogVisible.value = false
  }
}
// 获取用户的维修记录
const getUserRepairRecordList = async () => {
  const { data, count } = await getRecordListApi({
    userId: userId.value,
    page: expenseRecordPagination.currentPage,
    pageSize: expenseRecordPagination.pageSize,
    beginTime: '',
    endTime: '',
    minPrice: '',
    maxPrice: '',
    sortBy: conditionParams.sortBy,
    sort: conditionParams.sort,
    vehicleId: '',
    searchKey: searchKeywords.value,
  })
  expenseRecordList.value = data
  expenseRecordPagination.total = count
}

// 刷新页面
const refresh = () => {
  if (!expenseRecordPagination.currentPage) {
    return getUserRepairRecordList()
  }
  expenseRecordPagination.currentPage === 0
}

//  获取用户维修总价
const getUserExpenseTotalPrice = async () => {
  const {
    data: { total },
  } = await getRepairTotalPriceApi(userId.value)
  repairTotalPrice.value = total
}

// 排序
const handleSearchBySort = useSort(conditionParams, () =>
  getUserRepairRecordList(),
)

// 查看维修记录的详情
const handleViewExpenseRecord = (row) =>
  router.push({
    name: RouteName.EXPENSE_RECORD_DETAILS,
    params: { id: row.id },
  })

// 组件创建后, 发起请求
const {
  params: { id },
} = route

// 监听分页页码改变
watch(
  () => expenseRecordPagination.current,
  () => getUserRepairRecordList(),
)

onMounted(async () => {
  userId.value = id
  initData()
})
</script>

<template>
  <section class="box-border flex h-full flex-col gap-16 overflow-auto pb-32">
    <div class="flex-between mx-32 h-32">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        {{ userInfo.name || '-' }}
      </h3>
      <div class="flex gap-8">
        <!-- state 为 1, 则用户账号状态正常 -->
        <el-button
          v-if="userInfo.state === 1"
          @click="dialogBanUserVisible = true"
        >
          Ban
        </el-button>
        <!-- state 不为 1, 则用户账号状态异常 -->
        <el-button
          v-if="userInfo.state === 2"
          @click="dialogUnbanUserVisible = true"
        >
          Unban
        </el-button>
        <el-button
          v-if="userInfo.state !== 0"
          @click="dialogResetPasswordConfirmVisible = true"
        >
          Reset Password
        </el-button>
        <!--<el-button>Bind OBD</el-button>-->
        <!--<el-button>View Orders</el-button>-->
      </div>
    </div>
    <el-tabs v-model="activeTab" class="has-top">
      <el-tab-pane label="Customer Details" name="Customer Details" />
      <el-tab-pane label="Expense Records" name="Expense Records" />
      <el-tab-pane label="OBD Devices" name="OBD Devices" />
      <el-tab-pane label="Vehicles" name="Vehicles" />
      <el-tab-pane
        label="Logs & Note"
        name="Logs & Note"
        v-if="logAndNoteDataList.length"
      />
    </el-tabs>
    <el-scrollbar @scroll="handleScroll" ref="scrollbarRef">
      <div class="row-center mx-32 h-72 gap-16" ref="customDetailsRef">
        <el-avatar
          :size="40"
          :src="getFullFilePath(userInfo.logo)"
          @error="avatarErrorHandler"
        >
          user
        </el-avatar>
        <span class="heading-body-large-body-14px-medium text-strong-950">
          {{ userInfo.name || '-' }}
        </span>
      </div>
      <dl
        class="[&>dd]:leading-32 [&>dt]:leading-32 mx-32 grid grid-cols-[122px_1fr_122px_1fr] items-center gap-x-8 gap-y-4 [&>dd]:h-32 [&>dt]:h-32"
      >
        <dt>Email</dt>
        <dd>{{ userInfo.email || '-' }}</dd>
        <dt>Registration Date</dt>
        <dd>{{ getDateWithDDMMMYYYYhhmma(userInfo.createTime) }}</dd>
        <dt>Subscription</dt>
        <dd>{{ userInfo.subscription || '-' }}</dd>
        <dt>Last Login</dt>
        <dd>{{ getLastUsedDate(userInfo.updateTime) }}</dd>
        <dt>Token Usage</dt>
        <dd>{{ userInfo.haveAiCount }} / {{ userInfo.totalAiCount }}</dd>
        <dt>Status</dt>
        <dd>
          <base-tag
            :color="userInfo.state === 1 ? 'green' : 'gray'"
            :text="userInfo.state === 1 ? 'Active' : 'Disabled'"
          />
        </dd>
      </dl>
      <!-- Expense Records -->
      <div class="flex flex-col gap-8">
        <!-- header -->
        <div
          class="row-center heading-body-large-body-14px-medium mx-32 h-24 gap-8"
        >
          <h4 class="text-neutrals-off-black">Expense Records</h4>
          <span class="text-neutrals-grey-3">
            {{ expenseRecordList.length }}
          </span>
        </div>
        <el-divider />
        <!-- info -->
        <dl
          class="[&>dd]:leading-32 [&>dt]:leading-32 mx-32 grid grid-cols-[122px_1fr] items-center gap-4 [&>dd]:h-32 [&>dt]:h-32"
        >
          <dt>Total Cost</dt>
          <dd>{{ repairTotalPrice ? `$ ${repairTotalPrice}` : '-' }}</dd>
          <dt>AI Insights</dt>
          <dd>-</dd>
        </dl>
        <!-- table -->
        <div class="mx-32">
          <el-divider />
          <!-- 输入搜索 -->
          <base-filter-input
            class="h-32"
            v-model="searchKeywords"
            @inputChange="refresh"
          />
          <el-divider />
          <el-table
            :data="expenseRecordList"
            class="clickable-row"
            @row-click="handleViewExpenseRecord"
            @sort-change="handleSearchBySort"
          >
            <el-table-column prop="workshop" label="Workshop" min-width="50%">
              <template #default="{ row }">
                <el-avatar
                  v-if="row.merchantDto?.logo"
                  fit="cover"
                  :src="getFullFilePath(row.merchantDto?.logo)"
                  class="mr-8 h-20 w-20"
                  alt="brand icon"
                  shape="circle"
                  :size="20"
                  @error="() => true"
                >
                  <template #error>
                    <i class="i-ep:picture" />
                  </template>
                </el-avatar>
                <el-text>{{ row.merchantDto?.name || '-' }}</el-text>
              </template>
            </el-table-column>
            <el-table-column
              prop="amount"
              label="Total Amount"
              align="center"
              min-width="25%"
              sortable="custom"
            >
              <template #default="{ row }">
                <el-text>
                  {{ row.totalCost ? `$${row.totalCost}` : '-' }}
                </el-text>
              </template>
            </el-table-column>
            <el-table-column
              prop="Date"
              label="Date"
              min-width="25%"
              sortable="custom"
            >
              <template #default="{ row }">
                <el-text>
                  {{ getDateWithDDMMMYYYYhhmma(row.createTime) }}
                </el-text>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty description="No expense record data" />
            </template>
          </el-table>
          <base-pagination v-model="expenseRecordPagination" />
        </div>
      </div>
      <!-- OBD Devices -->
      <div class="flex flex-col gap-8" ref="obdDevicesRef">
        <!-- header -->
        <div
          class="row-center heading-body-large-body-14px-medium mx-32 h-24 gap-8"
        >
          <h4 class="text-neutrals-off-black">OBD Devices</h4>
          <span class="text-neutrals-grey-3">{{ obdDeviceList.length }}</span>
        </div>
        <el-divider />
        <!-- table -->
        <div class="mx-32">
          <el-table :data="obdDeviceList">
            <el-table-column type="index" label="No." />
            <el-table-column prop="model" label="Model">
              <template #default="{ row }">
                <span
                  class="heading-body-body-12px-regular text-neutrals-off-black"
                >
                  PD-1
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="sn" label="SN" />
            <el-table-column prop="useTime" label="Last Used">
              <template #default="{ row }">
                <span
                  class="heading-body-body-12px-regular text-neutrals-off-black"
                >
                  {{ getLastUsedDate(row.useTime) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="vehicle" label="Vehicle">
              <template #default="{ row }">
                <span
                  class="heading-body-body-12px-regular text-neutrals-off-black"
                >
                  {{
                    `${row.vehicleDto?.brand} ${row.vehicleDto?.model}` || '-'
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="{ row }">
                <el-button
                  class="rounded-full!"
                  @click.stop="handleOpenUnbindOBDDialog(row.id)"
                >
                  Unbind
                </el-button>
              </template>
            </el-table-column>
            <template #empty>
              <div class="mt-20 flex flex-col items-center">
                <el-image :src="EmptyOBD" class="w-120 h-120" fit="cover" />
                <span class="text-neutrals-grey-3">No OBD Devices</span>
              </div>
            </template>
          </el-table>
        </div>
      </div>
      <!-- Vehicles -->
      <div class="flex flex-col gap-8" ref="vehiclesRef">
        <!-- header -->
        <h4
          class="row-center heading-body-large-body-14px-medium text-neutrals-off-black mx-32 h-24"
        >
          Vehicles
        </h4>
        <el-divider />
        <!-- table -->
        <div class="mx-32">
          <el-table :data="vehicleList">
            <el-table-column type="index" label="No." />
            <el-table-column prop="brand" label="Brand">
              <template #default="{ row }">
                <span
                  class="heading-body-body-12px-regular text-neutrals-off-black"
                >
                  {{ row.brand || '-' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="model" label="Model">
              <template #default="{ row }">
                <span
                  class="heading-body-body-12px-regular text-neutrals-off-black"
                >
                  {{ row.brand || '-' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="year" label="Year">
              <template #default="{ row }">
                <span
                  class="heading-body-body-12px-regular text-neutrals-off-black"
                >
                  {{ row.model || '-' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="vin" label="VIN">
              <template #default="{ row }">
                <span
                  class="heading-body-body-12px-regular text-neutrals-off-black"
                >
                  {{ row.vin || '-' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="OBDDto" label="Bind Date">
              <template #default="{ row }">
                <span
                  class="heading-body-body-12px-regular text-neutrals-off-black"
                >
                  {{ getDateWithDDMMMYYYY(row.OBDDto?.bindingTime) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="{ row }">
                <el-button
                  class="rounded-full!"
                  @click.stop="handleViewVehicleDetails(row.id)"
                >
                  View Details
                </el-button>
              </template>
            </el-table-column>
            <template #empty>
              <div class="mt-20 flex flex-col items-center">
                <el-image :src="EmptyCar" class="w-100 h-100" fit="cover" />
                <span class="text-neutrals-grey-3">No Vehicles</span>
              </div>
            </template>
          </el-table>
        </div>
      </div>
      <!-- logs & note -->
      <div
        class="flex flex-col gap-8"
        v-if="logAndNoteDataList.length"
        ref="logsAndNoteRef"
      >
        <!-- header -->
        <div class="flex-between mx-32 h-24">
          <!-- header -->
          <h4
            class="row-center heading-body-large-body-14px-medium text-neutrals-off-black h-24"
          >
            Logs & Note
          </h4>
          <!-- 新增按钮 -->
          <!--<el-button type="primary" text class="my-8 w-fit">-->
          <!--  <template #icon>-->
          <!--    <i class="icon-typesadd branding-colours-primary" />-->
          <!--  </template>-->
          <!--  <template #default>New Note</template>-->
          <!--</el-button>-->
        </div>
        <el-divider />
        <!-- table -->
        <div class="mx-32">
          <el-table :data="logAndNoteDataList" class="log-table-container">
            <el-table-column prop="date" label="Date" />
            <el-table-column prop="user" label="User" />
            <el-table-column prop="action" label="Action" />
            <el-table-column prop="detail" label="Detail" />
          </el-table>
        </div>
      </div>
      <!-- Subscription -->
      <div class="flex flex-col gap-8">
        <h4
          class="heading-body-large-body-14px-medium text-neutrals-off-black mx-32 h-24"
        >
          Subscription
        </h4>
        <el-divider />
        <!-- table -->
        <div class="mx-32">
          <dl
            class="[&>dd]:leading-32 [&>dt]:leading-32 [&>dd]:text-gray gray-container mx-32 grid grid-cols-[132px_1fr_132px_1fr] items-center gap-x-8 gap-y-4 [&>dd]:h-32 [&>dt]:h-32"
          >
            <dt>Plan</dt>
            <dd>Monthly</dd>
            <dt>Status</dt>
            <dd>
              <el-tag type="success">Active</el-tag>
            </dd>
            <dt>Effective Date</dt>
            <dd>04 Apr 2025 4:23pm</dd>
            <dt>Expiry Date</dt>
            <dd>03 May 2025 4:23pm</dd>
            <dt>Payment Method</dt>
            <dd>Apple Pay</dd>

            <dt>Auto -Renewal</dt>
            <dd>No</dd>
            <dt>Gateway</dt>
            <dd>Stripe</dd>
            <dt>Transaction ID</dt>
            <dd>
              <span>1234567890</span>
              <el-icon
                class="ml-4 h-16 w-16 cursor-pointer"
                @click="handleCopyTransactionID"
              >
                <document-copy />
              </el-icon>
            </dd>
          </dl>
        </div>
      </div>
    </el-scrollbar>
  </section>
  <!-- Unbind -->
  <base-dialog
    v-model="dialogUnbindOBDVisible"
    title="Unbind OBD ?"
    button-type="danger"
    confirm-text="Unbind"
    @cancel="dialogUnbindOBDVisible = false"
    @confirm="dialogUnbindOBDVisible = true"
  >
    <template #content>
      <p class="heading-body-body-12px-medium text-neutrals-grey-3">
        You are about to unbind this customer's OBD device. Once unbound, the
        device will no longer be linked to this account or transmit data. Are
        you sure you want to proceed?
      </p>
    </template>
  </base-dialog>
  <!-- Disabled -->
  <base-dialog
    v-model="dialogDisabledUserVisible"
    title="Disable tim.jennings@example.com ?"
    button-type="danger"
    confirm-text="Disable"
    @cancel="dialogDisabledUserVisible = false"
    @confirm="dialogDisabledUserVisible = true"
  >
    <template #content>
      <p class="heading-body-body-12px-medium text-neutrals-grey-3">
        Are you sure you want to disable this account? Once disabled, the user
        will no longer have access to their account until re-enabled.
      </p>
    </template>
  </base-dialog>
  <!-- Ban -->
  <base-dialog
    v-model="dialogBanUserVisible"
    :title="`Ban ${userInfo.email} ?`"
    button-type="danger"
    confirm-text="Ban"
    @cancel="dialogBanUserVisible = false"
    @confirm="handleUserStatus"
  >
    <template #content>
      <p class="heading-body-body-12px-medium text-neutrals-off-black">
        Are you sure you want to ban this account? Once banned, the user will be
        permanently blocked from accessing the app.
      </p>
    </template>
  </base-dialog>
  <!-- Enable -->
  <base-dialog
    v-model="dialogEnableUserVisible"
    title="Enable tim.jennings@example.com ?"
    confirm-text="Enable"
    @cancel="dialogEnableUserVisible = false"
    @confirm="dialogEnableUserVisible = true"
  >
    <template #content>
      <p class="heading-body-body-12px-medium text-neutrals-grey-3">
        Are you sure you want to enable this account?
      </p>
    </template>
  </base-dialog>
  <!-- Unban -->
  <base-dialog
    v-model="dialogUnbanUserVisible"
    :title="`Unban ${userInfo.email}?`"
    confirm-text="Unban"
    @cancel="dialogUnbanUserVisible = false"
    @confirm="handleUserStatus"
  >
    <template #content>
      <p class="heading-body-body-12px-medium text-neutrals-grey-3">
        Are you sure you want to unban this account?
      </p>
    </template>
  </base-dialog>
  <!-- Unbind -->
  <base-dialog
    v-model="dialogUnbindOBDVisible"
    title="Unbind OBD ?"
    button-type="danger"
    confirm-text="Unbind"
    @cancel="dialogUnbindOBDVisible = false"
    @confirm="dialogUnbindOBDVisible = true"
  >
    <template #content>
      <p class="heading-body-body-12px-medium text-neutrals-off-black">
        You are about to unbind this customer's OBD device. Once unbound, the
        device will no longer be linked to this account or transmit data. Are
        you sure you want to proceed?
      </p>
    </template>
  </base-dialog>
  <!-- Reset Password -->
  <base-dialog
    v-model="dialogResetPasswordConfirmVisible"
    title="Reset Password?"
    button-type="danger"
    confirm-text="Reset Password"
    @cancel="dialogResetPasswordConfirmVisible = false"
    @confirm="handleResetPassword"
  >
    <template #content>
      <p class="heading-body-body-12px-medium text-neutrals-grey-3">
        Are you sure you want to reset the user's password?
      </p>
    </template>
  </base-dialog>
  <!-- 重置密码提示弹窗 -->
  <base-dialog
    v-model="dialogResetPasswordVisible"
    title="Reset Password"
    @cancel="dialogResetPasswordVisible = false"
    @confirm="handleCopyResetPassword"
    confirm-text="Copy"
  >
    <template #content>
      <dl
        class="[&>dt]:leading-80 grid grid-cols-[100px_1fr] items-center gap-x-8 [&>dt]:h-80"
      >
        <dt>Person name</dt>
        <dd>{{ userInfo.name }}</dd>
        <dt>Email</dt>
        <dd>{{ userInfo.email }}</dd>
        <dt>Password</dt>
        <dd>{{ resetPassword }}</dd>
      </dl>
    </template>
  </base-dialog>
  <!-- 解绑OBD -->
  <el-dialog
    v-model="unbindOBDDialogVisible"
    title="Unbind OBD ?"
    align-center
    width="304"
    :show-close="false"
  >
    <div class="flex flex-col gap-16">
      <p class="heading-body-body-12px-regular text-neutrals-grey-3">
        You are about to unbind this user's OBD device. Once unbound, the device
        will no longer be linked to this account or transmit data. Are you sure
        you want to proceed?
      </p>
      <el-divider />
      <div class="flex-between flex gap-16">
        <el-button class="flex-1" @click="unbindOBDDialogVisible = false">
          Cancel
        </el-button>
        <el-button type="danger" class="flex-1" @click="handleUnbindOBD">
          Unbind
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.userInfo-container :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

.userInfo-container :deep(.el-input__wrapper::after) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--el-input-border-color, var(--el-border-color));
  pointer-events: none;
}

.userInfo-container :deep(.el-select__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

.userInfo-container :deep(.el-select__wrapper::after) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--el-input-border-color, var(--el-border-color));
  pointer-events: none;
}

// 滚动条内部的样式
:deep(.el-scrollbar__view) {
  @apply flex flex-col gap-16;
}

/* TODO 无日志数据, 文字暂时置灰 */
.log-table-container {
  :deep(.el-table__row) {
    @apply text-neutrals-grey-2;
  }
}

.gray-container {
  & > * {
    @apply text-neutrals-grey-2;
  }
}
</style>
