<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useDebounceFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import { useUserStore } from '@/store'

// 静态资源
import Logo from '@/assets/icons/company-logo.svg'
import GreetingIcon from '@/assets/icons/waving-hand.svg'

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

// 用户登录
const handleLogin = useDebounceFn(async () => {
  try {
    const res = await login(loginForm)
    // 路由跳转
    await router.push('/')
  } catch (error) {
    const { message } = error
    // 登录失败, 实现错误提示
    ElMessage.error(message)
  }
}, 500)
</script>

<template>
  <div class="bg-container">
    <!-- description -->
    <div class="box-border flex h-full flex-1 flex-col gap-32 p-32">
      <!-- Company Logo -->
      <img :src="Logo" alt="Logo" class="w-83 h-24" />
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
      class="min-w-592 max-w-800 bg-neutrals-off-white rounded-8 flex h-full flex-shrink flex-grow-0 basis-auto items-center justify-center"
    >
      <div class="text-align-left flex flex-col gap-48">
        <hgroup class="flex flex-col gap-24">
          <h1 class="flex items-center gap-8">
            <strong class="heading-h1-26px-medium">Welcome Back!</strong>
            <img :src="GreetingIcon" alt="Waving Hand" class="h-24 w-24" />
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
          <p class="heading-body-body-12px-medium">Forgot Password?</p>
        </div>
        <el-button
          type="primary"
          class="primary-button"
          @click="handleLogin"
          :loading="isLoading"
        >
          Log In
        </el-button>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.bg-container {
  @extend %common-bg-style;
  @apply justify-between;
}

.bottom-border-only :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

.bottom-border-only :deep(.el-input__wrapper::after) {
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
