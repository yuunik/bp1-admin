<script setup>
import { defineProps } from 'vue'

import { getFullFilePath } from '@/utils/dataFormattedUtil.js'

// 接收外部传入的 logo 和 name
defineProps({
  logo: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  avatarSize: {
    type: Number,
    default: 20,
  },
  nameStyle: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="flex items-center">
    <el-avatar
      v-if="logo"
      :size="avatarSize"
      :src="getFullFilePath(logo)"
      alt="brand icon"
      class="mr-8 h-20 w-20"
      fit="cover"
      shape="circle"
      @error="() => true"
    >
      <template #error>
        <i class="i-ep:picture" />
      </template>
    </el-avatar>
    <span :class="nameStyle">{{ name || '-' }}</span>
  </div>
</template>

<style scoped lang="scss"></style>
