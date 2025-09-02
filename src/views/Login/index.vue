<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useDebounceFn, useThrottleFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import { useUserStore } from '@/store'

// 静态资源
import Logo from '@/assets/icons/company-logo.svg'
import GreetingIcon from '@/assets/icons/waving-hand.svg'
import { RouteName, TimingPreset } from '@/utils/constantsUtil.js'
import BaseDialog from '@/components/BaseDialog.vue'
import {
  forgetPasswordSendCodeApi,
  resetAdminPasswordApi,
} from '@/apis/userCenterApi.js'
import { md5Encrypt } from '@/utils/md5Util.js'

const router = useRouter()
const userStore = useUserStore()
const { login } = userStore
// 获取登录状态
const { isLoading } = storeToRefs(userStore)

// 是否显示密码
const isShowPassword = ref(false)

// 登录表单数据
const loginForm = reactive({
  email: '',
  password: '',
})

// 忘记密码表单数据
const forgetPasswordForm = reactive({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: '',
})

// 忘记密码弹窗
const dialogForgetPasswordVisible = ref(false)

// 新密码是否显示
const isShowNewPassword = ref(false)

// 新密码(二次确认)是否显示
const isShowConfirmNewPassword = ref(false)

// 验证码是否发送
const isSendCode = ref(false)

// 邮箱输入框
const forgetEmailInputRef = ref(null)

// 定时器
const timer = ref(null)

// 倒计时时间
const countDownTime = ref(60)

// 倒计时 60 秒
const countDown = () => {
  isSendCode.value = true
  timer.value = setInterval(() => {
    countDownTime.value--
    if (countDownTime.value <= 0) {
      clearInterval(timer.value)
      timer.value = null
      countDownTime.value = 60
      isSendCode.value = false
    }
  }, 1000)
}

// 忘记密码发送验证码
const forgetPasswordSendCode = useDebounceFn(async () => {
  if (isSendCode.value) {
    return
  }
  if (!forgetPasswordForm.email) {
    ElMessage.info('Please enter the email to receive the reset code.')
    // 邮箱输入框聚焦
    forgetEmailInputRef.value.focus()
    return
  }

  // 开始倒计时
  countDown()

  try {
    await forgetPasswordSendCodeApi(forgetPasswordForm.email)
    // 验证码发送成功, 请检查邮箱的验证码
    ElMessage.success('Verification code sent. Please check your email.')
  } catch {
    ElMessage.error('Failed to send code. Please try again.')
  }
}, TimingPreset.DEBOUNCE)

// 用户登录
const handleLogin = useDebounceFn(async () => {
  try {
    await login(loginForm)
    // 路由跳转
    router.push({ name: RouteName.DASHBOARD })
  } catch (error) {
    const { message } = error
    // 登录失败, 实现错误提示
    ElMessage.error(message)
  }
}, TimingPreset.DEBOUNCE)

// 忘记密码, 重新设置密码
const handleResetPassword = useDebounceFn(async () => {
  if (!forgetPasswordForm.newPassword || !forgetPasswordForm.confirmPassword) {
    ElMessage.warning('Password is required.')
    return
  }
  // 重设密码
  await resetAdminPasswordApi({
    code: forgetPasswordForm.code,
    newPassword: md5Encrypt(forgetPasswordForm.newPassword),
    confirmPassword: md5Encrypt(forgetPasswordForm.confirmPassword),
  })
  ElMessage.success('Password reset successful. Please log in again.')
  dialogForgetPasswordVisible.value = false
})

watch(dialogForgetPasswordVisible, (val) => {
  if (!val) {
    forgetPasswordForm.email = ''
    forgetPasswordForm.code = ''
    forgetPasswordForm.newPassword = ''
    forgetPasswordForm.confirmPassword = ''
  }
})
</script>

<template>
  <div class="bg-container">
    <!-- description -->
    <div class="box-border flex h-full flex-1 flex-col gap-32 p-32">
      <!-- Company Logo -->
      <el-image :src="Logo" alt="Logo" class="w-83 h-24" />
      <article
        class="heading-body-large-body-14px-regular ml-auto mr-auto flex flex-1 flex-col justify-center gap-32 px-24"
      >
        <h2 class="heading-h2-20px-medium neutrals-off-white">
          Our Solutions, Transforming
        </h2>
        <h2 class="heading-h2-20px-medium neutrals-off-white">
          Businesses Bit by Bit
        </h2>
        <section class="neutrals-grey-3 flex items-center gap-16">
          <i class="icon-typesline text-24" />
          <span>Boost Sales & Saves Time!</span>
        </section>
        <section class="neutrals-grey-3 flex items-center gap-16">
          <i class="icon-typeslist text-24" />
          Easy project creation and assignment
        </section>
        <section class="neutrals-grey-3 flex items-center gap-16">
          <i class="icon-typestime text-24" />
          Real-time progress monitoring to ensure timely delivery
        </section>
        <section class="neutrals-grey-3 flex items-center gap-16">
          <i class="icon-typesnote text-24" />
          Report generation for clear decision making
        </section>
        <section class="neutrals-grey-3 flex items-center gap-16">
          <i class="icon-typesdot-line text-24" />
          Define, track and optimise your business processes with comprehensive
          data insights,
        </section>
      </article>
      <footer
        class="text-align-center heading-body-body-12px-regular neutrals-grey-3"
      >
        discover, develop, deliver © Proteus 2024
      </footer>
    </div>
    <!-- Login form -->
    <main
      class="min-w-592 max-w-800 bg-neutrals-off-white rounded-8 flex h-full w-full items-center justify-center"
    >
      <div class="text-align-left flex flex-col gap-48">
        <hgroup class="flex flex-col gap-24">
          <h1 class="flex items-center gap-8">
            <strong class="heading-h1-26px-medium">Welcome Back!</strong>
            <el-image :src="GreetingIcon" alt="Waving Hand" class="h-24 w-24" />
          </h1>
          <p class="heading-body-body-12px-regular">
            Welcome to OMS. Please enter your credentials to login.
          </p>
        </hgroup>
        <div class="text-align-right">
          <el-form label-width="112" label-position="left">
            <el-form-item label="Email" class="bottom-border-only">
              <el-input
                placeholder="Enter your email"
                v-model="loginForm.email"
              />
            </el-form-item>
            <el-form-item label="Password" class="bottom-border-only">
              <el-input
                placeholder="Enter your password"
                v-model="loginForm.password"
                :type="isShowPassword ? 'text' : 'password'"
                @keyup.enter="handleLogin"
              >
                <template #suffix>
                  <i
                    :class="`text-24 cursor-pointer ${isShowPassword ? 'icon-typespassword' : 'icon-eye-off-line'}`"
                    @click="isShowPassword = !isShowPassword"
                  />
                </template>
              </el-input>
            </el-form-item>
          </el-form>
          <p
            class="heading-body-body-12px-medium text-neutrals-off-black cursor-pointer hover:underline"
            @click="dialogForgetPasswordVisible = true"
          >
            Forgot Password?
          </p>
        </div>
        <el-button
          type="primary"
          class="primary-button"
          @click="handleLogin"
          :loading="isLoading"
          :disabled="isLoading"
        >
          Log In
        </el-button>
      </div>
    </main>
  </div>
  <!-- 忘记密码弹窗 -->
  <base-dialog
    v-model="dialogForgetPasswordVisible"
    title="Forget Password"
    @cancel="dialogForgetPasswordVisible = false"
    @confirm="handleResetPassword"
  >
    <template #content>
      <el-form
        ref="changePasswordForm"
        :model="forgetPasswordForm"
        label-width="140px"
        label-position="left"
        class="change-password-form"
      >
        <el-form-item label="Email">
          <el-input
            placeholder="Enter your email"
            v-model="forgetPasswordForm.email"
            ref="forgetEmailInputRef"
            @keyup.enter="forgetPasswordSendCode"
          />
        </el-form-item>
        <el-form-item label="Code">
          <el-input
            placeholder="Enter your code"
            v-model="forgetPasswordForm.code"
          >
            <template #suffix>
              <span
                class="heading-body-body-12px-medium text-neutrals-grey-3 hover:text-neutrals-off-black whitespace-nowrap hover:underline"
                @click.self="forgetPasswordSendCode"
                :class="isSendCode ? 'cursor-not-allowed' : 'cursor-pointer'"
              >
                Send Code
                <!-- 倒计时 -->
                {{ isSendCode ? `( ${countDownTime} s )` : '' }}
              </span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="New Password">
          <el-input
            placeholder="Enter your password"
            v-model="forgetPasswordForm.newPassword"
            :type="isShowNewPassword ? 'text' : 'password'"
          >
            <template #suffix>
              <i
                :class="`text-24 cursor-pointer ${isShowNewPassword ? 'icon-typespassword' : 'icon-eye-off-line'}`"
                @click="isShowNewPassword = !isShowNewPassword"
              />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="Confirm Password">
          <el-input
            placeholder="Enter your confirm password"
            v-model="forgetPasswordForm.confirmPassword"
            :type="isShowConfirmNewPassword ? 'text' : 'password'"
          >
            <template #suffix>
              <i
                :class="`text-24 cursor-pointer ${isShowConfirmNewPassword ? 'icon-typespassword' : 'icon-eye-off-line'}`"
                @click="isShowConfirmNewPassword = !isShowConfirmNewPassword"
              />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </template>
  </base-dialog>
</template>

<style scoped lang="scss">
.bg-container {
  @extend %common-bg-style;
  @apply justify-between;
}

:deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

:deep(.el-input__wrapper::after) {
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
