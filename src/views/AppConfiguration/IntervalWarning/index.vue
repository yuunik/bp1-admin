<script setup>
import { ref } from 'vue'

import { IntervalWarningTab, RouteName } from '@/utils/constantsUtil.js'
import Maintenance from '@/views/AppConfiguration/IntervalWarning/Maintenance.vue'
import Prediction from '@/views/AppConfiguration/IntervalWarning/Prediction.vue'
import LiveDataWarning from '@/views/AppConfiguration/IntervalWarning/LiveDataWarning.vue'

// 当前tab页
const activeTab = ref(IntervalWarningTab.MAINTENANCE)

// 当前的 tab 名称
const tabArray = Object.freeze([
  { key: IntervalWarningTab.MAINTENANCE, component: Maintenance },
  // { key: IntervalWarningTab.PREDICTION, component: Prediction },
  { key: IntervalWarningTab.LIVE_DATA_WARNING, component: LiveDataWarning },
])

// tab 切换
const handleTabChange = (tab) => (activeTab.value = tab)
</script>

<template>
  <section class="flex h-full flex-1 flex-col gap-16 overflow-auto">
    <!-- 标题 -->
    <h3 class="leading-32 h-32 px-32">
      {{ RouteName.INTERVAL_WARNING }}
    </h3>
    <!-- tab 栏-->
    <el-tabs
      v-model="activeTab"
      @tab-change="handleTabChange"
      class="tabs-container"
    >
      <el-tab-pane
        v-for="tab in tabArray"
        :key="tab.key"
        :label="tab.key"
        :name="tab.key"
      />
    </el-tabs>
    <!-- 分割线 -->
    <el-divider />
    <!-- 内容 -->
    <!-- tab 内容 -->
    <keep-alive>
      <component
        :is="tabArray.find((tab) => tab.key === activeTab).component"
        class="min-h-0 flex-1"
      />
    </keep-alive>
  </section>
</template>

<style scoped lang="scss">
// 取消 tabs 的下划线
.tabs-container :deep(.el-tabs__header) {
  border-bottom: none;
}

// 重置 el-input 的样式
:deep(.el-input) {
  @apply rounded-12 h-32;

  .el-input__wrapper {
    @apply rounded-12 bg-[#EAEEF480];
  }
}
</style>
