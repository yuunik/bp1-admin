<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

import { getPredictionListApi, modifyPredictionDataApi } from '@/apis/appApi.js'

import DefaultLogo from '@/assets/icons/maintenance-logo.svg'
import { getFullPath } from '@/utils/dataFormattedUtil.js'
import useFileUpload from '@/composables/useFileUpload.js'

// 预测数据列表
const predictionList = reactive([])

// 文件上传逻辑
const fileUpload = useFileUpload()

// 获取预测数据
const getPredictionList = async () => {
  const { data } = await getPredictionListApi()
  const processed = data.map((item) => ({
    ...item,
    editing: false,
  }))
  predictionList.push(...processed)
}

// logo加载失败的回退行为
const onErrorImage = () => true

// 添加新预测项目
const addNewPredictionItem = () => {
  predictionList.push({
    id: '',
    name: '',
    date: '',
    logo: '',
    localLogo: '',
    editing: true,
  })
}

// 提交编辑数据
const handleEditPredictionData = async (row) => {
  if (row.localLogo) {
    row.logo = row.localLogo
  }
  await modifyPredictionDataApi(row)
  ElMessage.success('Edit Success')
  row.editing = false
}

// 图标上传
const handlePredictionIconChange = async (file, row) => {
  await fileUpload.handleValidateImageUpload(file)
  row.localLogo = fileUpload.localFilePath.value
}

// 初始化数据
getPredictionList()
</script>

<template>
  <div class="flex flex-1 flex-col px-32">
    <el-table :data="predictionList">
      <!-- 序号 -->
      <el-table-column type="index" label="No." />
      <!-- 图标 -->
      <el-table-column label="Icon">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-avatar
              :src="row?.localLogo ? row.localLogo : getFullPath(row.logo)"
              fit="cover"
              :size="20"
              @error="onErrorImage"
            >
              <el-image :src="DefaultLogo" fit="cover" class="h-20 w-20" />
            </el-avatar>
            <el-upload
              :on-change="
                (uploadFile, _) => handlePredictionIconChange(uploadFile, row)
              "
              :auto-upload="false"
              :show-file-list="false"
            >
              <el-button text v-if="row.editing">
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
      <!-- 故障名称 -->
      <el-table-column prop="name" label="Fault Name">
        <template #default="{ row }">
          <template v-if="row.editing">
            <el-input
              v-model="row.name"
              placeholder="Type Here"
              class="w-full"
            />
          </template>
          <template v-else>
            <span>{{ row.name }}</span>
          </template>
        </template>
      </el-table-column>
      <!-- 预测天数 -->
      <el-table-column prop="date" label="Predicted (days)">
        <template #default="{ row }">
          <template v-if="row.editing">
            <el-input v-model="row.date" placeholder="Type Here" class="w-full">
              <template #suffix>
                <el-text type="info">days</el-text>
              </template>
            </el-input>
          </template>
          <template v-else>
            <span>{{ row.date }} days</span>
          </template>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column>
        <template #default="{ row }">
          <template v-if="row.editing">
            <el-button type="primary" @click="handleEditPredictionData(row)">
              Save
            </el-button>
          </template>
          <template v-else>
            <i
              class="icon-edit-line mr-8 h-16 w-16 cursor-pointer"
              @click="row.editing = true"
            />
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
      @click="addNewPredictionItem"
    >
      <template #icon>
        <i class="icon-typesadd branding-colours-primary" />
      </template>
      <template #default>New Prediction</template>
    </el-button>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-input) {
  @apply rounded-12 h-32;
  .el-input__wrapper {
    @apply rounded-12 bg-[#EAEEF480];
  }
}
</style>
