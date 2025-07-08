<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'

import MenuItem from '@/layout/components/MenuItem/index.vue'

// 接收数据的类型申明
interface MenuItemProp {
  userMenuRoutes: RouteRecordRaw[]
}

// 定义数据类型
defineProps<MenuItemProp>()
</script>

<template>
  <!-- 菜单栏子元素 -->
  <template v-for="route in userMenuRoutes" :key="route.path">
    <!-- 路由没有子路由 -->
    <el-menu-item :index="route.path" v-if="route.meta.isShow && !route.children">
      <!-- 菜单图标 -->
      <i :class="route.meta.icon" />
      <!-- 菜单标题 -->
      <template #title>
        <span>{{ route.meta.title }}</span>
      </template>
    </el-menu-item>
    <!-- 路由有且仅有一个子路由 -->
    <el-menu-item :index="route.children[0].path"
                  v-if="route.children && route.children.length === 1 && route.children[0].meta.isShow  ">
      <!-- 菜单图标 -->
      <i :class="route.children[0].meta.icon" />
      <!-- 菜单标题 -->
      <template #title>
        <span>{{ route.children[0].meta.title }}</span>
      </template>
    </el-menu-item>
    <!-- 路由有多个子路由 -->
    <el-sub-menu :index="route.path" v-if="route.children && route.children.length > 1">
      <!-- 标题插槽 -->
      <template #title>
        <!-- 菜单图标 -->
        <i :class="route.meta.icon" />
        <!-- 菜单标题 -->
        <span>{{ route.meta.title }}</span>
      </template>
      <!-- 子路由元素 -->
      <menu-item :userMenuRoutes="route.children" />
    </el-sub-menu>
  </template>
</template>

<style scoped lang="scss">

</style>