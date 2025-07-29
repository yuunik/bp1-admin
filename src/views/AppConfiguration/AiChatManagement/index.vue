<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

import { getAiManageQuestionListApi } from '@/apis/appApi.js'

// 当前的tab
const activeTab = ref('first')
// ai 问题列表
const aiQuestionList = reactive([])

// tab 点击事件
const handleTabChange = (tab) => (activeTab.value = tab)

// 获取 ai 问题列表
const getAiQuestionList = async () => {
  const { code, data, msg } = await getAiManageQuestionListApi()
  if (code === 0) {
    // 获取成功
    ElMessage.success('Get AI Question List Success')
    // 赋值
    Object.assign(aiQuestionList, data)
  } else {
    ElMessage.error(msg)
  }
}

// 网络请求
getAiQuestionList()
</script>

<template>
  <section class="AI-chat-management-container">
    <!-- AI Chat Management Header -->
    <div class="px-32 pb-16">
      <!-- 标题 -->
      <h3 class="heading-h2-20px-medium">AI Chat Management</h3>
      <!-- tabs 栏 -->
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="Preset Questions" name="first" />
        <el-tab-pane label="Usage Limit" name="second" />
        <el-tab-pane label="User Question Records" name="third" />
      </el-tabs>
    </div>
    <!-- 分割线 -->
    <el-divider class="diver m-0!" />
    <template v-if="activeTab === 'first'">
      <div class="px-32 pt-16 pb-38">
        <!-- ai 问题表格 -->
        <el-table :data="aiQuestionList">
          <el-table-column type="index" label="No." />
          <el-table-column prop="question" label="Question" />
          <el-table-column prop="useCount" label="Times Asked" />
          <el-table-column label="Status" :sortable="true">
            <!-- 月姐说了: 激活 1, 禁用 0 -->
            <template #default="{ row }">
              <el-switch
                v-model="row.status"
                :active-value="0"
                active-text="On"
                inactive-text="Off"
                :inactive-value="1"
              />
            </template>
          </el-table-column>
          <el-table-column min-width="64">
            <template #default="{ row }">
              <!-- 编辑 -->
              <i class="icon-edit-line w-16 h-16 mr-8" />
              <!-- 删除 -->
              <i class="icon-delete-bin-line w-16 h-16" />
            </template>
          </el-table-column>
        </el-table>
        <!-- 添加按钮 -->
        <el-button type="primary" text>
          <template #icon>
            <i class="icon-typesadd" />
          </template>
          <template #default>Add Question</template>
        </el-button>
      </div>
    </template>
    <template v-if="activeTab === 'second'">second tab content</template>
    <template v-if="activeTab === 'third'">third tab content</template>
  </section>
</template>

<style scoped lang="scss">
// 修改图标颜色
.icon-typesadd {
  &::before {
    color: $branding-colours-primary;
  }
}
</style>
