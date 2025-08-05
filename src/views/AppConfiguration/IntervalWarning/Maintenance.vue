<script setup>
import { reactive, toRefs } from 'vue'

import {
  getMaintenanceListApi,
  modifyMaintenanceDataApi,
} from '@/apis/appApi.js'

// 保养数据默认图标
import DefaultLogo from '@/assets/icons/maintenance-logo.svg'
import { getFormatNumber, getFullPath } from '@/utils/dataFormattedUtil.js'
import useFileUpload from '@/composables/useFileUpload.js'
import { ElMessage } from 'element-plus'

// 保养数据
const maintenanceList = reactive([])

// 获取保养数据列表
const getMaintenanceList = async () => {
  const { data } = await getMaintenanceListApi()
  const processData = data.map((item) => ({
    ...item,
    editing: false,
  }))
  maintenanceList.push(...processData)
}

// logo加载失败的回退行为
const onErrorImage = () => true

// 新增待添加的保养项目
const addNewMaintenanceItem = () => {
  maintenanceList.push({
    name: '',
    mileage: '',
    date: '',
    editing: true,
  })
}

// 文件上传
const fileUpload = useFileUpload()

// 编辑保养数据
const handleEditMaintenanceData = async (row) => {
  // 如果有本地预览图片文件, 则保存
  if (row.localLogo) {
    row.logo = row.localLogo
  }
  await modifyMaintenanceDataApi(row)
  // 提示
  ElMessage.success('Edit Success')
  row.editing = false
}

// 保养数据图标上传
const handleMaintenanceIconChange = async (file, row) => {
  // 文件上传, 本地预览
  await fileUpload.handleValidateImageUpload(file)
  // 保存logo
  row.localLogo = fileUpload.localFilePath.value
}

// 网络请求
getMaintenanceList()
</script>

<template>
  <div class="flex flex-1 flex-col px-32">
    <!-- 保养数据表格 -->
    <el-table :data="maintenanceList">
      <!-- 序号 -->
      <el-table-column type="index" label="No." :sortable="true" />
      <!-- 图标 -->
      <el-table-column label="Icon">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-avatar
              :src="row?.localLogo ? row?.localLogo : getFullPath(row?.logo)"
              fit="cover"
              :size="20"
              @error="onErrorImage"
            >
              <el-image :src="DefaultLogo" fit="cover" class="h-20 w-20" />
            </el-avatar>
            <el-upload
              :on-change="
                (uploadFile, _) => handleMaintenanceIconChange(uploadFile, row)
              "
              :auto-upload="false"
              :show-file-list="false"
            >
              <el-button text v-if="row?.editing">
                <template #icon>
                  <i
                    class="icon-upload-2-line branding-colours-primary h-16 w-16"
                  />
                </template>
                <span class="branding-colours-primary">Upload</span>
              </el-button>
            </el-upload>
          </div>
        </template>
      </el-table-column>
      <!-- 保养数据名称 -->
      <el-table-column prop="name" label="Maintenance Item" :sortable="true">
        <template #default="{ row }">
          <template v-if="row?.editing">
            <el-input
              v-model="row.name"
              placeholder="Type Here"
              class="w-full"
            />
          </template>
          <template v-else>
            <span class="neutrals-off-black">{{ row.name }}</span>
          </template>
        </template>
      </el-table-column>
      <!-- 建议保养公里数 -->
      <el-table-column prop="mileage" label="Mileage Interval" :sortable="true">
        <template #default="{ row }">
          <template v-if="row?.editing">
            <el-input
              v-model="row.mileage"
              placeholder="Type Here"
              class="w-full"
            >
              <template #suffix>
                <el-text type="info">km</el-text>
              </template>
            </el-input>
          </template>
          <template v-else>
            <span class="neutrals-off-black">
              {{ getFormatNumber(row?.mileage) }} km
            </span>
          </template>
        </template>
      </el-table-column>
      <!-- 保养时间 -->
      <el-table-column prop="date" label="Time Interval" :sortable="true">
        <template #default="{ row }">
          <template v-if="row?.editing">
            <el-input v-model="row.date" placeholder="Type Here" class="w-full">
              <template #suffix>
                <el-text type="info">day</el-text>
              </template>
            </el-input>
          </template>
          <template v-else>
            <span class="neutrals-off-black">{{ row.date }} days</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="{ row }">
          <template v-if="row?.editing">
            <el-button type="primary" @click="handleEditMaintenanceData(row)">
              Save
            </el-button>
          </template>
          <template v-else>
            <!-- 编辑 -->
            <i
              class="icon-edit-line mr-8 h-16 w-16 cursor-pointer"
              @click="row.editing = true"
            />
            <!-- 删除 -->
            <i class="icon-delete-bin-line h-16 w-16 cursor-pointer" />
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增按钮 -->
    <el-button
      type="primary"
      text
      class="mt-8 w-fit"
      @click="addNewMaintenanceItem"
    >
      <template #icon>
        <i class="icon-typesadd branding-colours-primary" />
      </template>
      <template #default>New Item</template>
    </el-button>
  </div>
</template>

<style scoped lang="scss">
// 重置 el-input 的样式
:deep(.el-input) {
  @apply rounded-12 h-32;

  .el-input__wrapper {
    @apply rounded-12 bg-[#EAEEF480];
  }
}
</style>
