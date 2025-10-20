<script setup>
const dialogVisible = defineModel({
  required: true,
})

defineProps({
  title: {
    type: String,
    default: 'Warning',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  buttonType: {
    type: String,
    default: 'primary',
  },
  dialogWidth: {
    type: String,
    default: '520',
  },
  showCloseButton: {
    type: Boolean,
    default: false,
  },
})

// 定义事件
const emit = defineEmits(['confirm', 'cancel'])

// 取消按钮点击
const cancel = () => {
  emit('cancel') // 触发 cancel 事件
  // dialogVisible.value = false
}

// 确认按钮点击
const confirm = () => emit('confirm')
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="dialogWidth"
    align-center
    :showClose="showCloseButton"
  >
    <slot name="content" />
    <template #footer>
      <slot name="descriptionFooter" />
      <el-button @click="cancel">{{ cancelText }}</el-button>
      <el-button :type="buttonType" @click="confirm">
        {{ confirmText }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
// 重置对话框样式
:deep(.el-dialog) {
  padding: 0 !important;

  // 对话框头部
  .el-dialog__header {
    --el-dialog-title-font-size: 20px;
    --el-dialog-font-line-height: 30px;
    --el-text-color-primary: #1b1a1e;
    @apply pl-16 pt-24;

    // 对话框标题
    .el-dialog__title {
      @apply font-medium;
    }
  }

  // 对话框内容
  .el-dialog__body {
    @apply px-16 pb-24;
  }

  // 对话框底部
  .el-dialog__footer {
    @apply row-center gap-16 p-16;
    border-top: 1px solid #eaeef4;

    .el-button {
      @apply flex-1;
      margin: 0;
    }
  }
}
</style>
