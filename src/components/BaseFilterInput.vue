<script setup>
const searchKeywords = defineModel({
  required: true,
})

const emit = defineEmits(['inputChange'])

const isShowInputContent = ref(false)

const inputRef = ref(null)

const handleInput = () => emit('inputChange')

watch(isShowInputContent, (val) => {
  if (val) {
    setTimeout(() => {
      inputRef.value.focus()
    }, 100)
  }
})
</script>

<template>
  <div
    class="row-center w-200 h-16 cursor-pointer gap-8"
    @click="isShowInputContent = true"
    v-if="!isShowInputContent"
  >
    <i class="icon-mail-send-line-1 text-16" />
    <span class="heading-body-body-12px-regular text-neutrals-grey-3 flex-1">
      Search...
    </span>
  </div>
  <el-input
    v-else
    placeholder="Search..."
    class="w-300! h-24"
    v-model="searchKeywords"
    @clear="isShowInputContent = false"
    @input="handleInput"
    ref="inputRef"
    clearable
  />
</template>

<style scoped lang="scss">
:deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

:deep(.el-input__wrapper::after) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: $status-colours-blue;
  pointer-events: none;
}
</style>
