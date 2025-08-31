<script setup>
import { ForumManagementTab } from '@/utils/constantsUtil.js'

const activeTab = ref('Profile Settings')

const form = reactive({
  username: '',
  email: '',
})

const isEmailNotificationOn = ref(false)

const isPushNotificationOn = ref(false)
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
    <el-tabs v-model="activeTab" class="mx-32">
      <el-tab-pane label="Profile Settings" name="Profile Settings" />
      <el-tab-pane label="Notification Settings" name="Notification Settings" />
    </el-tabs>
    <!-- 分割线 -->
    <el-divider class="diver" />
    <!-- tab 内容区 -->
    <template v-if="activeTab === 'Profile Settings'">
      <div class="px-32 py-16">
        <!-- 上传 logo -->
        <div class="w-400 flex h-80 flex-1 gap-24">
          <!-- logo -->
          <el-avatar
            :size="64"
            src="https://randomuser.me/api/portraits/men/42.jpg"
            fit="cover"
            @error="() => true"
          >
            <!-- logo 加载失败的默认显示 -->
            <i class="flex-center h-64 w-64">
              <el-text class="heading-h1-26px-medium neutrals-off-black">
                B
              </el-text>
            </i>
          </el-avatar>
          <!-- desc -->
          <div class="flex flex-col gap-16">
            <el-text>Upload Logo</el-text>
            <!-- 更换 logo 图片 -->
            <el-upload :auto-upload="false" :show-file-list="false">
              <template #trigger>
                <el-button>Upload</el-button>
              </template>
            </el-upload>
          </div>
        </div>
        <!-- 分割线 -->
        <el-divider class="divider w-360! my-24!" />
        <!-- 表单 -->
        <el-form
          :model="form"
          label-width="112px"
          class="user-form-container"
          label-position="left"
        >
          <!-- 用户名 -->
          <el-form-item label="Full Name">
            <el-input v-model="form.username" class="w-240!" />
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item label="Role">
            <el-input v-model="form.email" class="w-240!" />
          </el-form-item>
        </el-form>
        <!-- 按键组 -->
        <div class="w-360 mt-24 flex gap-8">
          <el-button class="flex-1">Discard</el-button>
          <el-button class="flex-1" type="primary">Apply Changes</el-button>
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
