<script setup>
import { reactive } from 'vue'

import {
  addLivingDataWarningDataApi,
  getLiveWarningDataListApi,
  modifyLivingDataWarningDataApi,
} from '@/apis/appApi.js'

// 实时预警数据列表
const liveWarningDataList = ref([])

// 获取实时预警数据列表
const getLiveWarningDataList = async () => {
  const { data } = await getLiveWarningDataListApi()
  // 动态数据
  const processedData = []

  for (const item of data) {
    // 添加主行信息
    processedData.push({ ...item, editing: false })

    // 添加 obdKey 描述信息
    processedData.push({
      name: 'obdKey',
      obdKey: item.obdKey,
    })
  }

  // 更新实时预警数据
  liveWarningDataList.value = processedData
}

// 合并行
const getRowClass = ({ rowIndex }) =>
  rowIndex % 2 === 0 ? 'logical-row-start' : 'logical-row-end'

// obdKey 行的跨行处理
const handleTableSpan = ({ row, columnIndex }) => {
  if (row.name === 'obdKey') {
    if (columnIndex === 1) return [1, 4]

    if (columnIndex >= 2 && columnIndex <= 4) {
      // 第3~5列都隐藏（被合并了）
      return [0, 0]
    }
  }
}

// 新增待添加事项
const addPendingItem = () => {
  liveWarningDataList.value.push(
    {
      editing: true,
      name: '',
      minValue: '',
      maxValue: '',
      groupKey: '',
      unit: '',
    },
    {
      editing: true,
      name: 'obdKey',
      obdKey: '',
    },
  )
}

// 修改实时预警数据的状态为编辑状态
const handleEditLiveDataWarningDataStatusChange = (row, index) => {
  liveWarningDataList.value[index].editing = true
  liveWarningDataList.value[++index].editing = true
}

// 编辑或新增实时预警数据
const handleLiveDateWarningManage = async (index) => {
  if (liveWarningDataList.value[index].id) {
    handleEditLiveDataWarningData(index)
  } else {
    handleAddLiveDataWarningData(index)
  }
}

// 修改实时预警数据
const handleEditLiveDataWarningData = async (index) => {
  await modifyLivingDataWarningDataApi({
    id: liveWarningDataList.value[index].id,
    name: liveWarningDataList.value[index].name,
    minValue: liveWarningDataList.value[index].minValue,
    maxValue: liveWarningDataList.value[index].maxValue,
    groupKey: liveWarningDataList.value[index].groupKey,
    obdKey: liveWarningDataList.value[index + 1].obdKey,
    unit: liveWarningDataList.value[index].unit,
  })
  // 关闭编辑状态
  liveWarningDataList.value[index].editing = false
  liveWarningDataList.value[index + 1].editing = false
}

// 新增实时预警数据
const handleAddLiveDataWarningData = async (index) => {
  await addLivingDataWarningDataApi({
    id: liveWarningDataList.value[index].id,
    name: liveWarningDataList.value[index].name,
    minValue: liveWarningDataList.value[index].minValue,
    maxValue: liveWarningDataList.value[index].maxValue,
    groupKey: liveWarningDataList.value[index].groupKey,
    obdKey: liveWarningDataList.value[index + 1].obdKey,
    unit: liveWarningDataList.value[index].unit,
  })
  //// 关闭编辑状态
  liveWarningDataList.value[index].editing = false
  liveWarningDataList.value[index + 1].editing = false
  // 刷新列表
  getLiveWarningDataList()
}

// 关闭新增或编辑模式
const handleCancel = (index) => {
  if (liveWarningDataList.value[index].id) {
    liveWarningDataList.value[index].editing = false
    liveWarningDataList.value[index + 1].editing = false
  } else {
    liveWarningDataList.value.splice(index, 2)
  }
}

// 网络请求
getLiveWarningDataList()
</script>

<template>
  <!-- 实时预警数据列表 -->
  <el-scrollbar class="pb-38 box-border overflow-auto px-32">
    <el-table
      :data="liveWarningDataList"
      :row-class-name="getRowClass"
      :span-method="handleTableSpan"
      width="100%"
    >
      <!-- 序号 -->
      <el-table-column type="index" label="No." min-width="7%">
        <template #default="{ row, $index }">
          <!-- 描述 -->
          <el-text v-show="row.name !== 'obdKey'">
            {{ Math.floor($index / 2) + 1 }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Item" min-width="31%">
        <template #default="{ row }">
          <template v-if="row.editing">
            <template v-if="row.name !== 'obdKey'">
              <el-input
                placeholder="Item Name"
                class="w-full"
                v-model="row.name"
              />
            </template>
            <template v-if="row.name === 'obdKey'">
              <el-input
                placeholder="ObdKey Name"
                class="w-full"
                v-model="row.obdKey"
              />
            </template>
          </template>
          <template v-else>
            <!-- 描述 -->
            <div
              v-if="row.name === 'obdKey'"
              class="rounded-8 bg-neutrals-grey-1 p-8"
            >
              <el-text class="text-neutrals-grey-3">
                {{ row.obdKey === '' ? 'No obdKey' : row.obdKey }}
              </el-text>
            </div>
            <!-- 值 -->
            <div v-else>{{ row.name }}</div>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="groupKey" label="Group" min-width="17%">
        <template #default="{ row }">
          <template v-if="row.editing">
            <el-input
              placeholder="Group"
              class="w-full"
              v-model="row.groupKey"
            />
          </template>
          <template v-else>
            <!-- 值 -->
            <div>{{ row.groupKey }}</div>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="Warning" min-width="17%">
        <template #default="{ row }">
          <template v-if="row.editing">
            <div class="warning-container">
              <el-input
                placeholder="Minimum value"
                v-model="row.minValue"
                class="flex-1"
              />
              -
              <el-input
                placeholder="Maximum value"
                v-model="row.maxValue"
                class="flex-1"
              />
            </div>
          </template>
          <template v-else>
            <!-- 值 -->
            <span v-if="row.minValue === '-100100100'">
              < {{ row.maxValue }}
            </span>
            <span v-else-if="row.maxValue === '-100100100'">
              {{ row.minValue }} <
            </span>
            <span v-else>{{ row.minValue }} - {{ row.maxValue }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="Unit" min-width="17%">
        <template #default="{ row }">
          <template v-if="row.editing">
            <el-input placeholder="Unit" class="w-full" v-model="row.unit" />
          </template>
          <template v-else>
            <!-- 值 -->
            <div>{{ row.unit }}</div>
          </template>
        </template>
      </el-table-column>
      <el-table-column min-width="11%">
        <template #default="{ row, $index }">
          <template v-if="row.editing">
            <div class="flex gap-3 pr-4">
              <el-button
                class="rounded-8!"
                @click="handleCancel($index)"
                v-show="row.name !== 'obdKey'"
              >
                Cancel
              </el-button>
              <el-button
                type="primary"
                class="rounded-8!"
                @click="handleLiveDateWarningManage($index)"
                v-show="row.name !== 'obdKey'"
              >
                {{ row.id ? 'Save' : 'Add' }}
              </el-button>
            </div>
          </template>
          <template v-else>
            <!-- 编辑 -->
            <i
              class="icon-edit-line text-24 inline-flex h-48 w-48 cursor-pointer items-center justify-center"
              v-show="row.name !== 'obdKey'"
              @click="handleEditLiveDataWarningDataStatusChange(row, $index)"
            />
            <!-- 删除 -->
            <i
              class="icon-delete-bin-line text-24 inline-flex h-48 w-48 cursor-pointer items-center justify-center"
              v-show="row.name !== 'obdKey'"
              @click="handleDelete(row, $index)"
            />
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      type="primary"
      text
      class="w-100 mt-8 h-32"
      @click="addPendingItem"
    >
      <template #icon>
        <i class="icon-typesadd text-16 text-neutrals-blue" />
      </template>
      <template #default>New Item</template>
    </el-button>
  </el-scrollbar>
</template>

<style scoped lang="scss">
:deep(.el-table__row.logical-row-start > td) {
  border: none !important;
}

/* 当鼠标悬浮在逻辑第一行时，同时高亮第二行 */
//:deep(.el-table__row.logical-row-start:hover) {
//  cursor: pointer;
//}
//
//:deep(.el-table__row.logical-row-end:hover) {
//  cursor: pointer;
//}
//}

:deep(.el-table__row.logical-row-start:hover) {
  background-color: transparent !important;

  > td {
    background-color: transparent !important;
  }
}

:deep(.el-table__row.logical-row-start:hover + .el-table__row.logical-row-end) {
  background-color: transparent !important;
}

:deep(.el-table__row.logical-row-end:hover) {
  background-color: transparent !important;

  > td {
    background-color: transparent !important;
  }
}

:deep(.el-table__row.logical-row-end:hover + .el-table__row.logical-row-start) {
  background-color: transparent !important;
}

// 警告容器样式重置
.warning-container {
  @apply rounded-12 row-center h-32 bg-[#EAEEF480];
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
    inset;
}
.warning-container :deep(.el-input) {
  @apply h-32;

  .el-input__wrapper {
    @apply bg-transparent shadow-none;
  }
}
</style>
