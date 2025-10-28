<script setup>
import { ElMessage } from 'element-plus'

import { getUserAiUseCountApi, modifyUserAiUseCountApi } from '@/apis/appApi.js'

const isEditing = ref(false)

// ai使用的默认次数
const defaultTokenCount = ref(50)

// 获取ai使用的默认次数
const getDefaultTokenCount = async () => {
  const { data } = await getUserAiUseCountApi()
  defaultTokenCount.value = data
}

// 编辑ai使用次数
const handleEditTokenCount = async () => {
  try {
    await modifyUserAiUseCountApi({
      count: defaultTokenCount.value,
    })
    // 提示
    ElMessage.success('AI usage count updated successfully.')
    // 重新获取ai使用的默认次数
    getDefaultTokenCount()
  } finally {
    isEditing.value = false
  }
}

getDefaultTokenCount()
</script>

<template>
  <!-- 分割线 -->
  <el-divider class="diver" />
  <div class="token-settings-container mx-32">
    <el-row :gutter="32" class="h-32! border-container mb-8! mx-0!">
      <el-col :span="9">
        <span class="heading-body-body-12px-medium text-neutrals-grey-3">
          Plan
        </span>
      </el-col>
      <el-col :span="12">
        <span class="heading-body-body-12px-medium text-neutrals-grey-3">
          Token
        </span>
      </el-col>
      <el-col :span="1" />
    </el-row>
    <el-row :gutter="32" class="h-48! border-container mb-8! mx-0! row-center!">
      <el-col :span="9">
        <span class="heading-body-body-12px-medium text-neutrals-off-black">
          Free Default
        </span>
      </el-col>
      <el-col :span="12">
        <span
          class="heading-body-body-12px-medium text-neutrals-off-black"
          v-if="!isEditing"
        >
          {{ defaultTokenCount }} / Month
        </span>
        <el-input
          placeholder="Type Here"
          v-model.number="defaultTokenCount"
          v-else
        >
          <template #suffix>
            <span class="heading-body-body-12px-regular text-neutrals-grey-3">
              / Month
            </span>
          </template>
        </el-input>
      </el-col>
      <el-col :span="1">
        <i
          class="icon-edit-line cursor-pointer"
          v-if="!isEditing"
          @click="isEditing = true"
        />
        <el-button type="primary" v-else @click="handleEditTokenCount">
          Save
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.border-container {
  @apply border-b-solid border-b border-b-[#EAEEF4];
}

.token-settings-container {
  :deep(.el-input__wrapper) {
    @apply bg-neutrals-grey-1-with-50 shadow-none;
  }
}
</style>
