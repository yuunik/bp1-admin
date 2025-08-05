<script setup>
import VueMarkdown from 'vue-markdown-render'
import { ref } from 'vue'

const markdownStr = ref('# header')
</script>

<template>
  <vue-markdown :source="markdownStr" />
</template>

<style scoped lang="scss"></style>
