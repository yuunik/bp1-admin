<script setup>
defineProps({
  metricLabel: {
    type: String,
    required: true,
  },
  metricValue: {
    type: String,
    required: true,
  },
  bgColor: {
    type: String,
    default: 'bg-neutrals-grey-1',
  },
  metricValueTextColor: {
    type: String,
    default: 'text-neutrals-off-black',
  },
})
</script>

<template>
  <div :class="['rounded-8', 'flex', 'flex-col', 'gap-16', 'p-16', bgColor]">
    <!-- title -->
    <span class="heading-body-large-body-14px-regular text-neutrals-grey-4">
      {{ metricLabel }}
    </span>
    <!-- sub title -->
    <p :class="['heading-h1-26px-medium', 'leading-34', metricValueTextColor]">
      {{ metricValue }}
    </p>
  </div>
</template>

<style scoped lang="scss"></style>
