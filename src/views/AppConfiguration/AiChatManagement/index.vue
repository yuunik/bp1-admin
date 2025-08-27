<script setup>
import { ref } from 'vue'
import { AIChatManagementTab } from '@/utils/constantsUtil.js'

import PresetQuestions from './PresetQuestions.vue'
import UsageLimit from './UsageLimit.vue'
import UserQuestionRecords from './UserQuestionRecords.vue'

// 当前的tab
const activeTab = ref(AIChatManagementTab.PRESET_QUESTIONS)

// tab 点击事件
const handleTabChange = (tab) => (activeTab.value = tab)

// tab 内容区
const tabMap = Object.freeze({
  [AIChatManagementTab.PRESET_QUESTIONS]: PresetQuestions,
  [AIChatManagementTab.USAGE_LIMIT]: UsageLimit,
  [AIChatManagementTab.USER_QUESTION_RECORDS]: UserQuestionRecords,
})
</script>

<template>
  <section class="flex h-full flex-col">
    <!-- AI Chat Management Header -->
    <div class="px-32">
      <!-- 标题 -->
      <h3 class="heading-h2-20px-medium">AI Chat Management</h3>
      <!-- tabs 栏 -->
      <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="my-16">
        <el-tab-pane
          :label="AIChatManagementTab.PRESET_QUESTIONS"
          :name="AIChatManagementTab.PRESET_QUESTIONS"
        />
        <el-tab-pane
          :label="AIChatManagementTab.USAGE_LIMIT"
          :name="AIChatManagementTab.USAGE_LIMIT"
        />
        <el-tab-pane
          :label="AIChatManagementTab.USER_QUESTION_RECORDS"
          :name="AIChatManagementTab.USER_QUESTION_RECORDS"
        />
      </el-tabs>
    </div>
    <!-- 分割线 -->
    <el-divider class="diver" />
    <!-- tab 内容区 -->
    <keep-alive>
      <component :is="tabMap[activeTab]" class="min-h-0 flex-1 overflow-auto" />
    </keep-alive>
  </section>
</template>

<style scoped lang="scss">
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
