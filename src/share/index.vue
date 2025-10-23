<template>
  <div class="h5-container">
    <router-view />
  </div>
</template>

<style scoped lang="scss">
// Robot 字体
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

.h5-container {
  @apply h-full;
  font-family: 'Roboto', sans-serif;

  // 重置 el-button 样式
  :deep(.el-button) {
    /* 基础背景和边框 */
    --el-button-bg-color: #202834;
    --el-button-border-color: #202834;
    --el-button-text-color: #ffffff; /* 显式设置文字颜色 */

    /* 轮廓按钮的边框颜色（用于 plain 或 outline 按钮）*/
    --el-button-outline-color: #3a4252; /* 稍亮一点的灰色 */

    /* 按钮激活（按下）时的颜色 */
    --el-button-active-color: #ffffff;
    --el-button-active-bg-color: #181e28; /* 稍暗 */
    --el-button-active-border-color: #181e28;

    /* Hover 状态 */
    --el-button-hover-text-color: #ffffff;
    --el-button-hover-bg-color: #2a3240; /* 稍亮 */
    --el-button-hover-border-color: #2a3240;

    /* 链接按钮 hover 文字色（如果适用）*/
    --el-button-hover-link-text-color: #6b7d9a; /* 可选，若使用 link 类型 */

    /* Disabled 状态 */
    --el-button-disabled-text-color: #5a6270;
    --el-button-disabled-bg-color: #2c3442;
    --el-button-disabled-border-color: #2c3442;

    border-radius: 12px !important;

    &::before,
    .el-button__inner {
      border-radius: inherit !important;
    }
  }
}
</style>
