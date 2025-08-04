<script setup>
import { reactive } from 'vue'

// 实时预警数据列表
import { getLiveWarningDataListApi } from '@/apis/appApi.js'

const liveWarningDataList = reactive([])

// 获取实时预警数据列表
const getLiveWarningDataList = async () => {
  const { data } = await getLiveWarningDataListApi()

  // 处理数据，为每个项目添加详细描述行
  const processedData = []

  data.forEach(item => {
    // 添加主数据行
    processedData.push(item)

    // 添加详细描述行（跨列显示）
    processedData.push({
      isDetail: true,
      name: '', // 空的，因为这行会跨列显示
      detailText: 'abcdefghijklmnopqrstuvwxyz, abcdefghijklmnopqrstuvwxyz, abcdefghijklmnopqrstuvwxyz, abcdefghijklmnopqrstuvwxyz, abcdefghijklmnopqrstuvwxyz, abcdefghijklmnopqrstuvwxyz',
      groupKey: '',
      value: '',
      unit: ''
    })
  })

  // 更新实时预警数据
  liveWarningDataList.push(...processedData)
}

// 表格合并单元格方法
const spanMethod = ({ row, columnIndex }) => {
  // 如果这一行是详细描述行，让它跨越所有6列
  if (row.isDetail && columnIndex === 0) {
    return {
      rowspan: 1,
      colspan: 6 // 跨所有列：No, Item, Group, Warning, Unit, 操作列
    }
  } else if (row.isDetail && columnIndex > 0) {
    return {
      rowspan: 0,
      colspan: 0
    }
  }
}

// 网络请求
getLiveWarningDataList()
</script>

<template>
  <!-- 实时预警数据列表 -->
  <div>
    <el-table :data="liveWarningDataList" :default-expand-all="true" :span-method="spanMethod">
      <!-- 序号 -->
      <el-table-column label="No." min-width="7%" :sortable="true">
        <template #default="{ $index, row }">
          <div v-if="row.isDetail" class="detail-text-full">
            {{ row.detailText }}
          </div>
          <span v-else>{{ Math.floor($index / 2) + 1 }}</span>
        </template>
      </el-table-column>

      <!-- 指标名称 -->
      <el-table-column prop="name" label="Item" min-width="31%" :sortable="true">
        <template #default="{ row }">
          <el-text v-if="!row.isDetail">{{ row.name }}</el-text>
        </template>
      </el-table-column>

      <!-- 分组 -->
      <el-table-column prop="groupKey" label="Group" min-width="17%" :sortable="true" />

      <!-- 数值 -->
      <el-table-column prop="value" label="Warning" min-width="17%" :sortable="true" />

      <!-- 单位 -->
      <el-table-column prop="unit" label="Unit" min-width="17%" :sortable="true" />

      <!-- 操作列 -->
      <el-table-column min-width="11%">
        <template #default="{ row }">
          <div v-if="!row.isDetail">
            <i class="icon-edit-line mr-8 cursor-pointer" />
            <i class="icon-delete-bin-line cursor-pointer" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增按钮 -->
    <el-button type="primary" text>
      <template #icon>
        <i class="icon-typesadd" />
      </template>
      <template #default>New Item</template>
    </el-button>
  </div>
</template>

<style scoped lang="scss">
// 详细描述文本样式（跨全表格宽度）
.detail-text-full {
  color: #909399;
  font-size: 12px;
  line-height: 1.4;
  word-wrap: break-word;
  word-break: break-all;
  text-align: left;
  display: block;
  padding: 8px 12px;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
}

// 详细描述行的样式
:deep(.el-table__row) {
  &:has(.detail-text-full) {
    background-color: #fafafa;

    .el-table__cell {
      border-top: none !important;
      border-bottom: 1px solid #ebeef5 !important;
      padding: 4px 0;

      // 跨全表格的详情描述单元格（第一个单元格）
      &:first-child {
        .detail-text-full {
          // 文本左对齐到Item列的位置
          padding-left: calc(7% + 31% * 12px / 100%); // 序号列宽度 + Item列的左padding
        }
      }
    }
  }

  // 主数据行（详细描述行的前一行）- 去掉下边框
  &:has(+ .el-table__row .detail-text-full) {
    .el-table__cell {
      border-bottom: none !important;
    }
  }
}

// 确保详情描述行有正确的背景色和边框处理
:deep(.el-table__body) {
  tr {
    &:has(.detail-text-full) {
      background-color: #fafafa;

      td {
        background-color: #fafafa;
        border-top: none !important;
      }
    }

    // 主数据行如果后面跟着详细描述行，去掉下边框
    &:has(+ tr .detail-text-full) {
      td {
        border-bottom: none !important;
      }
    }
  }
}

// 确保表格容器不会隐藏伪元素创建的线条
:deep(.el-table) {
  overflow: visible;

  .el-table__body-wrapper {
    overflow: visible;
  }
}

// 如果上面的:has选择器不支持，使用这个备用方案
:deep(.el-table__body tr:nth-child(even)) {
  .detail-text-full {
    background-color: #fafafa;
  }
}
</style>
