<template>
  <router-view />
</template>

<style lang="scss" scoped>
// 图片加载失败时显示的占位图样式
:deep(.image-error) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;

  .el-icon {
    font-size: 16px;
  }
}
</style>
