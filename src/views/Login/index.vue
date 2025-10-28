<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useDebounceFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { Picture } from '@element-plus/icons-vue'

import { useUserStore } from '@/store'
import { RouteName, TimingPreset } from '@/utils/constantsUtil.js'
import BaseDialog from '@/components/BaseDialog.vue'
import {
  forgetPasswordSendCodeApi,
  resetAdminPasswordApi,
} from '@/apis/userCenterApi.js'
import { md5Encrypt } from '@/utils/md5Util.js'

// 静态资源
import Logo from '@/assets/images/company-logo-full.png'
import GreetingIcon from '@/assets/images/Waving Hand.png'

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

// 登录表单
const loginFormRef = ref(null)

// 登录表单校验规则
const loginFormRules = ref({
  email: [
    {
      required: true,
      message: 'Please enter your email',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: 'Please enter your password',
      trigger: 'blur',
    },
  ],
})

// 重设密码弹窗
const forgetPasswordFormRef = ref(null)

// 重设密码表单
const forgetPasswordFormRules = ref({
  email: [
    {
      required: true,
      message: 'Please enter your email',
      trigger: 'blur',
    },
    {
      type: 'email',
      message: 'Please enter a valid email',
      trigger: 'change',
    },
  ],
  code: [
    {
      required: true,
      message: 'Please enter the verification code',
      trigger: 'blur',
    },
  ],
  newPassword: [
    {
      required: true,
      message: 'Please enter your new password',
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: 'Please enter your new password',
      trigger: 'blur',
    },
    {
      validator: (rule, value, callback) => {
        if (value !== forgetPasswordForm.newPassword) {
          callback(new Error('Passwords do not match'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
})

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
  // 表单校验
  await loginFormRef.value.validate()
  // 登录
  await login(loginForm)
  // 路由跳转
  router.push({ name: RouteName.DASHBOARD })
}, TimingPreset.DEBOUNCE)

// 忘记密码, 重新设置密码
const handleResetPassword = useDebounceFn(async () => {
  // 表单校验
  await forgetPasswordFormRef.value.validate()
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
    <div
      class="text-neutrals-grey-3 box-border flex h-full flex-1 flex-col gap-32 p-32"
    >
      <!-- Company Logo -->
      <el-image :src="Logo" alt="Company Logo" class="w-83 h-24">
        <template #error>
          <div class="image-error">
            <el-icon><picture /></el-icon>
          </div>
        </template>
      </el-image>
      <article
        class="heading-body-large-body-14px-regular ml-auto mr-auto flex flex-1 flex-col justify-center gap-32 px-24"
      >
        <h2 class="heading-h2-20px-medium neutrals-off-white">
          Our Solutions, Transforming
        </h2>
        <h2 class="heading-h2-20px-medium neutrals-off-white">
          Businesses Bit by Bit
        </h2>
        <section class="flex items-center gap-16">
          <i class="icon-typesline text-24" />
          <span>Boost Sales & Saves Time!</span>
        </section>
        <section class="flex items-center gap-16">
          <i class="icon-typeslist text-24" />
          Easy project creation and assignment
        </section>
        <section class="flex items-center gap-16">
          <i class="icon-typestime text-24" />
          Real-time progress monitoring to ensure timely delivery
        </section>
        <section class="flex items-center gap-16">
          <i class="icon-typesnote text-24" />
          Report generation for clear decision making
        </section>
        <section class="flex items-center gap-16">
          <i class="icon-typesdot-line text-24" />
          Define, track and optimise your business processes with comprehensive
          data insights,
        </section>
      </article>
      <footer class="text-align-center heading-body-body-12px-regular">
        discover, develop, deliver © Proteus 2025
      </footer>
    </div>
    <!-- Login form -->
    <main
      class="min-w-592 max-w-800 bg-neutrals-off-white rounded-8 flex h-full w-full items-center justify-center"
    >
      <div class="text-align-left flex flex-col gap-48">
        <div class="flex flex-col gap-24">
          <div class="flex items-center gap-8">
            <h1 class="heading-h1-26px-medium h-24">Welcome Back!</h1>
            <el-image :src="GreetingIcon" alt="Greeting Icon" class="h-24 w-24">
              <template #error>
                <div class="image-error">
                  <el-icon><picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
          <p class="heading-body-body-12px-regular text-neutrals-grey-4">
            Welcome to OMS. Please enter your credentials to login.
          </p>
        </div>
        <div class="text-align-right">
          <el-form
            :model="loginForm"
            :rules="loginFormRules"
            ref="loginFormRef"
            label-width="112"
            label-position="left"
          >
            <el-form-item label="Email" class="bottom-border-only" prop="email">
              <el-input
                placeholder="Enter your email"
                v-model="loginForm.email"
              />
            </el-form-item>
            <el-form-item
              label="Password"
              class="bottom-border-only"
              prop="password"
            >
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
        ref="forgetPasswordFormRef"
        :model="forgetPasswordForm"
        :rules="forgetPasswordFormRules"
        label-width="140px"
        label-position="left"
        class="change-password-form"
      >
        <el-form-item label="Email" prop="email">
          <el-input
            placeholder="Enter your email"
            v-model="forgetPasswordForm.email"
            ref="forgetEmailInputRef"
            @keyup.enter="forgetPasswordSendCode"
          />
        </el-form-item>
        <el-form-item label="Code" prop="code">
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
        <el-form-item label="New Password" prop="newPassword">
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
        <el-form-item label="Confirm Password" prop="confirmPassword">
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

// 重置输入框样式
:deep(.el-input__wrapper) {
  @extend %el-input-underline-style;
}
</style>
