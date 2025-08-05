<script setup>
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import VueMarkdown from 'vue-markdown-render'

// 获取 ai 问答详情
import { getAiQuestionInfoApi } from '@/apis/shareApi.js'

// ai logo
import AiLogo from '@/assets/icons/ai-logo.svg'
import SendIcon from '@/assets/icons/fi_arrow-right-circle-disabled.svg'
import useAppLauncher from '@/composables/useAppLauncher.js'

const aiQuestionInfo = reactive({})

const route = useRoute()

// 获取 app 启动函数
const { launchApp } = useAppLauncher()

// 修改网页的标题
document.title = route.meta.title

const getAIChatQuestionInfo = async (id) => {
  const { data } = await getAiQuestionInfoApi(id)
  // 赋值
  Object.assign(aiQuestionInfo, data)
}

const { id } = route.params
if (id) {
  // 获取 ai 问答详情
  getAIChatQuestionInfo(id)
}
</script>

<template>
  <div class="relative flex h-full flex-col justify-between">
    <!-- App Bar -->
    <header class="flex-center flex h-44">
      <h1 class="h2-20px-semibold neutrals-off-black">AI Assistant</h1>
    </header>
    <!-- AI Chat Content Info -->
    <main class="flex flex-1 flex-col gap-16 p-20">
      <!-- question -->
      <section class="flex flex-col gap-4">
        <el-text class="neutrals-grey-4 w-full">Question</el-text>
        <div class="rounded-12 bg-[#202834] px-14 py-12">
          <el-text class="text-white! font-normal">
            {{ aiQuestionInfo?.question }}
          </el-text>
        </div>
      </section>
      <!-- answer container -->
      <section class="flex flex-col gap-16">
        <!-- ai logo -->
        <el-avatar :src="AiLogo" class="h-40 w-40" fit="cover" />
        <!-- answer -->
        <vue-markdown :source="aiQuestionInfo?.answer || ''" />
      </section>
    </main>
    <footer
      class="flex h-60 items-center gap-8 border-t border-t-[#EAEEF4] px-20 py-8"
      @click="launchApp"
    >
      <!-- input -->
      <el-input
        placeholder="Ask anything about your car... "
        :disabled="true"
      />
      <!-- send icon -->
      <el-image :src="SendIcon" class="h-32 w-32" fit="cover" />
    </footer>
    <div class="bottom-68 fixed inset-x-0 mx-auto w-fit">
      <el-button type="primary" class="open-button" @click="launchApp">
        Chat in App
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-input) {
  @apply rounded-12 h-44;

  .el-input__wrapper {
    @apply rounded-12 bg-[#EAEEF4] shadow-none;

    .el-input__inner {
      @apply placeholder:text-14 placeholder:text-red placeholder:font-normal;
    }
  }
}

:deep(.el-button) {
  @apply px-32 py-16;

  span {
    @apply text-16 font-normal;
  }
}
</style>
