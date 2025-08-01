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
  // 如果这一行是详细描述行，让它从Item列开始跨4列显示
  if (row.isDetail && columnIndex === 1) {
    return {
      rowspan: 1,
      colspan: 4 // 跨4列：Item, Group, Warning, Unit
    }
  } else if (row.isDetail && (columnIndex === 2 || columnIndex === 3 || columnIndex === 4)) {
    return {
      rowspan: 0,
      colspan: 0
    }
  }
  // 对于详细描述行，隐藏操作列
  else if (row.isDetail && columnIndex === 5) {
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
      <el-table-column type="index" label="No." min-width="7%" :sortable="true" />

      <!-- 指标名称 -->
      <el-table-column prop="name" label="Item" min-width="31%" :sortable="true">
        <template #default="{ row }">
          <div v-if="row.isDetail" class="detail-text">
            {{ row.detailText }}
          </div>
          <el-text v-else>{{ row.name }}</el-text>
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
// 详细描述文本样式
.detail-text {
  color: #909399;
  font-size: 12px;
  line-height: 1.4;
  padding: 8px 0;
  word-wrap: break-word;
  word-break: break-all;
}

// 详细描述行的样式
:deep(.el-table__row) {
  &:has(.detail-text) {
    background-color: #fafafa;

    .el-table__cell {
      border-top: none;
      padding: 4px 0;
    }
  }
}

// 如果上面的:has选择器不支持，使用这个备用方案
:deep(.el-table__body tr:nth-child(even)) {
  .detail-text {
    background-color: #fafafa;
  }
}
</style>
