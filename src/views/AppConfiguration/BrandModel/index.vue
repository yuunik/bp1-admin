<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" class="h-full w-full overflow-auto" />
  </router-view>
</template>
