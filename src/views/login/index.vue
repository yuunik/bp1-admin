<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToHomepage = () => router.push("/")

</script>

<template>
  <div class="bg-container p-8 gap-8">
    <div class="p-32 h-full flex flex-col box-border gap-32 flex-1">
      <!-- Company Logo -->
      <img src="/src/assets/icons/company-logo.svg" alt="Logo" class="w-83 h-24" />
      <article class="flex-1 flex flex-col justify-center gap-32 px-24 heading-body-large-body-14px-regular ml-auto mr-auto">
        <h2 class="heading-h2-20px-medium">Our Solutions, Transforming</h2>
        <h2 class="heading-h2-20px-medium">Businesses Bit by Bit</h2>
        <section class="flex items-center gap-16"><i
          class="icon-typesline text-24" /><span>Boost Sales & Saves Time!</span></section>
        <section class="flex items-center gap-16"><i class="icon-typeslist text-24" />Easy project creation and
          assignment
        </section>
        <section class="flex items-center gap-16"><i class="icon-typestime text-24" />Real-time progress monitoring to
          ensure timely delivery
        </section>
        <section class="flex items-center gap-16"><i class="icon-typesnote text-24" />Report generation for clear
          decision making
        </section>
        <section class="flex items-center gap-16"><i class="icon-typesdot-line text-24" />Define, track and optimise
          your business processes with comprehensive data insights,
        </section>
      </article>
      <footer class="text-align-center heading-body-body-12px-regular">
        discover, develop, deliver © Proteus 2024
      </footer>
    </div>
    <main class="form-container rounded-8 h-full flex-1 flex justify-center items-center">
      <div class="flex flex-col gap-48 text-align-left">
        <hgroup class="flex flex-col gap-24">
          <h1 class="flex items-center gap-8 heading-h1-26px-medium">
            <strong>Welcome Back! </strong>
            <img src="/src/assets/icons/waving-hand.svg" alt="Waving Hand" class="w-24 h-24" />
          </h1>
          <p class="heading-body-body-12px-regular">Welcome to OMS. Please enter your credentials to login.</p>
        </hgroup>
        <div class="text-align-right">
          <el-form label-width="112" label-position="left">
            <el-form-item label="Email" class="bottom-border-only">
              <el-input placeholder="Enter your email" />
            </el-form-item>
            <el-form-item label="Password" class="bottom-border-only">
              <el-input placeholder="Enter your password">
                <template #suffix>
                  <i class="icon-typespassword text-24" />
                </template>
              </el-input>
            </el-form-item>
          </el-form>
          <p class="heading-body-body-12px-medium">Forgot Password?</p>
        </div>
        <el-button type="primary" class="primary-button" @click="goToHomepage">Log In</el-button>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.bg-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-image: linear-gradient(to bottom, $branding-colours-gradient-b, $branding-colours-gradient-e);
  @apply flex justify-between;
}

.form-container {
  background-color: $neutrals-off-white;
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