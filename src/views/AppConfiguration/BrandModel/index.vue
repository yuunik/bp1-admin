<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" class="h-full w-full" />
  </router-view>
</template>
