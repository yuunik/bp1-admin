<script setup lang="ts">
// @ts-ignore
import useAppLauncher from '@/composables/useAppLauncher.js'

// @ts-ignore
import LeadingIcon from '@/assets/icons/h5-leading.svg'
// @ts-ignore
import TrailingIcon from '@/assets/icons/h5-trailing.svg'
import { onMounted, useSlots } from 'vue'

interface PropsType {
  isLeadingVisible?: boolean
  isActionsVisible?: boolean
  appBarTitle?: string
  isFooterVisible?: boolean
  contentPx?: string
  contentPy?: string
  contentGap?: string
  footerPx?: string
  footerPy?: string
  footerHeight?: string
  footerDisplay?: string
  footerGap?: string
  openButtonText?: string
}

// 默认值
withDefaults(defineProps<PropsType>(), {
  // 是否需要 leading
  isLeadingVisible: false,
  // 是否需要 actions
  isActionsVisible: false,
  // app bar 的标题
  appBarTitle: '',
  // 是否需要底部栏
  isFooterVisible: true,
  // 内容的px值
  contentPx: 'px-20',
  // 内容的py值
  contentPy: 'py-20',
  // 内容的gap值
  contentGap: 'gap-24',
  // 滚动条的显示方式
  scrollbarDisplay: 'flex',
  // 滚动条的gap值
  scrollbarGap: 'gap-24',
  // 底部栏的px值
  footerPx: 'px-20',
  // 底部栏的py值
  footerPy: 'py-20',
  // 底部栏的高度
  footerHeight: 'h-60',
  // 底部栏的显示方式
  footerDisplay: 'flex',
  // 底部栏的gap值
  footerGap: 'gap-8',
  // 跳转 app 的按钮的文字
  openButtonText: 'Open in App',
})

// 获取 app 启动函数
const { launchApp } = useAppLauncher()

// 校验 slot
const slots = useSlots()

onMounted(() => {
  if (!slots.default) {
    throw new Error('h5 scaffold: missing default slot')
  }
})
</script>

<template>
  <!-- h5 scaffold -->
  <div class="relative flex h-full flex-col">
    <!-- app bar -->
    <header class="flex h-44 items-center px-20 py-10">
      <!-- leading -->
      <el-image :src="LeadingIcon" class="h-24 w-24" fit="cover" />
      <!-- title -->
      <h1 class="h2-20px-semibold neutrals-off-black m-auto">
        <strong>{{ appBarTitle }}</strong>
      </h1>
      <!-- actions -->
      <el-image :src="TrailingIcon" class="h-24 w-24" fit="cover" />
    </header>
    <!-- body -->
    <main :class="['flex flex-1 flex-col', contentPx, contentPy, contentGap]">
      <el-scrollbar :class="['flex-[1_1_200px]']">
        <!-- 内容显示区 -->
        <slot />
      </el-scrollbar>
    </main>
    <!-- footer -->
    <footer
      :class="[
        'border-t-solid box-border h-60 border-t border-t-[#EAEEF4]',
        footerHeight,
        footerPx,
        footerPy,
        footerDisplay,
        footerGap,
      ]"
      v-if="isFooterVisible"
      @click="launchApp"
    >
      <slot name="footer" />
    </footer>
    <!-- 跳转 app 的按钮 -->
    <el-button
      type="primary"
      class="bottom-68 fixed inset-x-0 mx-auto w-fit"
      @click="launchApp"
    >
      {{ openButtonText }}
    </el-button>
  </div>
</template>

<style scoped lang="scss">
// 重置 el-button 样式
:deep(.el-button) {
  @apply py-15 text-16 h-42 px-32 font-normal;
  font-family: 'Roboto', sans-serif;
}

// 重置 el-input 样式
:deep(.el-input) {
  @apply rounded-12 h-44;

  .el-input__wrapper {
    @apply rounded-12 bg-[#EAEEF4] shadow-none;

    .el-input__inner {
      @apply placeholder:text-14 placeholder:text-red placeholder:font-normal;
    }
  }
}
</style>
