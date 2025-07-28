<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style scoped lang="scss">
// 给二级路由的组件添加淡入淡出效果
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: 300ms all linear;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
