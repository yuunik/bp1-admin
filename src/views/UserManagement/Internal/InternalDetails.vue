<script setup>
import { useRoute } from 'vue-router'

import {
  adminInfoApi,
  adminStatusApi,
  editAdminInfoApi,
} from '@/apis/userCenterApi.js'
import { ElMessage } from 'element-plus'
import { useDebounceFn } from '@vueuse/core'
import { TimingPreset } from '@/utils/constantsUtil.js'
import BaseTag from '@/components/BaseTag.vue'

// 获取路由
const route = useRoute()

const emit = defineEmits(['openResetPasswordDialog'])

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

// 管理员信息
const adminDetails = ref({})

// 表单数据
const formRef = ref(null)

const buttonText = computed(() =>
  adminDetails.value.state === 1 ? 'Disable' : 'Enable',
)

// 账号状态(1 为正常, 2 为禁用)
const isActive = ref(-1)

// 表单校验规则
const adminInfoFormRules = reactive({
  name: [
    { required: true, message: 'Please enter your name', trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    {
      type: 'email',
      message: 'Please enter a valid email',
      trigger: ['blur', 'change'],
    },
  ],
  role: [
    { required: true, message: 'Please select your role', trigger: 'change' },
  ],
  status: [
    { required: true, message: 'Please select your status', trigger: 'change' },
  ],
})

// 获取管理员信息
const getAdminInfo = async (id) => {
  const { data } = await adminInfoApi(id)
  adminDetails.value = { ...data, isEditing: false }
  // 记录原有管理员账号状态
  isActive.value = adminDetails.value.state
}

// 禁用管理员
const disableAdmin = useDebounceFn(async () => {
  await adminStatusApi(adminDetails.value.id)
  // 提示
  ElMessage.success(`${buttonText.value} successfully`)
  getAdminInfo(adminDetails.value.id)
}, TimingPreset.DEBOUNCE)

// 编辑管理员信息
const editAdminInfo = async () => {
  // 表单校验
  await formRef.value.validate()
  try {
    // 比较新的管理员账号状态
    if (isActive.value === adminDetails.value.state) {
      // 修改管理员信息
      await Promise.all([
        editAdminInfoApi({
          name: adminDetails.value.name,
          userId: adminDetails.value.id,
        }),
      ])
    } else {
      // 修改管理员信息与账号状态
      await Promise.all([
        editAdminInfoApi({
          name: adminDetails.value.name,
          userId: adminDetails.value.id,
        }),
        adminStatusApi(adminDetails.value.id),
      ])
    }
    // 提示
    ElMessage.success('Modify successfully')
    getAdminInfo()
  } finally {
    // 关闭编辑状态
    adminDetails.value.isEditing = false
  }
}

// 打开重置密码弹窗
const openResetPasswordDialog = useDebounceFn(() => {
  emit('openResetPasswordDialog', adminDetails.value)
}, TimingPreset.DEBOUNCE)

// 组件创建时, 获取路径参数
const {
  params: { id },
} = route

if (id) {
  // 路径存在 id,获取数据
  getAdminInfo(id)
}
</script>

<template>
  <section class="flex h-full flex-col gap-16 overflow-auto">
    <div class="flex-between mx-32 h-32">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        {{ adminDetails.name }}
      </h3>
      <div class="flex gap-8">
        <template v-if="!adminDetails.isEditing">
          <el-button @click="disableAdmin">
            {{ buttonText }}
          </el-button>
          <el-button @click="openResetPasswordDialog">Reset Password</el-button>
          <el-button type="primary" @click="adminDetails.isEditing = true">
            Edit
          </el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="editAdminInfo">Save</el-button>
        </template>
      </div>
    </div>
    <el-divider />
    <dl
      class="[&>dd]:leading-32 [&>dt]:leading-32 mx-32 grid grid-cols-[112px_1fr_112px_1fr] items-center gap-x-8 gap-y-4 [&>dd]:h-32 [&>dt]:h-32"
      v-if="!adminDetails.isEditing"
    >
      <dt>Name</dt>
      <dd>{{ adminDetails.name }}</dd>

      <dt>Email</dt>
      <dd>{{ adminDetails.email }}</dd>
      <dt>Role</dt>
      <dd>{{ adminDetails.role }}</dd>
      <dt>Phone</dt>
      <dd>{{ adminDetails.phone || '-' }}</dd>
      <dt>Status</dt>
      <dd>
        <!-- state 为 0, 为 Disabled, state 为 1 , 则 Active -->
        <el-tag :type="adminDetails.state === 1 ? 'success' : 'danger'">
          {{ adminDetails.state === 1 ? 'Active' : 'Disabled' }}
        </el-tag>
      </dd>
    </dl>
    <el-form
      :model="adminDetails"
      label-width="112px"
      label-position="left"
      class="form-container mx-32"
      :rules="adminInfoFormRules"
      ref="formRef"
      require-asterisk-position="right"
      v-else
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Name" prop="name">
            <el-input v-model="adminDetails.name" placeholder="Enter name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Email" prop="email">
            <el-input v-model="adminDetails.email" readonly />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Role" prop="role">
            <el-select
              v-model="adminDetails.role"
              placeholder="Select role"
              style="width: 100%"
            >
              <el-option label="Admin" value="Admin" />
              <el-option label="Support" value="Support" />
              <el-option label="Support" value="Support" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Phone">
            <el-input v-model="adminDetails.phoneNumber" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Status" class="label-required">
            <el-select
              v-model="adminDetails.state"
              placeholder="Select category"
            >
              <template #label="{ value }">
                <!-- state 为 0, 为 Disabled, state 为 1 , 则 Active -->
                <base-tag
                  :color="value === 1 ? 'green' : 'red'"
                  :text="value === 1 ? 'Active' : 'Disabled'"
                />
              </template>
              <el-option label="Active" :value="1" />
              <el-option label="Disabled" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- logs & note -->
    <div class="flex flex-col gap-8" v-if="logAndNoteDataList.length">
      <!-- header -->
      <div class="flex-between mx-32 h-24">
        <h4>Logs & Note</h4>
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
        <el-table :data="logAndNoteDataList" class="get-gray">
          <el-table-column prop="date" label="Date" />
          <el-table-column prop="user" label="User" />
          <el-table-column prop="action" label="Action" />
          <el-table-column prop="detail" label="Detail" />
        </el-table>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.form-container :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

.form-container :deep(.el-input__wrapper::after) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--el-input-border-color, var(--el-border-color));
  pointer-events: none;
}

.form-container :deep(.el-select__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

.form-container :deep(.el-select__wrapper::after) {
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
