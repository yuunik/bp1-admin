<!-- components/SvgIcon.vue -->

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** 图标名称（对应 svg 文件名） */
  name: string
  /** 宽高尺寸，可以是 '16px'、16 等 */
  size?: string | number
  /** 填充颜色 */
  color?: string
  /** 自定义类名 */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: '16px',
  color: 'currentColor',
  className: '',
})

const iconName = computed(() => `#icon-${props.name}`)
const svgClass = computed(() =>
  props.className ? `svg-icon ${props.className}` : 'svg-icon',
)
</script>
<template>
  <svg
    :class="svgClass"
    :style="{ width: size, height: size }"
    aria-hidden="true"
  >
    <use :href="iconName" :fill="color" />
  </svg>
</template>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
  overflow: hidden;
}
</style>
