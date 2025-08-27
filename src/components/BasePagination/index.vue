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
</script>

<template>
  <!-- 分页 -->
  <el-pagination
    class="pagination-container flex-center mt-16"
    v-model:current-page="pagination.currentPage"
    v-model:page-size="pagination.pageSize"
    layout="prev, slot, next"
    :total="pagination.total"
    @change="onPageChange"
  >
    <!-- 输入框 -->
    <el-input
      v-model="currentPageDisplay"
      class="neutrals-grey-4"
      @change="onPageChange"
    />
    <!-- 总页数 -->
    <span class="heading-body-body-12px-regular neutrals-grey-3">
      of
      {{
        Math.ceil(
          pagination.total / pagination.pageSize < 1
            ? 1
            : pagination.total / pagination.pageSize,
        )
      }}
      pages
    </span>
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
