<script setup>
import VueMarkdown from 'vue-markdown-render'
import {
  CirclePlus,
  RemoveFilled,
  SortDown,
  SortUp,
} from '@element-plus/icons-vue'
import { useDebounceFn } from '@vueuse/core'

import BaseFilterInput from '@/components/BaseFilterInput.vue'
import { getAiChatRecordList } from '@/apis/appApi.js'
import { getDateWithDDMMMYYYYhhmma } from '@/utils/dateUtil.js'

// 搜索参数
const searchKeyword = ref('')

// 分页参数
const paginationParams = reactive({
  currentPage: 0,
  total: 0,
  pageSize: 9999,
})

// 提问记录
const aiChatRecordList = ref([])

// 是否有更多的记录
const isHasMore = ref(true)

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
  // aiChatRecordList.value.push(
  //   ...data.map((item) => ({ ...item, isExpand: false })),
  // )
  aiChatRecordList.value = data.map((item) => ({ ...item, isExpand: false }))
  isHasMore.value = data.length === 0
}

const getQuestionList = async () => {
  const { data, count } = await getAiChatRecordList({
    searchKey: searchKeyword.value,
    page: paginationParams.currentPage,
    pageSize: paginationParams.pageSize,
  })
  aiChatRecordList.value = data.map((item) => ({ ...item, isExpand: false }))
  isHasMore.value = data.length === 0
}

const handleSearchByInput = useDebounceFn(() => {
  paginationParams.currentPage && (paginationParams.currentPage = 0)
  getQuestionList()
})

const sort = ref('')

const isExpand = ref(false)

watch(isExpand, (val) => {
  for (const item of aiChatRecordList.value) {
    item.isExpand = val
  }
})

// 网络请求
getQuestionList()
</script>

<template>
  <!-- 条件搜索 -->
  <base-filter-input
    v-model="searchKeyword"
    @input-change="handleSearchByInput"
    class="mx-32"
  />
  <!-- 分割线 -->
  <el-divider class="diver" />
  <el-scrollbar
    class="px-32 pb-32"
    @end-reached="getQuestionListByScroll"
    v-show="aiChatRecordList.length"
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
      <el-col :span="4" class="row-center h-16 gap-4">
        <span class="heading-body-body-12px-medium text-neutrals-grey-3">
          Date
        </span>
        <el-icon class="h-16 w-16" v-if="sort === ''" @click="sort = 'desc'">
          <Sort />
        </el-icon>
        <el-icon
          class="h-16 w-16"
          v-else-if="sort === 'desc'"
          @click="sort = 'asc'"
        >
          <SortDown />
        </el-icon>
        <el-icon
          class="h-16 w-16"
          v-else-if="sort === 'asc'"
          @click="sort = ''"
        >
          <SortUp />
        </el-icon>
      </el-col>
      <el-col :span="18" class="row-center h-16 gap-4">
        <span class="heading-body-body-12px-medium text-neutrals-grey-3">
          Question
        </span>
      </el-col>
    </el-row>
    <!-- divider -->
    <el-divider />
    <!-- content -->
    <template v-for="record in aiChatRecordList" :key="record.id">
      <el-row
        class="row-center default-transition hover:bg-neutrals-grey-1 w-full! box-border cursor-pointer py-8"
        :class="{ 'bg-[#E3EAF3]': record.isExpand }"
        @click.stop="record.isExpand = !record.isExpand"
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
        <el-col :span="4" class="row-center gap-4">
          <span
            class="heading-body-body-12px-medium"
            :class="
              record.isExpand
                ? 'text-neutrals-off-black'
                : 'text-neutrals-grey-3'
            "
          >
            {{ getDateWithDDMMMYYYYhhmma(record.createTime) }}
          </span>
        </el-col>
        <el-col :span="18" class="row-center gap-4">
          <p
            class="heading-body-body-12px-medium text-neutrals-grey-3"
            :class="
              record.isExpand
                ? 'text-neutrals-off-black'
                : 'text-neutrals-grey-3'
            "
          >
            {{ record.question }}
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
          <p class="heading-body-body-12px-medium text-neutrals-grey-4">
            Answer
          </p>
          <!-- markdown 文本-->
          <vue-markdown
            :source="record?.answer || ''"
            class="heading-body-body-12px-medium text-neutrals-off-black"
          />
        </el-col>
      </el-row>
      <!-- divider -->
      <el-divider />
    </template>
  </el-scrollbar>
  <el-empty
    description="No data"
    v-show="!aiChatRecordList.length"
    class="m-auto!"
  />
</template>

<style scoped lang="scss"></style>
