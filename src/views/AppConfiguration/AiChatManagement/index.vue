<script setup>
import { ref } from 'vue'
import { AIChatManagementTab } from '@/utils/constantsUtil.js'

import PresetQuestions from './PresetQuestions.vue'
import TokenSettings from './TokenSettings.vue'
import UserQuestionRecords from './UserQuestionRecords.vue'
import AiPrompt from './AiPrompt.vue'

// 当前的tab
const activeTab = ref(AIChatManagementTab.PRESET_QUESTIONS)

// tab 内容区
const tabMap = Object.freeze({
  [AIChatManagementTab.PRESET_QUESTIONS]: PresetQuestions,
  [AIChatManagementTab.USER_QUESTION_RECORDS]: UserQuestionRecords,
  [AIChatManagementTab.TOKEN_SETTINGS]: TokenSettings,
  [AIChatManagementTab.AI_PROMPT]: AiPrompt,
})
</script>

<template>
  <section class="flex h-full flex-col gap-16 overflow-auto">
    <!-- 标题 -->
    <h3 class="heading-h2-20px-medium text-neutrals-off-black mx-32">
      AI Chat Management
    </h3>
    <!-- tabs 栏 -->
    <el-tabs v-model="activeTab" class="tabs-container">
      <el-tab-pane
        :label="AIChatManagementTab.PRESET_QUESTIONS"
        :name="AIChatManagementTab.PRESET_QUESTIONS"
      />
      <el-tab-pane
        :label="AIChatManagementTab.USER_QUESTION_RECORDS"
        :name="AIChatManagementTab.USER_QUESTION_RECORDS"
      />
      <el-tab-pane
        :label="AIChatManagementTab.TOKEN_SETTINGS"
        :name="AIChatManagementTab.TOKEN_SETTINGS"
      />
      <el-tab-pane
        :label="AIChatManagementTab.AI_PROMPT"
        :name="AIChatManagementTab.AI_PROMPT"
      />
    </el-tabs>
    <!-- tab 内容区 -->
    <keep-alive>
      <component :is="tabMap[activeTab]" class="min-h-0 flex-1 overflow-auto" />
    </keep-alive>
  </section>
</template>

<style scoped lang="scss">
// 取消 tabs 的下划线
.tabs-container :deep(.el-tabs__header) {
  border-bottom: none;
}

// 修改图标颜色
.icon-typesadd {
  &::before {
    color: $branding-colours-primary;
  }
}

:deep(.el-input__wrapper) {
  border-radius: 12px;
}

// 重置激活状态的文字颜色
:deep(.el-switch__label.is-active) {
  color: $neutrals-grey-4;
}
</style>
