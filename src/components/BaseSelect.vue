<template>
  <div
    class="filter-select"
    :class="{ active: isShow || isSelected }"
    :title="title"
  >
    <slot name="header">
      <base-svg-icon v-if="icon !== ''" :name="icon" :size="iconSize" />
      <span class="title">{{ title }}</span>
      <el-icon
        v-if="!isShow"
        size="12px"
        color="rgba(125, 124, 120, 1)"
        style="margin-top: 2px"
      >
        <ArrowDown />
      </el-icon>
      <el-icon
        v-else
        size="12px"
        color="rgba(125, 124, 120, 1)"
        style="margin-top: 2px"
      >
        <ArrowUp />
      </el-icon>
    </slot>
    <!-- 默认插槽，暴露 changeVisible 方法 -->
    <slot :visible="changeVisible" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import BaseSvgIcon from '@/components/BaseSvgIcon.vue'

const props = defineProps({
  icon: {
    type: String,
    default: 'document.svg',
  },
  title: {
    type: String,
    default: '',
  },
  iconSize: {
    type: String,
    default: '14px',
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
})

const isShow = ref(false)

function change(e) {
  console.log(e)
}

function changeVisible(e) {
  isShow.value = e
}
</script>

<style scoped lang="scss">
.filter-select {
  font-size: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 2px 8px;
  color: #7d7c78;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  position: relative;
  &.active {
    background-color: rgba(197, 224, 243, 0.3);
    border: 1px solid rgba(197, 224, 243, 1);
    color: rgba(60, 103, 138, 1);
  }
  .title {
    max-width: 240px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
  }

  .base-svg-hover {
    --color: #a5a4a1 !important;
    --hover-color: #a5a4a1 !important;
  }
  &:hover,
  &.active {
    background: rgba(197, 224, 243, 0.3);
    border-color: #c5e0f3;
    color: #3c678a;
    .base-svg-hover {
      --color: #3c678a !important;
      --hover-color: #3c678a !important;
    }
  }
  :deep {
    .el-dropdown {
      position: static !important;
    }
  }
}
:deep {
  .slot-style {
    cursor: pointer;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    padding: 0;
    margin: 0;
    & > div {
      height: 100%;
      min-height: auto;
    }
  }
}
</style>
