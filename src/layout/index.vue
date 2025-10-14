<script setup>
import { storeToRefs } from 'pinia'
import { provide } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useLocalStorage } from '@vueuse/core'

import { useUserStore } from '@/store/index.js'
import MenuItem from './components/MenuItem/index.vue'
import Breadcrumb from './components/Breadcrumb/index.vue'

import CompanyLogo from '@/assets/images/company-logo-full.png'
import Logo from '@/assets/images/company-logo.png'
import BaseDialog from '@/components/BaseDialog.vue'
import { RouteName } from '@/utils/constantsUtil.js'
import { modifyAdminPasswordApi } from '@/apis/userCenterApi.js'
import { md5Encrypt } from '@/utils/md5Util.js'
import routes from '@/router/routes/index.js'

const userStore = useUserStore()

// 获取用户相关信息
const { userId, username, userRole, usernameAbbr } = storeToRefs(userStore)

const router = useRouter()

const isShowSettingsDialog = ref(false)

// 弹窗相关
const dialogChangePasswordVisible = ref(false)

// 修改密码相关
const changePasswordForm = reactive({
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

// 菜单栏是否折叠
const isMenuCollapsed = useLocalStorage('isMenuCollapsed', false)

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

// 用户安全退出
const handleLogout = async () => {
  await userStore.logout()
  // 提示
  ElMessage.success('Logout successfully')
  // 路由跳转
  router.push({ name: RouteName.LOGIN })
}

// 修改管理员密码
const handleModifyAdminPassword = async () => {
  if (changePasswordForm.confirmPassword !== changePasswordForm.newPassword) {
    ElMessage.error('The two passwords do not match')
    return
  }
  // 修改管理员密码
  await modifyAdminPasswordApi({
    userId: userId.value,
    oldPassword: md5Encrypt(changePasswordForm.currentPassword),
    password: md5Encrypt(changePasswordForm.confirmPassword),
  })
  // 关闭弹窗
  dialogChangePasswordVisible.value = false
  // 修改成功
  ElMessage.success('Modify successfully')
  // 清空用户信息
  await userStore.logout()
  // 跳转登录页面
  router.push({ name: RouteName.LOGIN })
}

// 菜单栏是否折叠
provide('isMenuCollapsed', isMenuCollapsed)
</script>

<template>
  <div class="bg-container">
    <!-- menu bar -->
    <nav
      class="heading-body-body-12px-regular default-transition menu-container relative flex flex-col gap-16"
      :class="{ 'wf-menu-width!': isMenuCollapsed }"
    >
      <!-- Company Logo -->
      <el-image
        :src="CompanyLogo"
        fit="contain"
        alt="Company Logo"
        class="w-83 default-transition ml-8 mt-8 h-24"
        v-show="!isMenuCollapsed"
      />
      <el-image
        :src="Logo"
        fit="cover"
        alt="Company Logo"
        class="default-transition mx-auto h-24 w-24"
        v-show="isMenuCollapsed"
      />
      <!-- menu -->
      <el-scrollbar class="default-transition flex-1">
        <el-menu
          class="nav-menu"
          :class="{ 'wf-menu-width!': isMenuCollapsed }"
          background-color="transparent"
          text-color="#99A0AE"
          :default-active="$route.path"
          :collapse="isMenuCollapsed"
        >
          <menu-item :user-menu-routes="routes" />
        </el-menu>
      </el-scrollbar>
      <!-- user center -->
      <ul
        class="text-neutrals-grey-3 [&>li]:rounded-8 default-transition box-border flex flex-col gap-16 p-8 [&>li]:p-8"
        :class="{ 'wf-menu-width!': isMenuCollapsed }"
      >
        <li
          :class="[
            'item-style',
            'group',
            {
              'bg-[#ffffff1a]': $route.name === 'Notifications',
              'text-neutrals-off-white': $route.name === 'Notifications',
            },
          ]"
          @click="$router.push({ name: 'Notifications' })"
        >
          <i
            class="icon-typesnotification text-16 group-hover:text-neutrals-off-white"
            :class="{
              'text-neutrals-off-white': $route.name === 'Notifications',
            }"
          />
          <span class="flex-1" v-if="!isMenuCollapsed">Notifications</span>
          <!-- notification dot -->
          <i
            class="icon-typesnotification-dot heading-caption-caption-10px-medium flex-center bg-status-colours-green h-16 w-16 rounded-full text-[#FCFCFC]"
            v-if="!isMenuCollapsed"
          >
            1
          </i>
        </li>
        <li
          :class="[
            'item-style',
            'group',
            {
              'bg-[#ffffff1a]': $route.name === 'Settings',
              'text-neutrals-off-white': $route.name === 'Settings',
            },
          ]"
          @click="$router.push({ name: 'Settings' })"
        >
          <i
            class="icon-typessetting text-16 group-hover:text-neutrals-off-white"
            :class="{
              'text-neutrals-off-white': $route.name === 'Settings',
            }"
          />
          <span v-if="!isMenuCollapsed">Settings</span>
        </li>
        <el-divider
          class="divider border-t-1 border-t-[#FFFFFF1A]! border-t-solid"
        />
        <!-- 底部用户信息相关设置 -->
        <li
          v-click-outside="() => (isShowSettingsDialog = false)"
          class="item-style group"
          :class="{
            'bg-[#ffffff1a]': isShowSettingsDialog,
            'text-neutrals-off-white': isShowSettingsDialog,
          }"
          @click="isShowSettingsDialog = !isShowSettingsDialog"
        >
          <!-- user avatar-->
          <i class="user-avatar">
            <!-- 用户名字缩写 -->
            <span
              class="heading-body-body-12px-medium group-hover:text-neutrals-off-white"
              :class="{
                'text-neutrals-off-white': isShowSettingsDialog,
              }"
            >
              {{ usernameAbbr }}
            </span>
          </i>
          <!-- user info -->
          <div class="flex flex-col gap-8" v-if="!isMenuCollapsed">
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
      <div
        class="expand-btn z-9999"
        @click="isMenuCollapsed = !isMenuCollapsed"
      >
        <!-- 折叠图标 -->
        <i class="text-16 icon-typescollapsable" v-show="!isMenuCollapsed" />
        <!-- 展开图标 -->
        <i class="text-16 icon-mail-send-line" v-show="isMenuCollapsed" />
      </div>
    </nav>
    <!-- content -->
    <main
      class="content-container"
      :class="{ 'cf-content-width!': isMenuCollapsed }"
    >
      <!-- breadcrumb -->
      <breadcrumb class="shrink-0" />
      <!-- router view -->
      <router-view class="flex-1 overflow-auto" />
      <!-- 设置中心 -->
      <aside
        class="z-999 w-150 rounded-8 shadow-default bg-neutrals-white text-neutrals-off-black absolute bottom-8 left-8 flex flex-col gap-8 p-8 [&>span]:cursor-pointer"
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
    @confirm="handleModifyAdminPassword"
  >
    <template #content>
      <el-form
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
    @confirm="handleLogout"
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
    @apply wb-menu-width default-transition flex-1 border-none;

    :deep(.el-menu-item) {
      &:not(:last-child) {
        margin-bottom: 4px;
      }
    }
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
    @apply rounded-8 cb-content-width default-transition relative flex h-full flex-col;
    background-color: $neutrals-off-white;
  }
}

// 重置滚动条样式
.menu-container :deep(.el-scrollbar) {
  @apply w-fit!;
}

.menu-container :deep(.el-scrollbar__wrap) {
  @apply w-fit!;
}

.menu-container :deep(.el-scrollbar__view) {
  @apply w-fit!;
}

.menu-container :deep(.el-sub-menu) {
  @apply pb-4!;
}
</style>
