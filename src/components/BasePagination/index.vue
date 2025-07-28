<script setup lang="ts">
import { PropType, toRefs } from 'vue'
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

// 申明接收的数据
const { pagination, handlePageChange } = defineProps({
  pagination: {
    type: Object as PropType<PaginationType>,
    required: true,
  },
  handlePageChange: {
    type: Function as PropType<(currentPage: number, pageSize: number) => void>,
    required: true,
  },
})

// 处理分页的变化
const onPageChange = useDebounceFn((): void => {
  // 是否超出总页数的校验
  if (pagination.currentPage.value > pagination.total.value) {
    // 重置当前页数
    return
  }
  // 调用父组件的分页方法
  handlePageChange(pagination.currentPage, pagination.pageSize)
}, 500)
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
      v-model="pagination.currentPage"
      class="neutrals-grey-4"
      @change="onPageChange"
    />
    <!-- 总页数 -->
    <span class="heading-body-body-12px-regular neutrals-grey-3">
      of
      {{ Math.ceil(pagination.total / pagination.pageSize) }}
      pages
    </span>
  </el-pagination>
</template>

<style scoped lang="scss">
// 分页器样式重置
.pagination-container {
  :deep(.el-input) {
    width: 40px;
    height: 24px;
    margin-right: 8px;

    .el-input__wrapper {
      border-radius: 8px;
    }
  }
}
</style>
