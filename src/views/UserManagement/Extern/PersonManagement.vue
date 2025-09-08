<script setup>
import { DocumentCopy } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'

import BaseDialog from '@/components/BaseDialog.vue'
import {
  getUserInfoApi,
  getUserOBDListApi,
  getUserVehicleListApi,
} from '@/apis/userApi.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import {
  getDateWithDDMMMYYYY,
  getDateWithDDMMMYYYYhhmma,
  getLastUsedDate,
} from '../../../utils/dateUtil.js'
import BaseTag from '@/components/BaseTag.vue'

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

const dialogResetPasswordVisible = ref(false)

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

// 组件创建后, 发起请求
const {
  params: { id },
} = route

onMounted(async () => {
  userId.value = id
  await Promise.all([getUserInfo(), getUserOBDList(), getUserVehicleList()])
})
</script>

<template>
  <section class="box-border flex flex-col gap-16 overflow-auto pb-32">
    <div class="flex-between mx-32 h-32">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        Bessie Cooper
      </h3>
      <div class="flex gap-8">
        <el-button>Ban</el-button>
        <el-button>Reset Password</el-button>
        <el-button>Bind OBD</el-button>
        <el-button>View Orders</el-button>
      </div>
    </div>
    <el-divider />
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Customer Details" name="Customer Details" />
      <el-tab-pane label="OBD Devices" name="OBD Devices" />
      <el-tab-pane label="Vehicles" name="Vehicles" />
      <el-tab-pane label="Logs & Note" name="Logs & Note" />
    </el-tabs>
    <el-scrollbar>
      <div class="row-center mx-32 h-72 gap-16">
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
        class="[&>dd]:leading-32 [&>dt]:leading-32 mx-32 grid grid-cols-[112px_1fr_112px_1fr] items-center gap-x-8 gap-y-4 [&>dd]:h-32 [&>dt]:h-32"
      >
        <dt>Email</dt>
        <dd>{{ userInfo.email || '-' }}</dd>
        <dt>Registration Date</dt>
        <dd>{{ getDateWithDDMMMYYYYhhmma(userInfo.createTime) }}</dd>
        <dt>Subscription</dt>
        <dd>{{ userInfo.subscription || '-' }}</dd>
        <dt>Last Login</dt>
        <dd>{{ getLastUsedDate(userInfo.updateTime) }}</dd>
        <dt>Status</dt>
        <dd>
          <base-tag
            :color="userInfo.state === 1 ? 'green' : 'gray'"
            :text="userInfo.state === 1 ? 'Active' : 'Disabled'"
          />
        </dd>
      </dl>
      <!-- OBD Devices -->
      <div class="flex flex-col gap-8" v-if="obdDeviceList.length">
        <!-- header -->
        <div
          class="row-center heading-body-large-body-14px-medium mx-32 h-24 gap-8"
        >
          <h4 class="text-neutrals-off-black">OBD Devices</h4>
          <span class="text-neutrals-grey-3">3</span>
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
              <template #default>
                <el-button class="rounded-full!">Unbind</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- Vehicles -->
      <div class="flex flex-col gap-8" v-if="vehicleList.length">
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
                <el-button class="rounded-full!">View Details</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
            class="[&>dd]:leading-32 [&>dt]:leading-32 mx-32 grid grid-cols-[112px_1fr_112px_1fr] items-center gap-x-8 gap-y-4 [&>dd]:h-32 [&>dt]:h-32"
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
    title="Ban tim.jennings@example.com ?"
    button-type="danger"
    confirm-text="Ban"
    @cancel="dialogBanUserVisible = false"
    @confirm="dialogBanUserVisible = true"
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
    title="Unban tim.jennings@example.com ?"
    confirm-text="Unban"
    @cancel="dialogUnbanUserVisible = false"
    @confirm="dialogUnbanUserVisible = true"
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
    v-model="dialogResetPasswordVisible"
    title="Reset Password?"
    button-type="danger"
    confirm-text="Reset Password"
    @cancel="dialogResetPasswordVisible = false"
    @confirm="dialogResetPasswordVisible = true"
  >
    <template #content>
      <p class="heading-body-body-12px-medium text-neutrals-grey-3">
        Are you sure you want to reset the user's password? O
      </p>
    </template>
  </base-dialog>
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
</style>
