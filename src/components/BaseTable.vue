<script setup lang="ts">
import { ref, onActivated } from 'vue'

const emit = defineEmits<{
  (e: 'getTableData', reset?: boolean): void
  (e: 'selection-change', val: any[]): void
  (e: 'rowClick', val: any): void
}>()

const props = defineProps({
  // 表格数据
  data: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  select: { type: Array, default: () => [] },
  showIndex: { type: Boolean, default: false },
  showSelection: { type: Boolean, default: false },
  showPage: { type: Boolean, default: true },
  page: {
    type: Object,
    default: () => ({
      index: 1,
      size: 20,
      total: 0,
    }),
  },
  pageLayout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100],
  },
})

const table = ref()

let timer: string | null = null

// 页码切换事件
const handleCurrentChange = (val: number) => {
  if (timer) {
    props.page.index = 1
  } else {
    props.page.index = val
    emit('getTableData')
  }
}

// 每页条数切换事件
const handleSizeChange = (val: number) => {
  timer = 'work'
  setTimeout(() => {
    timer = null
  }, 100)
  props.page.size = val
  emit('getTableData', true)
}

// 表格选择变更
const handleSelectionChange = (val: any[]) => {
  emit('selection-change', val)
}

// 行点击事件
const rowClick = (item: any) => {
  emit('rowClick', item)
}

// keep-alive bug 修复：动态布局计算
onActivated(() => {
  table.value?.doLayout()
})
</script>

<template>
  <div class="system-table-box">
    <el-table
      v-bind="$attrs"
      ref="table"
      class="system-table"
      height="100%"
      :data="data"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="50"
        v-if="showSelection"
      />
      <el-table-column label="序号" width="60" align="center" v-if="showIndex">
        <template #default="scope">
          {{ (page.index - 1) * page.size + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in columns"
        :key="item.id"
        v-bind="item.attrs"
        @row-click.stop="rowClick(item, $event)"
      >
        <template #default="scope" v-if="item.slot">
          <slot
            :row="scope.row"
            :id="item.id"
            :index="index"
            :name="item.slot"
          ></slot>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="showPage"
      v-model:current-page="page.index"
      class="system-page"
      background
      :layout="pageLayout"
      :total="page.total"
      :page-size="page.size"
      :page-sizes="pageSizes"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>

<style lang="scss" scoped>
.system-table-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  .system-table {
    flex: 1;
    height: 100%;
    :deep {
      th {
        background: #f8f9fa;
        color: #333;
      }
      .cell {
        font-size: 12px;
        font-weight: 500;
      }
    }
  }

  .system-page {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    &::before {
      display: none;
    }
  }
}
</style>
