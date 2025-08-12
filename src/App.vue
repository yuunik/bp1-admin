<script setup>
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useHead } from '@unhead/vue'

const route = useRoute()

const metaList = computed(() => {
  console.log(route.path)
  if (route.path.startsWith('/share/vehicle-report')) {
    return []
  }

  return [
    {
      name: 'viewport',
      content:
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
    },
  ]
})

useHead({
  meta: metaList,
})

onMounted(() => {
  nextTick(() => {})
})
</script>
<template>
  <router-view />
</template>
