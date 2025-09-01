<script setup>
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'

const route = useRoute()

onMounted(() => {
  nextTick(() => {})
})
</script>
<template>
  <router-view />
</template>
