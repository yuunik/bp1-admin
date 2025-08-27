<script setup lang="ts">
import { computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'

// 定义分页数据类型
interface PaginationType {
  currentPage: number
  total: number
  pageSize: number
}

// 定义接收数据的类型
interface PaginationPropsType {
  pagination: PaginationType
  handlePageChange: (currentPage: number, pageSize: number) => void
}

const pagination = defineModel<PaginationType>({
  required: true,
})

// 处理分页的变化
const onPageChange = useDebounceFn((): void => {
  // 是否超出总页数的校验
  if (pagination.value.currentPage > pagination.value.total) {
    // 重置当前页数
    return
  }
}, 500)

// 当前页数
const currentPageDisplay = computed({
  get: () => pagination.value.currentPage + 1,
  set: (val: number) => {
    const totalPages = Math.max(
      1,
      Math.ceil(pagination.value.total / pagination.value.pageSize),
    )
    const page = Math.max(1, Math.min(val, totalPages)) // 限制范围
    pagination.value.currentPage = page - 1
  },
})

// 总页数
const totalPages = computed(() =>
  Math.ceil(
    pagination.value.total / pagination.value.pageSize < 1
      ? 1
      : pagination.value.total / pagination.value.pageSize,
  ),
)

// 上一页是否禁用
const isPreDisabled = computed(() => pagination.value.currentPage <= 0)

// 上一页
const handlePreChange = () => {
  if (isPreDisabled.value) {
    return
  }
  pagination.value.currentPage--
}

// 下一页是否禁用
const isNextDisabled = computed(
  () => pagination.value.currentPage >= totalPages.value - 1,
)

// 下一页
const handleNextChange = () => {
  if (isNextDisabled.value) {
    return
  }
  pagination.value.currentPage++
}
</script>

<template>
  <!-- 分页 -->
  <el-pagination
    class="pagination-container flex-center mt-16 gap-8"
    v-model:current-page="pagination.currentPage"
    v-model:page-size="pagination.pageSize"
    layout="slot"
    :total="pagination.total"
    @change="onPageChange"
  >
    <i
      class="i-ep:arrow-left h-20 w-20 cursor-pointer"
      @click="handlePreChange"
    />
    <!-- 输入框 -->
    <el-input
      v-model="currentPageDisplay"
      class="neutrals-grey-4"
      @change="onPageChange"
    />
    <!-- 总页数 -->
    <span class="heading-body-body-12px-regular neutrals-grey-3">
      of
      {{ totalPages }}
      pages
    </span>
    <i
      class="i-ep:arrow-right h-20 w-20 cursor-pointer"
      @click="handleNextChange"
    />
  </el-pagination>
</template>

<style scoped lang="scss">
// 分页器样式重置
.pagination-container {
  // 输入框
  :deep(.el-input) {
    width: 40px;
    height: 24px;
    margin-right: 8px;

    .el-input__wrapper {
      border-radius: 8px;
    }
  }

  // 上一页
  :deep(.btn-prev) {
    background-color: transparent;
  }

  // 下一页
  :deep(.btn-next) {
    background-color: transparent;
  }
}
</style>
