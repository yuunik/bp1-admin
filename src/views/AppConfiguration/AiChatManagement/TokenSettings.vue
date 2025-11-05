<script setup>
import { ElMessage } from 'element-plus'
import { useCloned } from '@vueuse/core'

import { getUserAiUseCountApi, modifyUserAiUseCountApi } from '@/apis/appApi.js'

const isEditing = ref(false)

// ai使用的默认次数
const defaultTokenCount = ref(50)

// 编辑模式下的默认次数
const editTokenCount = ref(0)

// 获取ai使用的默认次数
const getDefaultTokenCount = async () => {
  const { data } = await getUserAiUseCountApi()
  defaultTokenCount.value = data
}

// 编辑ai使用次数
const handleEditTokenCount = async () => {
  try {
    await modifyUserAiUseCountApi({
      count: editTokenCount.value,
    })
    // 提示
    ElMessage.success('AI usage count updated successfully.')
    // 重新获取ai使用的默认次数
    getDefaultTokenCount()
  } finally {
    isEditing.value = false
  }
}

// 切换编辑模式
const handleSwitchEditMode = () => {
  const { cloned } = useCloned(defaultTokenCount.value)
  editTokenCount.value = cloned.value
  isEditing.value = true
}

getDefaultTokenCount()
</script>

<template>
  <!-- 分割线 -->
  <el-divider class="diver" />
  <div class="token-settings-container mx-32">
    <el-row :gutter="16" class="h-32! border-container mx-0!">
      <el-col :span="9">
        <span class="heading-body-body-12px-medium text-neutrals-grey-3">
          Plan
        </span>
      </el-col>
      <el-col :span="10">
        <span class="heading-body-body-12px-medium text-neutrals-grey-3">
          Token
        </span>
      </el-col>
      <el-col :span="5" />
    </el-row>
    <el-row :gutter="16" class="h-48! border-container mx-0! row-center!">
      <el-col :span="9">
        <span class="heading-body-body-12px-medium text-neutrals-off-black">
          Free Default
        </span>
      </el-col>
      <el-col :span="10">
        <span
          class="heading-body-body-12px-medium text-neutrals-off-black"
          v-if="!isEditing"
        >
          {{ defaultTokenCount }} / Month
        </span>
        <el-input
          placeholder="Type Here"
          v-model.number="editTokenCount"
          v-else
        >
          <template #suffix>
            <span class="heading-body-body-12px-regular text-neutrals-grey-3">
              / Month
            </span>
          </template>
        </el-input>
      </el-col>
      <el-col :span="5" class="flex-end!">
        <i
          class="icon-edit-line cursor-pointer"
          v-if="!isEditing"
          @click="handleSwitchEditMode"
        />
        <div class="flex" v-else>
          <el-button size="small" @click="isEditing = false">Cancel</el-button>
          <el-button size="small" type="primary" @click="handleEditTokenCount">
            Save
          </el-button>
        </div>
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
