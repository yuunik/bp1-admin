<script setup>
import Logo from '@/assets/icons/logo.svg'
</script>

<template>
  <el-breadcrumb
    separator=">"
    class="p-[24px_32px_16px_32px] heading-body-body-12px-medium"
  >
    <el-breadcrumb-item>
      <img :src="Logo" alt="logo" />
    </el-breadcrumb-item>
    <el-breadcrumb-item
      v-for="route in $route.matched"
      :key="route.path"
      :to="route.path"
      v-show="route?.meta?.isShow"
    >
      <!-- 面包屑标题 -->
      <span
        class="heading-body-body-12px-medium"
        :class="
          $route.path === route.path ? 'neutrals-off-black' : 'neutrals-grey-3'
        "
      >
        {{ route.meta.title }}
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
