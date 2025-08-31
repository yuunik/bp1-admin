<script setup>
import { ref } from 'vue'
import { ForumManagementTab } from '@/utils/constantsUtil.js'

import Posts from './PostList.vue'
import Comments from './CommentsList.vue'

// 当前的tab
const activeTab = ref(ForumManagementTab.POSTS)

// tab 点击事件
const handleTabChange = (tab) => (activeTab.value = tab)

// tab 内容区
const tabMap = Object.freeze({
  [ForumManagementTab.POSTS]: Posts,
  [ForumManagementTab.COMMENTS]: Comments,
})
</script>

<template>
  <router-view v-if="$route.name === 'Post Details'" />
  <section class="flex h-full flex-col gap-16" v-else>
    <!-- Forum Management Header -->
    <div class="px-32">
      <!-- 标题 -->
      <h3 class="heading-h2-20px-medium">Forum Management</h3>
    </div>
    <!-- tabs 栏 -->
    <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="mx-32">
      <el-tab-pane
        :label="ForumManagementTab.POSTS"
        :name="ForumManagementTab.POSTS"
      />
      <el-tab-pane
        :label="ForumManagementTab.COMMENTS"
        :name="ForumManagementTab.COMMENTS"
      />
    </el-tabs>
    <!-- 搜索栏 -->
    <div class="flex-between mx-32 flex">
      <!-- 条件搜索 -->
      <el-input
        placeholder="Search..."
        class="brand-model-search"
        v-model="searchText"
        @input="getBrandModelList"
      >
        <template #prefix>
          <!-- 前置搜索图标 -->
          <i class="icon-typessearch h-16 w-16" />
        </template>
      </el-input>
      <!-- 状态搜索 -->
      <el-dropdown :hide-on-click="false">
        <span
          class="border-1 neutrals-grey-3 flex cursor-pointer gap-5 rounded-full border-solid border-[#CACFD8] px-8 py-4"
        >
          Status
          <i class="icon-typesdropdown" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item disabled>Action 4</el-dropdown-item>
            <el-dropdown-item divided>Action 5</el-dropdown-item>
            <el-dropdown-item divided>Action 6</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
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

// 搜索框
.brand-model-search {
  // 输入框样式重置
  :deep(.el-input__wrapper) {
    box-shadow: none;
    background-color: transparent;
  }
}
</style>
