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
  { key: IntervalWarningTab.PREDICTION, component: Prediction },
  { key: IntervalWarningTab.LIVE_DATA_WARNING, component: LiveDataWarning },
])

// tab 切换
const handleTabChange = (tab) => (activeTab.value = tab)
</script>

<template>
  <section class="flex h-full flex-col">
    <!-- 标题 -->
    <h3 class="leading-32 h-32 px-32">
      {{ RouteName.INTERVAL_WARNING }}
    </h3>
    <!-- 内容 -->
    <div class="flex flex-1 flex-col">
      <!-- tab 栏-->
      <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="px-32">
        <el-tab-pane
          v-for="tab in tabArray"
          :key="tab.key"
          :label="tab.key"
          :name="tab.key"
        />
      </el-tabs>
      <!-- 分割线 -->
      <el-divider />
      <!-- tab 内容 -->
      <keep-alive>
        <component
          :is="tabArray.find((tab) => tab.key === activeTab).component"
        />
      </keep-alive>
    </div>
  </section>
</template>

<style scoped lang="scss"></style>
