<script setup>
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'

import BaseDialog from '@/components/BaseDialog.vue'
import {
  adminUserStatusApi,
  getMerchantInfoApi,
  getUserOBDListApi,
  getUserVehicleListApi,
  resetUserPasswordApi,
} from '@/apis/userApi.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import { getDateWithDDMMMYYYYhhmma, getLastUsedDate } from '@/utils/dateUtil.js'
import BaseTag from '@/components/BaseTag.vue'

import StarIcon from '@/assets/specialIcons/fi_star.svg'

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

const dataDetails = ref({
  name: 'Theresa Webb',
  email: 'tim.jennings@example.com',
  role: 'Support',
  phone: '+65 9876 5432',
  status: 'Active',
  isEditing: false,
})

const route = useRoute()

const workshop = reactive({})

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
  const { data } = await getMerchantInfoApi(userId.value)
  Object.assign(workshop, data)
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
  await adminUserStatusApi(userId.value)
  // 提示
  ElMessage.success('Success')
  // 刷新列表
  initData()
}

// 刷新页面
const initData = async () => {
  await Promise.all([getUserInfo()])
}

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
      `Person name: ${workshop.name}\n Email: ${workshop.email} \n Password: ${resetPassword.value}`,
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

// 组件创建后, 发起请求
const {
  params: { id },
} = route

onMounted(async () => {
  userId.value = id
  initData()
})
</script>

<template>
  <section class="box-border flex flex-col gap-16 overflow-auto pb-32">
    <div class="flex-between mx-32 h-32">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        Bessie Cooper
      </h3>
      <div class="flex gap-8">
        <!-- state 为 1, 则用户账号状态正常 -->
        <!--<el-button-->
        <!--  v-if="workshop.state === 1"-->
        <!--  @click="dialogBanUserVisible = true"-->
        <!--&gt;-->
        <!--  Ban-->
        <!--</el-button>-->
        <!--&lt;!&ndash; state 不为 1, 则用户账号状态异常 &ndash;&gt;-->
        <!--<el-button v-else @click="dialogUnbanUserVisible = true">-->
        <!--  Unban-->
        <!--</el-button>-->
        <!--<el-button @click="dialogResetPasswordConfirmVisible = true">-->
        <!--  Reset Password-->
        <!--</el-button>-->
        <el-button>Disable</el-button>
        <el-button>Reset Password</el-button>
      </div>
    </div>
    <el-divider />
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Customer Details" name="Customer Details" />
      <el-tab-pane label="Logs & Note" name="Logs & Note" />
    </el-tabs>
    <el-scrollbar>
      <div class="row-center mx-32 h-72 gap-16">
        <el-avatar
          :size="40"
          :src="getFullFilePath(workshop.userDto?.logo)"
          @error="avatarErrorHandler"
        >
          w
        </el-avatar>
        <span class="heading-body-large-body-14px-medium text-strong-950">
          {{ workshop.userDto?.name || '-' }}
        </span>
      </div>
      <dl
        class="[&>dd]:leading-32 [&>dt]:leading-32 mx-32 grid grid-cols-[112px_1fr_112px_1fr] items-center gap-x-8 gap-y-4 [&>dd]:h-32 [&>dt]:h-32"
      >
        <dt>Email</dt>
        <dd>{{ workshop.userDto?.email || '-' }}</dd>
        <dt>Registration Date</dt>
        <dd>{{ getDateWithDDMMMYYYYhhmma(workshop.createTime) }}</dd>
        <dt>Review</dt>
        <dd class="row-center gap-8">
          <el-image :src="StarIcon" size="14" class="row-center!" />
          <span class="heading-body-body-12px-regular text-neutrals-grey-4">
            {{ workshop.rating || '-' }}
          </span>
        </dd>
        <dt>Last Login</dt>
        <dd>{{ getLastUsedDate(workshop.updateTime) }}</dd>
        <dt>Status</dt>
        <dd>
          <base-tag
            :color="workshop.userDto?.state === 1 ? 'green' : 'gray'"
            :text="workshop.userDto?.state === 1 ? 'Active' : 'Disabled'"
          />
        </dd>
      </dl>
      <!-- Workshop Details -->
      <div class="flex flex-col gap-8">
        <!-- header -->
        <h4
          class="text-neutrals-off-black row-center heading-body-large-body-14px-medium mx-32 h-24 gap-8"
        >
          Workshop Details
        </h4>
        <el-divider />
        <!-- INFO -->
        <dl
          class="[&>dd]:leading-32 [&>dt]:leading-32 mx-32 grid grid-cols-[112px_1fr_112px_1fr] items-center gap-x-8 gap-y-4 [&>dd]:h-32 [&>dt]:h-32"
        >
          <dt>Operating Hours</dt>
          <dd>{{ workshop.userDto?.email || '-' }}</dd>
          <dt>Operating Hours</dt>
          <dd>{{ getDateWithDDMMMYYYYhhmma(workshop.createTime) }}</dd>
          <dt>Address</dt>
          <dd>{{ workshop.userDto?.businessHours || '-' }}</dd>
          <dt>UNE</dt>
          <dd>{{ workshop.userDto?.UEN || '-' }}</dd>
        </dl>
      </div>
      <!-- logs & note -->
      <div class="flex flex-col gap-8" v-if="logAndNoteDataList.length">
        <!-- header -->
        <div class="flex-between mx-32 h-24">
          <!-- header -->
          <h4
            class="row-center heading-body-large-body-14px-medium text-neutrals-off-black h-24"
          >
            Logs & Note
          </h4>
          <!-- 新增按钮 -->
          <el-button type="primary" text class="my-8 w-fit">
            <template #icon>
              <i class="icon-typesadd branding-colours-primary" />
            </template>
            <template #default>New Note</template>
          </el-button>
        </div>
        <el-divider />
        <!-- table -->
        <div class="mx-32">
          <el-table :data="logAndNoteDataList">
            <el-table-column prop="date" label="Date" />
            <el-table-column prop="user" label="User" />
            <el-table-column prop="action" label="Action" />
            <el-table-column prop="detail" label="Detail" />
          </el-table>
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
    :title="`Ban ${workshop.email} ?`"
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
    :title="`Unban ${workshop.email}?`"
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
        <dd>{{ workshop.name }}</dd>
        <dt>Email</dt>
        <dd>{{ workshop.email }}</dd>
        <dt>Password</dt>
        <dd>{{ resetPassword }}</dd>
      </dl>
    </template>
  </base-dialog>
</template>

<style scoped lang="scss">
.workshop-container :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

.workshop-container :deep(.el-input__wrapper::after) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--el-input-border-color, var(--el-border-color));
  pointer-events: none;
}

.workshop-container :deep(.el-select__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

.workshop-container :deep(.el-select__wrapper::after) {
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
</style>
