<script setup>
import { useRouter } from 'vue-router'

import MenuItem from '@/layout/components/MenuItem/index.vue'

// 定义数据类型
defineProps({
  userMenuRoutes: {
    type: Array,
    required: true,
  },
  /* 递归层数 */
  level: {
    type: Number,
    default: 1,
  },
})

const router = useRouter()
// 路由跳转
const handleNavigation = (path) => router.push(path)
</script>

<template>
  <!-- 菜单栏子元素 -->
  <template v-for="route in userMenuRoutes" :key="route.path">
    <!-- 一级路由判断逻辑 -->
    <template v-if="level === 1">
      <!-- 路由没有子路由 -->
      <el-menu-item
        :index="route.path"
        v-if="route.meta?.isShow && !route.children"
        @click="handleNavigation(route.path)"
      >
        <!-- 菜单图标 -->
        <i :class="route.meta?.icon" />
        <!-- 菜单标题 -->
        <template #title>
          <span>{{ route.meta?.title }}</span>
        </template>
      </el-menu-item>
      <!-- 路由有且仅有一个子路由 -->
      <el-menu-item
        :index="route.children?.[0]?.path"
        v-else-if="
          route.children &&
          route.children?.length === 1 &&
          route.children?.[0]?.meta?.isShow
        "
        @click="handleNavigation(route.path)"
      >
        <!-- 菜单图标 -->
        <i :class="route.children?.[0]?.meta?.icon" />
        <!-- 菜单标题 -->
        <template #title>
          <span>{{ route.children?.[0]?.meta?.title }}</span>
        </template>
      </el-menu-item>
      <!-- 路由有多个子路由 -->
      <el-sub-menu
        :index="route.path"
        v-else-if="route.children && route.children?.length > 1"
      >
        <!-- 标题插槽 -->
        <template #title>
          <!-- 菜单图标 -->
          <i :class="route.meta?.icon" />
          <!-- 菜单标题 -->
          <span>{{ route.meta?.title }}</span>
        </template>
        <!-- 子路由元素 -->
        <menu-item :userMenuRoutes="route.children" :level="level + 1" />
      </el-sub-menu>
    </template>
    <!-- 二级路由判断逻辑 -->
    <template v-else>
      <el-menu-item
        :index="route.path"
        v-if="route.meta?.isShow"
        @click="handleNavigation(route.path)"
      >
        <!-- 菜单图标 -->
        <i :class="route.meta?.icon" />
        <!-- 菜单标题 -->
        <template #title>
          <span>{{ route.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>
  </template>
</template>

<style scoped lang="scss"></style>
