<script setup lang="ts">
import BaseSvgIcon from '@/components/BaseSvgIcon.vue'
import { getFullFilePath } from '@/utils/dataFormattedUtil'

import PDFIcon from '@/assets/specialIcons/icon_pdf.svg'
import XLSIcon from '@/assets/specialIcons/icon_xls.svg'
import TXTIcon from '@/assets/specialIcons/icon_txt.svg'

defineProps({
  info: {
    type: Object as PropType<{
      id: string
      name: string
      type: 'pdf' | 'image' | 'media' | 'video'
      path: string
      size: number
      createTime: number
    }>,
    required: true,
  },
})

// 映射关系
// export const ICON_MAP = Object.freeze({
//   pdf: PDFIcon,
//   image: 'img',
// })
</script>

<template>
  <div
    class="rounded-12 border-neutral-grey-1-1px row-center h-64 cursor-pointer gap-8 p-12"
    v-down-file="getFullFilePath(info.path)"
  >
    <!-- 图片 -->
    <el-image
      v-if="info.type === 'image'"
      :src="getFullFilePath(info.path)"
      class="border-neutral-grey-1-1px rounded-8 h-40 w-40"
      alt="Attachment image"
      fit="cover"
    />
    <!-- PDF -->
    <el-image
      v-else
      :src="PDFIcon"
      class="h-40 w-40"
      fit="cover"
      alt="Attachment pdf"
    />
    <div class="text-neutrals-grey-4 flex flex-1 flex-col gap-8">
      <p class="heading-body-body-12px-regular text-neutrals-off-black">
        {{ info.name || 'Untitled file' }}
      </p>
      <!--<div class="row-center gap-4">-->
      <!--  <el-avatar-->
      <!--    :size="20"-->
      <!--    src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"-->
      <!--  />-->
      <!--  <span class="heading-caption-caption-10px-regular">-->
      <!--          Bessie Cooper-->
      <!--        </span>-->
      <!--  <span class="heading-caption-caption-10px-regular">∙</span>-->
      <!--  <span class="heading-caption-caption-10px-regular">120 KB</span>-->
      <!--  <span class="heading-caption-caption-10px-regular">∙</span>-->
      <!--  <span class="heading-caption-caption-10px-regular">-->
      <!--          28/04/2024 3:30pm-->
      <!--        </span>-->
      <!--</div>-->
    </div>
    <div class="flex gap-8">
      <!-- 下载按钮 -->
      <!--<base-svg-icon-->
      <!--  name="down_line"-->
      <!--  color="#6F7788"-->
      <!--  size="16"-->
      <!--  class="cursor-pointer"-->
      <!--  v-down-file="getFullFilePath(info.path)"-->
      <!--/>-->
      <!-- 删除按钮 -->
      <!--<base-svg-icon name="delete-2" color="#6F7788" size="16" />-->
      <!-- 预览按钮 -->
      <i class="icon-typespassword" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.border-container {
  border: 1px solid #eaeef4;
}
</style>
