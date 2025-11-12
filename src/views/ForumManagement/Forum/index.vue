<script setup>
import { ref } from 'vue'
import {
  EmitterEvent,
  ForumManagementTab,
  RouteName,
} from '@/utils/constantsUtil.js'

import Posts from './PostList.vue'
import Comments from './CommentsList.vue'
import emitter from '@/utils/emitterUtil.js'

// 当前的tab
const activeTab = ref(ForumManagementTab.POSTS)

// tab 点击事件
const handleTabChange = (tab) => (activeTab.value = tab)

// tab 内容区
const tabMap = Object.freeze({
  [ForumManagementTab.POSTS]: Posts,
  [ForumManagementTab.COMMENTS]: Comments,
})

// 切换到帖子列表
const goToPostList = () => {
  activeTab.value = ForumManagementTab.POSTS
}

// 跳转到评论列表
const goToCommentList = () => {
  activeTab.value = ForumManagementTab.COMMENTS
}

// 修改面包屑
emitter.emit(EmitterEvent.UPDATE_BREADCRUMB_LIST, [])
</script>

<template>
  <section class="flex h-full flex-col gap-16 overflow-auto">
    <!-- Forum Management Header -->
    <div class="px-32">
      <!-- 标题 -->
      <h3 class="heading-h2-20px-medium">Forum Management</h3>
    </div>
    <!-- tabs 栏 -->
    <el-tabs
      v-model="activeTab"
      @tab-change="handleTabChange"
      class="tabs-container"
    >
      <el-tab-pane
        :label="ForumManagementTab.POSTS"
        :name="ForumManagementTab.POSTS"
      />
      <el-tab-pane
        :label="ForumManagementTab.COMMENTS"
        :name="ForumManagementTab.COMMENTS"
      />
    </el-tabs>
    <!-- tab 内容区 -->
    <keep-alive>
      <component :is="tabMap[activeTab]" />
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

.tabs-container :deep(.el-tabs__header) {
  border-bottom: none;
}
</style>
