<script setup>
import { Document, Picture as IconPicture } from '@element-plus/icons-vue'

import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import useDownFile from '@/composables/useDownFile.js'

defineProps({
  filePath: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
})

// 使用下载文件功能函数
const downFile = useDownFile()
</script>

<template>
  <!-- 显示图片 -->
  <el-image
    v-if="fileType === 'image'"
    :src="getFullFilePath(filePath)"
    fit="cover"
    class="h-168 rounded-8 w-full"
    lazy
    :preview-src-list="
      getFullFilePath(filePath) ? [getFullFilePath(filePath)] : []
    "
  >
    <template #error>
      <div class="image-slot">
        <el-icon><icon-picture /></el-icon>
      </div>
    </template>
  </el-image>
  <!-- 显示视频 -->
  <video
    v-else-if="fileType === 'video'"
    :src="getFullFilePath(filePath)"
    class="h-168 rounded-8 w-full"
    controls
  />
  <!-- 显示文件, 提供下载渠道 -->
  <div
    v-else-if="fileType === 'media'"
    class="file-slot rounded-8 default-transition hover:shadow-default cursor-pointer"
    @click.stop="downFile(filePath)"
  >
    <el-icon class="w-30 h-30"><Document /></el-icon>
  </div>
</template>

<style scoped lang="scss">
// 图片加载错误的样式
.image-slot,
.file-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}

.image-slot .el-icon {
  font-size: 30px;
}
</style>
