<script setup>
import { ref } from 'vue'

const activeTab = ref('first')

// tab 点击事件
const handleTabChange = (tab) => {
  activeTab.value = tab
}
</script>

<template>
  <section class="AI-chat-management-container">
    <!-- AI Chat Management Header -->
    <div class="px-32 pb-16">
      <!-- 标题 -->
      <h3 class="heading-h2-20px-medium">AI Chat Management</h3>
      <!-- tabs 栏 -->
      <el-tabs v-model="activeTab" @click="handleTabChange">
        <el-tab-pane label="Preset Questions" name="first" />
        <el-tab-pane label="Usage Limit" name="second" />
        <el-tab-pane label="User Question Records" name="third" />
      </el-tabs>
    </div>
    <!-- 分割线 -->
    <el-divider class="diver m-0!" />
    <template v-if="activeTab === 'first'">first tab content</template>
    <template v-if="activeTab === 'second'">second tab content</template>
    <template v-if="activeTab === 'third'">third tab content</template>
  </section>
</template>

<style scoped lang="scss"></style>
