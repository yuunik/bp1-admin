<script setup>
import { storeToRefs } from 'pinia'

import BaseUpload from '@/components/BaseUpload.vue'
import { useUserStore } from '@/store/index.js'
import { editAdminInfoApi, uploadAdminLogoApi } from '@/apis/userCenterApi.js'
import { ElMessage } from 'element-plus'

const activeTab = ref('Profile Settings')

const form = reactive({
  username: '',
  file: null,
})

const isEmailNotificationOn = ref(false)

const isPushNotificationOn = ref(false)

// 表单校验
const formRules = {
  username: [
    {
      required: true,
      message: 'Please enter your full name.',
      trigger: 'blur',
    },
  ],
}

const userStore = useUserStore()

// 获取用户名字缩写
const { usernameAbbr, userRole, username, userAvatar } = storeToRefs(userStore)
// 获取用户名
form.username = username.value

// 获取上传的本地文件
const handleGetLocalFile = (file) => (form.file = file)

// 编辑管理员信息
const handleModifyAdminInfo = async () => {
  // 验证名字
  if (!form.username) {
    ElMessage.warning('Please enter the username')
    return
  }
  // 上传管理员头像及修改管理员信息
  await Promise.all([
    form.file && uploadAdminLogoApi(form.file),
    editAdminInfoApi({ name: form.username, userId: '' }),
    userStore.fetchGetUserInfo(),
  ])
  // 重新获取管理员信息
  await userStore.fetchGetUserInfo()
  // 提示
  ElMessage.success('Modify successfully')
}
</script>

<template>
  <section class="flex h-full flex-col gap-16">
    <!-- Forum Management Header -->
    <div class="px-32">
      <!-- 标题 -->
      <h3 class="heading-h2-20px-medium">Settings</h3>
    </div>
    <!-- 分割线 -->
    <el-divider class="diver" />
    <!-- tabs 栏 -->
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Profile Settings" name="Profile Settings" />
      <el-tab-pane label="Notification Settings" name="Notification Settings" />
    </el-tabs>
    <!-- tab 内容区 -->
    <template v-if="activeTab === 'Profile Settings'">
      <div class="px-32 py-16">
        <!-- 上传 logo -->
        <base-upload
          :default-avatar-text="usernameAbbr"
          :img-path="userAvatar"
          @get-local-file="handleGetLocalFile"
        />
        <!-- 分割线 -->
        <el-divider class="divider w-360! my-24!" />
        <!-- 表单 -->
        <el-form
          :model="form"
          label-width="112px"
          class="user-form-container"
          label-position="left"
          :rules="formRules"
        >
          <!-- 用户名 -->
          <el-form-item label="Full Name" prop="username">
            <el-input v-model="form.username" class="w-240!" />
          </el-form-item>
          <!-- 角色 -->
          <el-form-item label="Role">
            <el-input v-model="userRole" class="w-240!" disabled />
          </el-form-item>
        </el-form>
        <!-- 按键组 -->
        <div class="w-360 mt-24 flex gap-8">
          <el-button class="flex-1">Discard</el-button>
          <el-button
            class="flex-1"
            type="primary"
            @click="handleModifyAdminInfo"
          >
            Apply Changes
          </el-button>
        </div>
      </div>
    </template>
    <template v-if="activeTab === 'Notification Settings'">
      <div class="flex flex-col gap-24 px-32 py-16">
        <div class="flex gap-8">
          <div class="w-320 flex flex-col gap-8">
            <p class="heading-body-large-body-14px-medium text-[#0E121B]">
              Email Notifications
            </p>
            <span class="heading-body-body-12px-regular text-neutrals-grey-4">
              Receive notifications via email
            </span>
          </div>
          <el-switch v-model="isEmailNotificationOn" />
        </div>
        <div class="flex gap-8">
          <div class="w-320 flex flex-col gap-8">
            <p class="heading-body-large-body-14px-medium text-[#0E121B]">
              Push Notifications
            </p>
            <span class="heading-body-body-12px-regular text-neutrals-grey-4">
              Get real-time updates and alerts directly on your device
            </span>
          </div>
          <el-switch v-model="isPushNotificationOn" />
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
:deep(.el-tabs) {
  @apply my-0;
}

.user-form-container :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

.user-form-container :deep(.el-input__wrapper::after) {
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
