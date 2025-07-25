<script setup>
import MenuItem from '@/layout/components/MenuItem/index.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// 定义数据类型
defineProps({
  userMenuRoutes: {
    type: Array,
    required: true,
  },
})

const router = useRouter()

const activePath = ref("")
// 路由跳转
const goToPage = (path) => {
  activePath.value = path
  router.push(path)
}
</script>

<template>
  <!-- 菜单栏子元素 -->
  <template v-for="route in userMenuRoutes" :key="route.path">
    <!-- 路由没有子路由 -->
    <el-menu-item :index="route.path" v-if="route.meta.isShow && !route.children" @click="goToPage(route.path)">
      <!-- 菜单图标 -->
      <i :class="route.meta.icon" />
      <!-- 菜单标题 -->
      <template #title>
        <span>{{ route.meta.title }}</span>
      </template>
    </el-menu-item>
    <!-- 路由有且仅有一个子路由 -->
    <el-menu-item :index="route.children[0].path"
                  v-if="route.children && route.children.length === 1 && route.children[0].meta.isShow"
                  @click="goToPage(route.path)">
      <!-- 菜单图标 -->
      <i :class="route.children[0].meta.icon" />
      <!-- 菜单标题 -->
      <template #title>
        <span>{{ route.children[0].meta.title }}</span>
      </template>
    </el-menu-item>
    <!-- 路由有多个子路由 -->
    <el-sub-menu :index="route.path" v-if="route.children && route.children.length > 1"
                 @click="goToPage(route.path)">
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