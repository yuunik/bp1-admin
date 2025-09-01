<script setup>
import { storeToRefs } from 'pinia'
import { computed, provide } from 'vue'
import { useRoute } from 'vue-router'

import routes from '@/router/routes/index.js'
import { useUserStore } from '@/store/index.js'
import MenuItem from './components/MenuItem/index.vue'
import Breadcrumb from './components/Breadcrumb/index.vue'

import CompanyLogo from '@/assets/icons/company-logo.svg'
import BaseDialog from '@/components/BaseDialog.vue'

const userStore = useUserStore()
// 获取用户相关信息
const { username, userRole, usernameAbbr } = storeToRefs(userStore)
const route = useRoute()
const dynamicBreadcrumbList = computed(() =>
  route.matched.map((item) => ({ ...item })),
)

const isShowSettingsDialog = ref(false)

// 弹窗相关
const dialogChangePasswordVisible = ref(false)

// 修改密码相关
const changePasswordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 显示密码
const isShowPassword = ref(false)

// 显示确认密码
const isShowConfirmPasswordVisible = ref(false)

// 确认退出弹窗状态
const dialogConfirmLogoutVisible = ref(false)

// 确认修改邮箱状态
const dialogConfirmChangeEmailVisible = ref(false)

// 修改邮箱表单
const changeEmailForm = ref({
  currentPassword: '',
  newEmail: '',
})

// 展开当前的密码
const isShowCurrentPassword = ref(false)

// 打开修改密码弹窗
const handleOpenChangePasswordDialog = () => {
  // 打开弹窗
  dialogChangePasswordVisible.value = true
  // 关闭设置中心弹窗
  isShowSettingsDialog.value = false
}

// 打开修改邮箱弹窗
const handleOpenChangeEmailDialog = () => {
  // 打开弹窗
  dialogConfirmChangeEmailVisible.value = true
  // 关闭设置中心弹窗
  isShowSettingsDialog.value = false
}

// 打开确认退出弹窗
const handleOpenConfirmLogoutDialog = () => {
  // 打开弹窗
  dialogConfirmLogoutVisible.value = true
  // 关闭设置中心弹窗
  isShowSettingsDialog.value = false
}

provide('dynamicBreadcrumbList', dynamicBreadcrumbList)
</script>

<template>
  <div class="bg-container">
    <!-- menu bar -->
    <nav class="heading-body-body-12px-regular relative flex flex-col gap-16">
      <!-- Company Logo -->
      <img :src="CompanyLogo" alt="Company Logo" class="w-83 ml-8 mt-8 h-24" />
      <!-- menu -->
      <el-menu
        class="nav-menu"
        background-color="transparent"
        text-color="#99A0AE"
        :default-active="$route.path"
      >
        <menu-item :user-menu-routes="routes" />
      </el-menu>
      <!-- user center -->
      <ul
        class="neutrals-grey-3 [&>li]:rounded-8 flex flex-col gap-16 p-8 [&>li]:p-8"
      >
        <li
          :class="[
            'item-style',
            {
              'bg-[#ffffff1a]': $route.name === 'Notifications',
              'text-neutrals-off-white': $route.name === 'Notifications',
            },
          ]"
          @click="$router.push({ name: 'Notifications' })"
        >
          <i class="icon-typesnotification text-16" />
          <span class="flex-1">Notifications</span>
          <!-- notification dot -->
          <i
            class="icon-typesnotification-dot heading-caption-caption-10px-medium3 neutrals-grey-3"
            :class="{
              'text-neutrals-off-white': $route.name === 'Notifications',
            }"
          >
            1
          </i>
        </li>
        <li
          :class="[
            'item-style',
            {
              'bg-[#ffffff1a]': $route.name === 'Settings',
              'text-neutrals-off-white': $route.name === 'Settings',
            },
          ]"
          @click="$router.push({ name: 'Settings' })"
        >
          <i
            class="icon-typessetting item-style"
            :class="{
              'text-neutrals-off-white': $route.name === 'Settings',
            }"
          />
          <span>Settings</span>
        </li>
        <el-divider class="divider" />
        <!-- 底部用户信息相关设置 -->
        <li
          v-click-outside="() => (isShowSettingsDialog = false)"
          class="item-style"
          :class="{
            'bg-[#ffffff1a]': isShowSettingsDialog,
            'text-neutrals-off-white': isShowSettingsDialog,
          }"
          @click="isShowSettingsDialog = !isShowSettingsDialog"
        >
          <!-- user avatar-->
          <i class="user-avatar">
            <!-- 用户名字缩写 -->
            <span class="heading-body-body-12px-medium">
              {{ usernameAbbr }}
            </span>
          </i>
          <!-- user info -->
          <div class="flex flex-col gap-8">
            <!-- user name -->
            <span class="heading-caption-caption-10px-medium">
              {{ username }}
            </span>
            <!-- user role -->
            <span class="heading-caption-caption-10px-regular">
              {{ userRole }}
            </span>
          </div>
        </li>
      </ul>
      <!-- expand button -->
      <div class="expand-btn">
        <i class="icon-typescollapsable1" />
      </div>
    </nav>
    <!-- content -->
    <main class="content-container">
      <!-- breadcrumb -->
      <breadcrumb class="shrink-0" />
      <!-- router view -->
      <router-view class="flex-1 overflow-y-auto overflow-x-hidden" />
      <!-- 设置中心 -->
      <aside
        class="w-150 rounded-8 shadow-default text-neutrals-off-black absolute bottom-8 left-8 flex flex-col gap-8 p-8 [&>span]:cursor-pointer"
        v-if="isShowSettingsDialog"
      >
        <span
          class="leading-36 rounded-8 hover:bg-status-colours-light-blue heading-body-body-12px-regular h-36 p-8"
          @click.self="handleOpenChangeEmailDialog"
        >
          Change Email
        </span>
        <span
          class="leading-36 rounded-8 hover:bg-status-colours-light-blue heading-body-body-12px-regular h-36 p-8"
          @click="handleOpenChangePasswordDialog"
        >
          Change Password
        </span>
        <span
          class="leading-36 rounded-8 hover:bg-status-colours-light-blue heading-body-body-12px-regular h-36 p-8"
          @click="handleOpenConfirmLogoutDialog"
        >
          Logout
        </span>
      </aside>
    </main>
  </div>
  <!-- 修改密码弹窗 -->
  <base-dialog
    v-model="dialogChangePasswordVisible"
    title="Change Password"
    @cancel="dialogChangePasswordVisible = false"
    @confirm="console.log('confirm')"
  >
    <template #content>
      <el-form
        ref="changePasswordForm"
        :model="changePasswordForm"
        label-width="140px"
        label-position="left"
        class="change-password-form"
      >
        <el-form-item label="Current Password">
          <el-input
            type="password"
            v-model="changePasswordForm.currentPassword"
            placeholder="Please enter your current password"
          />
        </el-form-item>
        <el-form-item label="New Password">
          <el-input
            placeholder="Enter your password"
            v-model="changePasswordForm.newPassword"
            :type="isShowPassword ? 'text' : 'password'"
          >
            <template #suffix>
              <i
                :class="`text-24 cursor-pointer ${isShowPassword ? 'icon-typespassword' : 'icon-eye-off-line'}`"
                @click="isShowPassword = !isShowPassword"
              />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="Confirm Password">
          <el-input
            placeholder="Enter your password"
            v-model="changePasswordForm.confirmPassword"
            :type="isShowConfirmPasswordVisible ? 'text' : 'password'"
          >
            <template #suffix>
              <i
                :class="`text-24 cursor-pointer ${isShowConfirmPasswordVisible ? 'icon-typespassword' : 'icon-eye-off-line'}`"
                @click="
                  isShowConfirmPasswordVisible = !isShowConfirmPasswordVisible
                "
              />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </template>
  </base-dialog>
  <!-- 安全退出登录弹窗 -->
  <base-dialog
    v-model="dialogConfirmLogoutVisible"
    title="Logout"
    button-type="danger"
    @cancel="dialogConfirmLogoutVisible = false"
    @confirm="console.log('logOut')"
  >
    <template #content>
      <p class="heading-body-body-12px-medium text-neutrals-off-black">
        Are you sure you want to logout?
      </p>
    </template>
  </base-dialog>
  <!-- 修改邮箱弹窗 -->
  <base-dialog
    v-model="dialogConfirmChangeEmailVisible"
    title="Change Email"
    @cancel="dialogConfirmChangeEmailVisible = false"
    @confirm="console.log('changeEmail')"
  >
    <template #content>
      <el-form
        ref="changePasswordForm"
        :model="changeEmailForm"
        label-width="140px"
        label-position="left"
        class="change-password-form"
      >
        <el-form-item label="Email">
          <el-input
            v-model="changeEmailForm.newEmail"
            placeholder="Please enter your new email"
          />
        </el-form-item>
        <el-form-item label="Password">
          <el-input
            placeholder="Enter your password"
            v-model="changeEmailForm.currentPassword"
            :type="isShowCurrentPassword ? 'text' : 'password'"
          >
            <template #suffix>
              <i
                :class="`text-24 cursor-pointer ${isShowCurrentPassword ? 'icon-typespassword' : 'icon-eye-off-line'}`"
                @click="isShowCurrentPassword = !isShowCurrentPassword"
              />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </template>
  </base-dialog>
</template>

<style scoped lang="scss">
// 重置表单标签文字
:deep(.el-form-item__label) {
  font-size: 12px;
  font-weight: 500;
  color: #99a0ae;
}

.change-password-form :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

.change-password-form :deep(.el-input__wrapper::after) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--el-input-border-color, var(--el-border-color));
  pointer-events: none;
}

.bg-container {
  // 公用背景色
  @extend %common-bg-style;

  // 菜单栏
  .nav-menu {
    @apply w-210 flex-1 overflow-hidden border-none;
  }

  // 底部用户信息相关设置
  .item-style {
    @apply hover:text-neutrals-off-white flex cursor-pointer items-center gap-8 hover:bg-[#ffffff1a];

    // user avatar
    .user-avatar {
      @apply flex-center h-32 w-32 rounded-full;
      background-color: $neutrals-10-white;
    }
  }

  // 消息通知图标
  .icon-typesnotification-dot {
    @apply rounded-100 flex-center h-16 w-16;
    background-color: $status-colours-green;
  }

  // 展开按钮
  .expand-btn {
    @apply rounded-200 flex-center absolute h-72 w-16 cursor-pointer;
    border: 1px $neutrals-grey-2 solid;
    background-color: $neutrals-off-white;
    top: 50%;
    right: -16px;
  }

  // 内容区域
  .content-container {
    @apply rounded-8 relative flex h-full flex-col;
    width: calc(100% - 218px);
    background-color: $neutrals-off-white;
  }
}
</style>
