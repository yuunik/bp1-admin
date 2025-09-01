<script setup>
defineProps({
  searchKeywords: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <el-input
    placeholder="Search..."
    class="brand-model-search"
    v-model="conditionSearchParams.searchText"
    @input="handleSearchByInput"
  >
    <template #prefix>
      <!-- 前置搜索图标 -->
      <i class="icon-typessearch h-16 w-16" />
    </template>
  </el-input>
</template>

<style scoped lang="scss"></style>
