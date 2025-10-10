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
    :showClose="false"
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

<style scoped lang="scss"></style>
