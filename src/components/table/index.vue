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
      <el-table-column type="selection" align="center" width="50" v-if="showSelection" />
      <el-table-column label="序号" width="60" align="center" v-if="showIndex">
        <template #default="scope">
          {{ (page.index - 1) * page.size + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) in columns" :key="item.id" v-bind="item.attrs" @row-click.stop="rowClick(item, $event)">
        <template #default="scope" v-if="item.slot">
          <slot :row="scope.row" :id="item.id" :index="index" :name="item.slot"></slot>
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
    >
    </el-pagination>
  </div>
</template>

<script lang="js">
import { defineComponent, ref, reactive, onActivated } from 'vue'
export default defineComponent({
  props: {
    data: { type: Array, default: () => [] }, // 数据源
    columns: { type: Array, default: () => [] }, // 列表
    select: { type: Array, default: () => [] }, // 已选择的数据，与selection结合使用
    showIndex: { type: Boolean, default: false }, // 是否展示index选择，默认否
    showSelection: { type: Boolean, default: false }, // 是否展示选择框，默认否
    showPage: { type: Boolean, default: true }, // 是否展示页级组件，默认是
    page: { // 分页参数
      type: Object,
      default: () => {
        return { index: 1, size: 20, total: 0 }
      }
    },
    pageLayout: { type: String, default: "total, sizes, prev, pager, next, jumper" }, // 分页需要显示的东西，默认全部
    pageSizes: { type: Array, default: [10, 20, 50, 100] }
  },
  setup(props, context) {
    const table = ref(null)
    let timer = null
    // 分页相关：监听页码切换事件
    const handleCurrentChange = (val) => {
      if (timer) {
        props.page.index = 1
      } else {
        props.page.index = val
        context.emit("getTableData")
      }
    }
    // 分页相关：监听单页显示数量切换事件
    const handleSizeChange = (val) => {
      timer = 'work'
      setTimeout(() => {
        timer = null
      }, 100)
      props.page.size = val
      context.emit("getTableData", true)
    }
    // 选择监听器
    const handleSelectionChange = (val) =>{
      context.emit("selection-change", val)
    }
    const rowClick = (item) => {
      this.$emit('rowClick',item)
    }
    // 解决BUG：keep-alive组件使用时，表格浮层高度不对的问题
    onActivated(() => {
      table.value.doLayout()
    })
    return {
      table,
      rowClick,
      handleCurrentChange,
      handleSizeChange,
      handleSelectionChange
    }
  }
})
</script>

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