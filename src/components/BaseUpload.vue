<script setup>
import { ElMessage } from 'element-plus'

defineProps({
  defaultAvatarText: {
    type: String,
    default: 'A',
  },
})

const emit = defineEmits(['getLocalFile'])

// logo 加载失败的默认显示
const errorAvatarHandler = () => true

// 文件的本地路径
const localFilePath = ref('')

// 待上传的文件
const uploadFile = ref(null)

// 文件名
const uploadFileName = ref('')

// 上传图片的基本校验
const handleValidateImageUpload = (file) => {
  const { raw, name } = file
  // 文件类型校验
  const isImage = raw.type.startsWith('image/')
  if (!isImage) {
    // 不是图片, 则提示
    ElMessage.error('Please upload an image file')
    return
  }
  // 记录文件路径
  localFilePath.value = URL.createObjectURL(raw)
  // 记录待上传的文件
  uploadFile.value = raw
  // 文件名
  uploadFileName.value = name
  // 触发父组件事件
  emit('getLocalFile', raw)
}
</script>

<template>
  <div class="w-400 flex h-80 flex-1 gap-24">
    <!-- logo -->
    <el-avatar
      :size="64"
      :src="localFilePath"
      fit="cover"
      @error="errorAvatarHandler"
    >
      <!-- logo 加载失败的默认显示 -->
      <i class="flex-center h-64 w-64">
        <span class="heading-h1-26px-medium neutrals-off-black">
          {{ defaultAvatarText }}
        </span>
      </i>
    </el-avatar>
    <!-- desc -->
    <div class="flex flex-col">
      <p class="heading-body-large-body-14px-medium text-strong-950 mb-12">
        {{ uploadFileName.value ? uploadFileName.value : 'Upload logo' }}
      </p>
      <span class="heading-body-body-12px-regular text-neutrals-grey-3 mb-16">
        Min 400x400px, PNG or JPEG
      </span>
      <!-- 更换 logo 图片 -->
      <el-upload
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleValidateImageUpload"
      >
        <template #trigger>
          <el-button>
            {{ localFilePath.value ? 'Change' : 'Upload' }}
          </el-button>
        </template>
      </el-upload>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
