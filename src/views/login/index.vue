<script setup>

</script>

<template>
  <div class="bg-container flex-between p-8 gap-8">
    <div class="text-white">Left</div>
    <div class="text-white">Right</div>
  </div>
</template>

<style scoped lang="scss">
.bg-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-image: linear-gradient(to bottom, $branding-colours-gradient-b, $branding-colours-gradient-e);
}
</style>