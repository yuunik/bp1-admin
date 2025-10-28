<script setup>
import { getUserAiUseCountApi } from '@/apis/appApi.js'

const isEditing = ref(false)

// ai使用的默认次数
const defaultTokenCount = ref(50)

// 获取ai使用的默认次数
const getDefaultTokenCount = async () => {
  console.log('1111111111')
  const { data } = await getUserAiUseCountApi()
  defaultTokenCount.value = data
}

getDefaultTokenCount()
</script>

<template>
  <!-- 分割线 -->
  <el-divider class="diver" />
  <div class="mx-32">
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
        <span class="heading-body-body-12px-medium text-neutrals-off-black">
          {{ defaultTokenCount }} / Month
        </span>
      </el-col>
      <el-col :span="1">
        <i class="icon-edit-line" v-if="isEditing" />
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
</style>
