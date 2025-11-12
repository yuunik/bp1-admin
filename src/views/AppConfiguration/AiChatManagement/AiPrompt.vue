<script setup>
import VueMarkdown from 'vue-markdown-render'
import { CirclePlus, RemoveFilled } from '@element-plus/icons-vue'
import { useCloned, useDebounceFn } from '@vueuse/core'
import { ElMessage } from 'element-plus'

import BaseFilterInput from '@/components/BaseFilterInput.vue'
import {
  getAiChatRecordList,
  getAiPromptApi,
  modifyAiPromptApi,
} from '@/apis/appApi.js'

// 搜索参数
const searchKeyword = ref('')

// 分页参数
const paginationParams = reactive({
  currentPage: 0,
  total: 0,
  pageSize: 9999,
})

// 提问记录
const aiPromptList = ref([])

// 是否有更多的记录
const isHasMore = ref(true)

// 输入框内容
const editContent = ref('')

//  loading
const loading = ref(false)

// 获取提问记录
const getQuestionListByScroll = async () => {
  if (!isHasMore.value) {
    return
  }
  const { data } = await getAiChatRecordList({
    searchKey: searchKeyword.value,
    page: paginationParams.currentPage++,
    pageSize: paginationParams.pageSize,
  })
  aiPromptList.value = data.map((item) => ({ ...item, isExpand: false }))
  isHasMore.value = data.length === 0
}

const getAiPrompt = async () => {
  const { data, count } = await getAiPromptApi({
    searchKey: searchKeyword.value,
    page: paginationParams.currentPage,
    pageSize: paginationParams.pageSize,
  })
  aiPromptList.value = data.map((item) => ({
    ...item,
    isExpand: false,
    isEditable: false,
  }))
  isHasMore.value = data.length === 0
}

const handleSearchByInput = useDebounceFn(() => {
  paginationParams.currentPage && (paginationParams.currentPage = 0)
  getAiPrompt()
})

const sort = ref('')

const isExpand = ref(false)

const keyMap = {
  Prediction: 'prediction',
  'Fault Code': 'faultCode',
  Repair: 'repair',
  'Expense Item Cost': 'expenseItemCost',
  'Maintenance Setting': 'maintenanceSetting',
  'Report Info': 'reportInfo',
}

// 修改ai的回答文本
const handleEditAIAnswer = async (records) => {
  const params = {}

  const mappedKey = keyMap[records.key]
  if (mappedKey) {
    params[mappedKey] = editContent.value
  }

  try {
    await modifyAiPromptApi(params)
    ElMessage.success('AI prompt updated successfully.')
  } finally {
    getAiPrompt()
    isExpand.value = false
  }
}

// 展开行与折叠
const handleManageExpandRow = (record) => {
  record.isEditable && (record.isEditable = false)
  record.isExpand = !record.isExpand
}

// 切换编辑模式
const handleManageEditMode = (record) => {
  // 批量关闭编辑模式
  for (const item of aiPromptList.value) {
    item.isEditable && (item.isEditable = false)
  }
  try {
    loading.value = true
    const { cloned } = useCloned(record)
    editContent.value = cloned.value.value
    record.isEditable = true
  } finally {
    loading.value = false
  }
}

watch(isExpand, (val) => {
  for (const item of aiPromptList.value) {
    item.isExpand = val
  }
})

// 网络请求
getAiPrompt()
</script>

<template>
  <!-- 条件搜索 -->
  <!--<base-filter-input-->
  <!--  v-model="searchKeyword"-->
  <!--  @input-change="handleSearchByInput"-->
  <!--  class="mx-32"-->
  <!--/>-->
  <!-- 分割线 -->
  <el-divider class="diver" />
  <el-scrollbar
    class="table-container px-32 pb-32"
    @end-reached="getQuestionListByScroll"
    v-show="aiPromptList.length"
  >
    <!-- header -->
    <el-row class="row-center h-32">
      <el-col :span="2" class="text-align-center h-16">
        <el-icon
          class="h-16 w-16 cursor-pointer"
          v-if="!isExpand"
          @click="isExpand = true"
        >
          <CirclePlus />
        </el-icon>
        <el-icon
          class="w-16! h-16 cursor-pointer"
          v-else
          @click="isExpand = false"
        >
          <RemoveFilled />
        </el-icon>
      </el-col>
      <el-col :span="22" class="row-center h-16 gap-4">
        <span class="heading-body-body-12px-medium text-neutrals-grey-3">
          Category
        </span>
      </el-col>
    </el-row>
    <!-- divider -->
    <el-divider />
    <!-- content -->
    <template v-for="record in aiPromptList" :key="record.id">
      <el-row
        class="row-center default-transition hover:bg-neutrals-grey-1 w-full! box-border cursor-pointer py-8"
        :class="{ 'bg-[#E3EAF3]': record.isExpand }"
        @click.stop="handleManageExpandRow(record)"
      >
        <el-col :span="2" class="text-align-center h-16">
          <el-icon
            class="h-16 w-16 cursor-pointer"
            v-if="!record.isExpand"
            @click.stop="record.isExpand = true"
          >
            <CirclePlus />
          </el-icon>
          <el-icon
            class="w-16! h-16 cursor-pointer"
            v-else
            @click.stop="record.isExpand = false"
          >
            <RemoveFilled />
          </el-icon>
        </el-col>
        <el-col :span="22" class="row-center gap-4">
          <p
            class="heading-body-body-12px-medium text-neutrals-grey-4"
            :class="
              record.isExpand
                ? 'text-neutrals-off-black'
                : 'text-neutrals-grey-3'
            "
          >
            {{ record.key }}
          </p>
        </el-col>
      </el-row>
      <!-- expand -->
      <el-row
        class="px-8 py-16"
        :class="{ 'bg-[#eff4f9]': record.isExpand }"
        v-show="record.isExpand"
      >
        <el-col :span="2" />
        <el-col :span="22" class="flex flex-col gap-8">
          <div class="row-center">
            <p class="heading-body-body-12px-medium text-neutrals-grey-4">
              Prompt
            </p>
            <i
              class="icon-edit-line ml-8 cursor-pointer"
              v-if="!record.isEditable"
              @click.stop="handleManageEditMode(record)"
            />
            <div class="row-center ml-8 gap-8" v-else>
              <i
                class="icon-typesclose cursor-pointer"
                @click.stop="record.isEditable = false"
              />
              <i
                class="icon-check-line text-neutrals-blue ml-8 cursor-pointer"
                @click="handleEditAIAnswer(record)"
              />
            </div>
          </div>
          <!-- markdown 文本-->
          <vue-markdown
            :source="record?.value || ''"
            class="heading-body-body-12px-medium text-neutrals-off-black"
            v-if="!record.isEditable"
            v-loading="loading"
          />
          <el-input
            type="textarea"
            class="mt-4! answer-container"
            :autosize="true"
            v-model="editContent"
            v-else
          />
        </el-col>
      </el-row>
      <!-- divider -->
      <el-divider />
    </template>
  </el-scrollbar>
  <el-empty
    description="No data"
    v-show="!aiPromptList.length"
    class="m-auto!"
  />
</template>

<style scoped lang="scss">
.answer-container {
  :deep(.el-textarea__inner) {
    @apply rounded-12;
  }
}

.table-container :deep(.el-row) {
  @apply row-center;
}
</style>
