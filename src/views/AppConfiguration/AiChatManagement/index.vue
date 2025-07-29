<script setup>
import { ref, reactive, nextTick, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'

import {
  addAiQuestionApi,
  deleteAiQuestionApi,
  getAiQuestionListApi,
  modifyAiQuestionApi,
} from '@/apis/appApi.js'
import { AIChatManagementTab } from '@/utils/constantsUtil.js'

// 当前的tab
const activeTab = ref(AIChatManagementTab.PRESET_QUESTIONS)
// ai 问题列表
const aiQuestionList = reactive([])
// 待添加的问题
const addQuestion = ref('')

// tab 点击事件
const handleTabChange = (tab) => {
  console.log(tab)
}

// 获取 ai 问题列表
const getAiQuestionList = async () => {
  const { code, data, msg } = await getAiQuestionListApi()
  if (code === 0) {
    // 获取成功
    ElMessage.success('Get AI Question List Success')
    // 赋值
    Object.assign(aiQuestionList, data)
  } else {
    ElMessage.error(msg)
  }
}

// 输入框引用
const questionInputRef = ref()
// 删除定时器
let deleteTimer = null

// 新增一行, 并默认设置为草稿
const handleAddQuestion = async () => {
  aiQuestionList.push({
    question: '',
    isDraft: true,
  })

  // 等待 DOM 更新后聚焦到输入框
  await nextTick()
  questionInputRef.value?.focus()
}

// 确认添加问题
const handleConfirmAdd = async () => {
  // 取消删除定时器
  if (deleteTimer) {
    clearTimeout(deleteTimer)
    deleteTimer = null
  }

  // 添加问题
  const question = addQuestion.value.trim()
  if (question) {
    // 新增问题
    const { data } = await addAiQuestionApi(question)
    // 新增问题成功
    ElMessage.success('Add AI Question List Success')
    // 刷新列表
    getAiQuestionList()
    // 清空输入框
    addQuestion.value = ''
  }
}

// 处理跨行
const handleTableSpan = ({ row, columnIndex }) => {
  if (row.isDraft) {
    // 新增状态下,
    if (columnIndex === 1) {
      return [1, 3]
    }
    if (columnIndex === 2 || columnIndex === 3) {
      return [0, 0]
    }
  } else if (row.isEdit) {
    // 编辑状态下,
    if (columnIndex === 1) {
      return [1, 3]
    }
    if (columnIndex === 2 || columnIndex === 3) {
      return [0, 0]
    }
  }
}

// 处理新增问题输入框失焦事件
const handleAddQuestionByBlur = () => {
  // 延迟执行删除，给点击 Add 按钮留出时间
  deleteTimer = setTimeout(() => {
    aiQuestionList.splice(aiQuestionList.length - 1, 1)
  }, 150) // 150ms 延迟，足够处理按钮点击
}

// 关闭编辑问题状态
const handleEditQuestionStatusChange = (row) => {
  const findItem = aiQuestionList.find((item) => item.id === row.id)
  if (!findItem.isEdit) {
    // 切换为编辑状态
    findItem.isEdit = true
    return
  }
  // 切换为非编辑状态
  findItem.isEdit = !findItem.isEdit
}

// 处理确认编辑问题
const handleConfirmEdit = async (row, isChangeStatus = true) => {
  // 编辑问题
  await modifyAiQuestionApi(row)
  // 编辑问题成功
  ElMessage.success('Modify AI Question List Success')
  if (isChangeStatus) {
    // 取消编辑状态
    handleEditQuestionStatusChange(row)
  }
}

// 删除问题
const handleDeleteQuestion = async (id) => {
  // 删除问题
  await deleteAiQuestionApi(id)
  // 删除问题（从列表中删除）
  aiQuestionList.splice(
    aiQuestionList.findIndex((item) => item.id === id),
    1,
  )
  // 删除成功
  ElMessage.success('Delete AI Question List Success')
}

// 网络请求
getAiQuestionList()

// 组件销毁时，取消定时器
onBeforeUnmount(() => {
  if (deleteTimer) {
    clearTimeout(deleteTimer)
    deleteTimer = null
  }
})
</script>

<template>
  <section class="AI-chat-management-container">
    <!-- AI Chat Management Header -->
    <div class="px-32 pb-16">
      <!-- 标题 -->
      <h3 class="heading-h2-20px-medium">AI Chat Management</h3>
      <!-- tabs 栏 -->
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
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
    <el-divider class="diver m-0!" />
    <template v-if="activeTab === AIChatManagementTab.PRESET_QUESTIONS">
      <div class="px-32 pt-16 pb-38">
        <!-- ai 问题表格 -->
        <el-table :data="aiQuestionList" :span-method="handleTableSpan">
          <el-table-column type="index" label="No." column-key="No." />
          <el-table-column
            prop="question"
            label="Question"
            column-key="question"
          >
            <template #default="{ row }">
              <template v-if="row.isDraft">
                <el-input
                  v-model="addQuestion"
                  ref="questionInputRef"
                  class="question-input"
                  placeholder="Enter question..."
                  @blur="handleAddQuestionByBlur"
                  @keydown="handleConfirmAdd"
                />
              </template>
              <template v-else-if="row.isEdit">
                <el-input
                  v-model="row.question"
                  @keydown="handleConfirmEdit(row)"
                />
              </template>
              <template v-else>
                <el-text>{{ row.question }}</el-text>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="useCount"
            label="Times Asked"
            column-key="useCount"
          >
            <template #default="{ row }">
              <el-text v-if="!row.isDraft && !row.isEdit">
                {{ row.useCount }}
              </el-text>
            </template>
          </el-table-column>
          <el-table-column label="Status" :sortable="true" column-key="status">
            <!-- 月姐说了: 激活 1, 禁用 0 -->
            <template #default="{ row }">
              <el-switch
                v-model="row.status"
                :active-value="0"
                active-text="On"
                inactive-text="Off"
                :inactive-value="1"
                @change="handleConfirmEdit(row, false)"
              />
            </template>
          </el-table-column>
          <el-table-column min-width="64" column-key="actions">
            <template #default="{ row }">
              <template v-if="row.isDraft">
                <el-button type="primary" @click="handleConfirmAdd">
                  Add
                </el-button>
              </template>
              <template v-else-if="row.isEdit">
                <el-button @click="handleEditQuestionStatusChange(row)">
                  Cancel
                </el-button>
                <el-button type="primary" @click="handleConfirmEdit(row)">
                  Save
                </el-button>
              </template>
              <template v-else>
                <!-- 编辑 -->
                <i
                  class="icon-edit-line w-16 h-16 mr-8 cursor-pointer"
                  @click="handleEditQuestionStatusChange(row)"
                />
                <!-- 删除 -->
                <i
                  class="icon-delete-bin-line w-16 h-16 cursor-pointer"
                  @click="handleDeleteQuestion(row?.id)"
                />
              </template>
            </template>
          </el-table-column>
        </el-table>
        <!-- 添加按钮 -->
        <el-button type="primary" text @click="handleAddQuestion">
          <template #icon>
            <i class="icon-typesadd" />
          </template>
          <template #default>Add Question</template>
        </el-button>
      </div>
    </template>
    <template v-if="activeTab === AIChatManagementTab.USAGE_LIMIT">
      second tab content
    </template>
    <template v-if="activeTab === AIChatManagementTab.USER_QUESTION_RECORDS">
      third tab content
    </template>
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
</style>
