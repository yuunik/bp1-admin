<script setup>
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import VueMarkdown from 'vue-markdown-render'

import Scaffold from '@/components/Scaffold/index.vue'
// 获取 ai 问答详情
import { getAiQuestionInfoApi } from '@/apis/shareApi.js'

// ai logo
import AiLogo from '@/assets/icons/ai-logo.svg'
import SendIcon from '@/assets/icons/fi_arrow-right-circle-disabled.svg'
const aiQuestionInfo = reactive({})

const route = useRoute()

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
  <scaffold
    app-bar-title="AI Assistant"
    footer-py="py-8"
    footer-display="flex items-center"
    scrollbar-gap="gap-16"
    open-button-text="Chat in App"
  >
    <!-- question -->
    <section class="mb-16 ml-auto flex w-max max-w-full flex-col gap-4">
      <el-text class="neutrals-grey-4 w-full">Question</el-text>
      <div class="rounded-12 bg-[#202834] px-14 py-12">
        <p class="m-0 whitespace-normal break-all text-white">
          {{ aiQuestionInfo?.question }}
        </p>
      </div>
    </section>
    <!-- answer container -->
    <section class="flex flex-col gap-16">
      <!-- ai logo -->
      <el-avatar :src="AiLogo" class="h-40 w-40" fit="cover" />
      <!-- answer -->
      <vue-markdown :source="aiQuestionInfo?.answer || ''" />
    </section>
    <!-- footer -->
    <template #footer>
      <!-- input -->
      <el-input
        placeholder="Ask anything about your car... "
        :disabled="true"
      />
      <!-- send icon -->
      <el-image :src="SendIcon" class="h-32 w-32" fit="cover" />
    </template>
  </scaffold>
</template>

<style scoped lang="scss"></style>
