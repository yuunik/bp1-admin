<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const htmlPath = '/editor/index.html'
const frameWidth = ref(window.innerWidth)

function handleResize() {
  frameWidth.value = window.innerWidth
}

onMounted(() => {
  document.documentElement.dataset.originalOverflow =
    document.documentElement.style.overflow
  document.body.dataset.originalOverflow = document.body.style.overflow

  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.documentElement.style.overflow =
    document.documentElement.dataset.originalOverflow || ''
  document.body.style.overflow = document.body.dataset.originalOverflow || ''

  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <iframe
    :src="htmlPath"
    :style="{ width: `${frameWidth}px`, height: '100vh', border: 'none' }"
    title="编辑器"
  ></iframe>
</template>

<style scoped lang="scss"></style>
