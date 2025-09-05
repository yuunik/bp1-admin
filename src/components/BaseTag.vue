<script setup>
defineProps({
  color: {
    required: true,
  },
  text: {
    required: true,
  },
})

const colorStyleMap = Object.freeze({
  green: {
    bg: 'bg-status-colours-light-green',
    text: 'text-status-colours-green',
  },
  orange: {
    bg: 'bg-status-colours-light-orange',
    text: 'text-status-colours-orange',
  },
  purple: {
    bg: 'bg-status-colours-light-purple',
    text: 'text-status-colours-purple',
  },
  blue: {
    bg: 'bg-status-colours-light-blue',
    text: 'text-status-colours-blue',
  },
  red: {
    bg: 'bg-status-colours-light-red',
    text: 'text-status-colours-red',
  },
  yellow: {
    bg: 'bg-status-colours-light-yellow',
    text: 'text-status-colours-yellow',
  },
  gray: {
    bg: 'bg-neutrals-grey-1',
    text: 'text-neutrals-grey-4',
  },
})
</script>

<template>
  <i
    :class="[
      'rounded-4',
      'w-fit',
      'block',
      'px-8',
      'py-4',
      'box-border',
      colorStyleMap[color]?.bg,
    ]"
  >
    <span :class="['text-14', 'font-400', colorStyleMap[color]?.text]">
      {{ text }}
    </span>
  </i>
</template>

<style scoped lang="scss"></style>
