<script setup>
import { reactive } from 'vue'

// 实时预警数据列表
import { getLiveWarningDataListApi } from '@/apis/appApi.js'

const liveWarningDataList = reactive([])

// 获取实时预警数据列表
const getLiveWarningDataList = async () => {
  const { data } = await getLiveWarningDataListApi()
  // 动态数据
  const processedData = []

  for (const item of data) {
    // 添加主行信息
    processedData.push(item)

    // 添加 obdKey 描述信息
    processedData.push({
      name: 'objKey',
      obdKey: item.obdKey,
    })
  }

  // 更新实时预警数据
  liveWarningDataList.push(...processedData)
}

// 合并行
const getRowClass = ({ rowIndex }) =>
  rowIndex % 2 === 0 ? 'logical-row-start' : 'logical-row-end'

// obdKey 行的跨行处理
const handleTableSpan = ({ row, columnIndex }) => {
  if (row.name === 'objKey') {
    if (columnIndex === 1) return [1, 4]

    if (columnIndex >= 2 && columnIndex <= 4) {
      // 第3~5列都隐藏（被合并了）
      return [0, 0]
    }
  }
}

// 新增待添加事项
const addPendingItem = () => {
  liveWarningDataList.push(
    {
      editing: true,
      name: 'pendingItem',
      value: '',
      groupKey: '',
      warning: '',
      unit: '',
    },
    {
      editing: true,
      name: 'pendingItem',
      value: '',
      groupKey: '',
      warning: '',
      unit: '',
    },
  )
}

// 网络请求
getLiveWarningDataList()
</script>

<template>
  <!-- 实时预警数据列表 -->
  <div class="box-border flex flex-1 flex-col px-32">
    <el-table
      :data="liveWarningDataList"
      :row-class-name="getRowClass"
      :span-method="handleTableSpan"
      class="flex-[1_1_430px]"
    >
      <!-- 序号 -->
      <el-table-column type="index" label="No." min-width="7%" width="60">
        <template #default="{ row, $index }">
          <!-- 描述 -->
          <el-text v-show="row.name !== 'objKey'">
            {{ Math.floor($index / 2) + 1 }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Item" min-width="31%">
        <template #default="{ row }">
          <!-- 描述 -->
          <div
            v-if="row.name === 'objKey'"
            class="rounded-8 bg-neutrals-grey-1 p-8"
          >
            <el-text class="text-neutrals-grey-3">
              {{ row.obdKey === '' ? 'No obdKey' : row.obdKey }}
            </el-text>
          </div>
          <!-- 值 -->
          <div v-else>{{ row.value }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="groupKey" label="Group" min-width="17%" />
      <el-table-column prop="value" label="Warning" min-width="17%" />
      <el-table-column prop="unit" label="Unit" min-width="17%" />
      <el-table-column min-width="11%">
        <template #default="{ row }">
          <!-- 编辑 -->
          <i
            class="icon-edit-line mr-8 h-16 w-16 cursor-pointer"
            v-show="row.name !== 'objKey'"
          />
          <!-- 删除 -->
          <i
            class="icon-delete-bin-line h-16 w-16 cursor-pointer"
            v-show="row.name !== 'objKey'"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增按钮 -->
    <el-button type="primary" text class="w-100 h-32" @click="addPendingItem">
      <template #icon>
        <i class="icon-typesadd branding-colours-primary" />
      </template>
      <template #default>New Item</template>
    </el-button>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-table__row.logical-row-start > td) {
  border: none !important;
}

/* 当鼠标悬浮在逻辑第一行时，同时高亮第二行 */
:deep(.el-table__row.logical-row-start:hover) {
  cursor: pointer;
}

:deep(.el-table__row.logical-row-end:hover) {
  cursor: pointer;
}

:deep(.logical-row-start:hover + .logical-row-end) {
  background-color: red;
}

/* 阻止 logical-row-end 自己 hover 出现高亮 */
.el-table__row.logical-row-end:hover {
  background-color: inherit !important;
}
</style>
